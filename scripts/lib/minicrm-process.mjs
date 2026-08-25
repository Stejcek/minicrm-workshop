import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  appendFileSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { assertSafeWorkshopDatabaseUrl, defaultDatabaseUrl } from "./database-safety.mjs";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const runtimeDirectory = resolve(projectRoot, "var");
export const logFile = resolve(runtimeDirectory, "minicrm.log");
export const pidFile = resolve(runtimeDirectory, "minicrm.pid.json");
export const heartbeatFile = resolve(runtimeDirectory, "minicrm.heartbeat.json");

const environmentFile = resolve(projectRoot, ".env");
if (existsSync(environmentFile)) process.loadEnvFile(environmentFile);

const webUrl = "http://127.0.0.1:5173";
const apiHealthUrl = `http://127.0.0.1:${process.env.API_PORT ?? "3001"}/api/health`;

function ensureRuntimeDirectory() {
  mkdirSync(runtimeDirectory, { recursive: true });
}

export function appendLog(message) {
  ensureRuntimeDirectory();
  appendFileSync(logFile, `[TUI ${new Date().toISOString()}] ${message}\n`, "utf8");
}

export function parsePidRecord(value) {
  if (!value || typeof value !== "object") return null;
  const { pid, startedAt, instanceId } = value;
  if (
    !Number.isSafeInteger(pid) ||
    pid <= 1 ||
    typeof startedAt !== "string" ||
    typeof instanceId !== "string" ||
    instanceId.length < 8
  ) {
    return null;
  }
  return { pid, startedAt, instanceId };
}

export function readPidRecord() {
  if (!existsSync(pidFile)) return null;

  try {
    return parsePidRecord(JSON.parse(readFileSync(pidFile, "utf8")));
  } catch {
    return null;
  }
}

function writePidRecord(record) {
  ensureRuntimeDirectory();
  const temporaryFile = `${pidFile}.tmp`;
  writeFileSync(temporaryFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  renameSync(temporaryFile, pidFile);
}

function removePidFile() {
  if (existsSync(pidFile)) unlinkSync(pidFile);
}

function removeHeartbeatFile() {
  if (existsSync(heartbeatFile)) unlinkSync(heartbeatFile);
}

function isProcessGroupAlive(processGroupId) {
  try {
    process.kill(-processGroupId, 0);
    return true;
  } catch (error) {
    return error instanceof Error && "code" in error && error.code === "EPERM";
  }
}

function hasMatchingHeartbeat(record) {
  if (!existsSync(heartbeatFile)) return false;
  try {
    const heartbeat = JSON.parse(readFileSync(heartbeatFile, "utf8"));
    return (
      heartbeat?.pid === record.pid &&
      heartbeat?.instanceId === record.instanceId &&
      typeof heartbeat?.updatedAt === "string" &&
      Date.now() - new Date(heartbeat.updatedAt).getTime() < 5_000
    );
  } catch {
    return false;
  }
}

export function getTrackedProcess() {
  const record = readPidRecord();
  if (!record) return { state: "stopped", record: null };
  if (!isProcessGroupAlive(record.pid)) return { state: "stale", record };
  const inStartupGracePeriod = Date.now() - new Date(record.startedAt).getTime() < 8_000;
  if (!hasMatchingHeartbeat(record) && !inStartupGracePeriod) return { state: "foreign", record };
  return { state: "running", record };
}

function npmInvocation(args) {
  if (process.env.npm_execpath) {
    return { command: process.execPath, args: [process.env.npm_execpath, ...args] };
  }

  return { command: process.platform === "win32" ? "npm.cmd" : "npm", args };
}

function waitForSpawn(child) {
  return new Promise((resolveSpawn, rejectSpawn) => {
    child.once("spawn", resolveSpawn);
    child.once("error", rejectSpawn);
  });
}

export async function startApp() {
  const tracked = getTrackedProcess();
  if (tracked.state === "running") return tracked;
  if (tracked.state === "foreign") {
    throw new Error(`PID ${tracked.record?.pid} patří jinému procesu. Zkontrolujte ${pidFile}.`);
  }
  if (tracked.state === "stale") {
    removePidFile();
    removeHeartbeatFile();
  }

  ensureRuntimeDirectory();
  appendLog("Spouštím MiniCRM.");
  const logDescriptor = openSync(logFile, "a");
  const instanceId = randomUUID();
  const child = spawn(process.execPath, [resolve(projectRoot, "scripts/dev.mjs")], {
    cwd: projectRoot,
    detached: true,
    env: {
      ...process.env,
      FORCE_COLOR: "0",
      MINICRM_HEARTBEAT_FILE: heartbeatFile,
      MINICRM_INSTANCE_ID: instanceId,
    },
    stdio: ["ignore", logDescriptor, logDescriptor],
  });

  try {
    await waitForSpawn(child);
  } finally {
    closeSync(logDescriptor);
  }

  if (!child.pid) throw new Error("Proces MiniCRM se nepodařilo spustit.");
  const record = { pid: child.pid, startedAt: new Date().toISOString(), instanceId };
  writePidRecord(record);
  child.unref();
  return { state: "running", record };
}

function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));
}

