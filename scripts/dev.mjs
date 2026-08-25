import { spawn } from "node:child_process";
import { existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";

const heartbeatFile = process.env.MINICRM_HEARTBEAT_FILE;
const instanceId = process.env.MINICRM_INSTANCE_ID;

function npmInvocation(args) {
  if (process.env.npm_execpath) {
    return { command: process.execPath, args: [process.env.npm_execpath, ...args] };
  }
  return { command: process.platform === "win32" ? "npm.cmd" : "npm", args };
}

function run(args) {
  const invocation = npmInvocation(args);
  return spawn(invocation.command, invocation.args, { stdio: "inherit", env: process.env });
}

function writeHeartbeat() {
  if (!heartbeatFile || !instanceId) return;
  const temporaryFile = `${heartbeatFile}.${process.pid}.tmp`;
  writeFileSync(
    temporaryFile,
    `${JSON.stringify({ pid: process.pid, instanceId, updatedAt: new Date().toISOString() })}\n`,
    "utf8",
  );
  renameSync(temporaryFile, heartbeatFile);
}

function removeHeartbeat() {
  if (!heartbeatFile || !existsSync(heartbeatFile)) return;
  try {
    const current = JSON.parse(readFileSync(heartbeatFile, "utf8"));
    if (current?.pid === process.pid && current?.instanceId === instanceId)
      unlinkSync(heartbeatFile);
  } catch {
    // A newer supervisor may already own the heartbeat file.
  }
}

writeHeartbeat();
const heartbeatInterval = heartbeatFile ? setInterval(writeHeartbeat, 1_000) : null;
process.on("exit", () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  removeHeartbeat();
});

const sharedBuild = run(["run", "build", "--workspace", "@minicrm/shared"]);

sharedBuild.on("exit", (code) => {
  if (code !== 0) {
    process.exit(code ?? 1);
  }

  const processes = [
    run(["run", "dev", "--workspace", "@minicrm/api"]),
    run(["run", "dev", "--workspace", "@minicrm/web"]),
  ];

  const stop = () => {
    for (const child of processes) child.kill("SIGTERM");
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  for (const child of processes) {
    child.on("exit", (childCode) => {
      stop();
      process.exit(childCode ?? 0);
    });
  }
});