export async function stopApp({ timeoutMs = 5_000 } = {}) {
  const tracked = getTrackedProcess();
  if (tracked.state === "stopped") return false;
  if (tracked.state === "stale") {
    removePidFile();
    removeHeartbeatFile();
    appendLog("Odstraněn zastaralý PID soubor.");
    return false;
  }
  if (tracked.state === "foreign" || !tracked.record) {
    throw new Error(
      `PID ${tracked.record?.pid} nebyl rozpoznán jako MiniCRM. Proces nebyl zastaven.`,
    );
  }

  appendLog(`Zastavuji MiniCRM (procesní skupina ${tracked.record.pid}).`);
  process.kill(-tracked.record.pid, "SIGTERM");
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline && isProcessGroupAlive(tracked.record.pid)) {
    await wait(100);
  }

  if (isProcessGroupAlive(tracked.record.pid)) {
    appendLog("Proces nereagoval na SIGTERM, odesílám SIGKILL.");
    process.kill(-tracked.record.pid, "SIGKILL");
  }

  removePidFile();
  removeHeartbeatFile();
  appendLog("MiniCRM bylo zastaveno.");
  return true;
}

export async function restartApp() {
  await stopApp();
  return startApp();
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(700) });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getRuntimeStatus() {
  const processStatus = getTrackedProcess();
  if (processStatus.state !== "running") {
    return { processStatus, apiOk: false, webOk: false };
  }

  const [apiOk, webOk] = await Promise.all([checkUrl(apiHealthUrl), checkUrl(webUrl)]);
  return { processStatus, apiOk, webOk };
}

export function readTail(filePath, lineCount = 16, maximumBytes = 65_536) {
  if (!existsSync(filePath)) return [];
  const size = statSync(filePath).size;
  if (size === 0) return [];

  const bytesToRead = Math.min(size, maximumBytes);
  const descriptor = openSync(filePath, "r");
  const buffer = Buffer.alloc(bytesToRead);

  try {
    readSync(descriptor, buffer, 0, bytesToRead, size - bytesToRead);
  } finally {
    closeSync(descriptor);
  }

  return buffer.toString("utf8").replaceAll("\r", "").split("\n").filter(Boolean).slice(-lineCount);
}

export function readLogTail(lineCount = 16) {
  return readTail(logFile, lineCount);
}

export function formatDuration(startedAt, now = Date.now()) {
  const duration = Math.max(0, now - new Date(startedAt).getTime());
  const totalMinutes = Math.floor(duration / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
}

export async function runProjectScript(scriptName, label, { additionalEnvironment = {} } = {}) {
  ensureRuntimeDirectory();
  appendLog(`Spouštím úlohu: ${label}.`);
  const logDescriptor = openSync(logFile, "a");
  const invocation = npmInvocation(["run", scriptName]);
  const child = spawn(invocation.command, invocation.args, {
    cwd: projectRoot,
    env: { ...process.env, ...additionalEnvironment, FORCE_COLOR: "0" },
    stdio: ["ignore", logDescriptor, logDescriptor],
  });

  try {
    await waitForSpawn(child);
    const code = await new Promise((resolveExit) => child.once("exit", resolveExit));
    if (code !== 0) throw new Error(`${label} skončil s kódem ${code ?? "?"}.`);
    appendLog(`Úloha dokončena: ${label}.`);
  } finally {
    closeSync(logDescriptor);
  }
}

export async function resetDemoDatabase() {
  const tracked = getTrackedProcess();
  if (tracked.state === "running") {
    throw new Error("Před obnovením databáze nejprve zastavte MiniCRM.");
  }
  if (tracked.state === "foreign") {
    throw new Error("Reset byl zablokován kvůli neověřenému běžícímu procesu.");
  }
  if (tracked.state === "stale") await stopApp();

  assertSafeWorkshopDatabaseUrl(process.env.DATABASE_URL ?? defaultDatabaseUrl);
  return runProjectScript("db:reset", "Obnova demonstrační databáze", {
    additionalEnvironment: { MINICRM_RESET_CONFIRMED: "1" },
  });
}

export function openWeb() {
  const child = spawn("open", [webUrl], { detached: true, stdio: "ignore" });
  child.unref();
}

export const urls = { web: webUrl, apiHealth: apiHealthUrl };
