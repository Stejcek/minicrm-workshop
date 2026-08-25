import { emitKeypressEvents } from "node:readline";

import {
  formatDuration,
  getRuntimeStatus,
  logFile,
  openWeb,
  readLogTail,
  resetDemoDatabase,
  restartApp,
  runProjectScript,
  startApp,
  stopApp,
  urls,
} from "./lib/minicrm-process.mjs";

const colors = {
  reset: "\u001B[0m",
  bold: "\u001B[1m",
  dim: "\u001B[2m",
  green: "\u001B[32m",
  yellow: "\u001B[33m",
  red: "\u001B[31m",
  cyan: "\u001B[36m",
};

let status = await getRuntimeStatus();
let message = "Připraveno.";
let busy = false;
let refreshing = false;
let resetConfirmationUntil = 0;

function cleanLogLine(line) {
  // eslint-disable-next-line no-control-regex
  return line.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "");
}

function processLabel() {
  const state = status.processStatus.state;
  if (state === "running" && status.apiOk && status.webOk) {
    return `${colors.green}● BĚŽÍ${colors.reset}  API ✓  Web ✓`;
  }
  if (state === "running") {
    return `${colors.yellow}● SPOUŠTÍ SE / NEODPOVÍDÁ${colors.reset}  API ${status.apiOk ? "✓" : "–"}  Web ${status.webOk ? "✓" : "–"}`;
  }
  if (state === "foreign") return `${colors.red}● NEOVĚŘENÝ PID${colors.reset}`;
  if (state === "stale") return `${colors.yellow}● ZASTARALÝ PID${colors.reset}`;
  return `${colors.dim}○ ZASTAVENO${colors.reset}`;
}

function truncate(line, width) {
  return line.length <= width ? line : `${line.slice(0, Math.max(0, width - 1))}…`;
}

function render() {
  const width = Math.max(60, Math.min(process.stdout.columns ?? 100, 120));
  const logLines = readLogTail(Math.max(8, (process.stdout.rows ?? 28) - 16));
  const record = status.processStatus.record;

  process.stdout.write("\u001B[2J\u001B[H");
  process.stdout.write(
    `${colors.bold}${colors.cyan}MiniCRM${colors.reset}  lokální ovládání pro macOS\n`,
  );
  process.stdout.write(`${"─".repeat(width)}\n\n`);
  process.stdout.write(`Stav:       ${processLabel()}\n`);
  if (record) {
    process.stdout.write(`PID:        ${record.pid}\n`);
    process.stdout.write(
      `Spuštěno:   ${new Date(record.startedAt).toLocaleString("cs-CZ")} (${formatDuration(record.startedAt)})\n`,
    );
  }
  process.stdout.write(`Web:        ${urls.web}\n`);
  process.stdout.write(`Log:        ${logFile}\n\n`);
  process.stdout.write(
    `${colors.bold}[s]${colors.reset} spustit  ${colors.bold}[x]${colors.reset} zastavit  ${colors.bold}[r]${colors.reset} restart  ${colors.bold}[o]${colors.reset} otevřít web\n`,
  );
  process.stdout.write(
    `${colors.bold}[m]${colors.reset} migrace  ${colors.bold}[d]${colors.reset} demo data  ${colors.bold}[z]${colors.reset} obnovit DB  ${colors.bold}[q]${colors.reset} ukončit TUI\n\n`,
  );
  process.stdout.write(`${colors.bold}Poslední logy${colors.reset}\n`);
  process.stdout.write(`${"─".repeat(width)}\n`);
  if (logLines.length === 0)
    process.stdout.write(`${colors.dim}Log je zatím prázdný.${colors.reset}\n`);
  for (const line of logLines)
    process.stdout.write(`${colors.dim}${truncate(cleanLogLine(line), width)}${colors.reset}\n`);
  process.stdout.write(
    `\n${busy ? colors.yellow : colors.green}${truncate(message, width)}${colors.reset}\n`,
  );
}

async function refresh() {
  if (refreshing) return;
  refreshing = true;
  try {
    status = await getRuntimeStatus();
    render();
  } finally {
    refreshing = false;
  }
}

async function action(label, callback) {
  if (busy) return;
  busy = true;
  message = `${label}…`;
  render();
  try {
    await callback();
    message = `${label}: hotovo.`;
  } catch (error) {
    message = error instanceof Error ? error.message : `${label} se nezdařilo.`;
  } finally {
    busy = false;
    await refresh();
  }
}

function cleanup() {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdout.write(`${colors.reset}\u001B[?25h\n`);
}

async function runCommand(command) {
  if (command === "start") {
    await startApp();
    console.log("MiniCRM bylo spuštěno.");
  } else if (command === "stop") {
    console.log((await stopApp()) ? "MiniCRM bylo zastaveno." : "MiniCRM neběží.");
  } else if (command === "restart") {
    await restartApp();
    console.log("MiniCRM bylo restartováno.");
  } else if (command === "logs") {
    console.log(readLogTail(80).join("\n") || "Log je zatím prázdný.");
  } else if (command === "migrate") {
    await runProjectScript("db:migrate", "Databázová migrace");
    console.log("Migrace byla dokončena.");
  } else if (command === "seed") {
    await runProjectScript("db:seed", "Seed demonstračních dat");
    console.log("Demonstrační data byla připravena.");
  } else if (command === "reset") {
    if (!process.argv.includes("--yes")) {
      throw new Error("Reset vyžaduje výslovné potvrzení: npm run crm -- reset --yes");
    }
    await resetDemoDatabase();
    console.log("Demonstrační databáze byla obnovena.");
  } else if (command === "status") {
    const current = await getRuntimeStatus();
    console.log(`Proces: ${current.processStatus.state}`);
    console.log(`API: ${current.apiOk ? "odpovídá" : "neodpovídá"}`);
    console.log(`Web: ${current.webOk ? "odpovídá" : "neodpovídá"}`);
    if (current.processStatus.record) console.log(`PID: ${current.processStatus.record.pid}`);
  } else {
    console.log(
      "Použití: npm run crm -- [start|stop|restart|status|logs|migrate|seed|reset --yes]",
    );
    process.exitCode = command ? 1 : 0;
  }
}

const command = process.argv[2];
if (command || !process.stdin.isTTY || !process.stdout.isTTY) {
  try {
    await runCommand(command ?? "status");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Příkaz se nezdařil.");
    process.exitCode = 1;
  }
} else {
  process.stdout.write("\u001B[?25l");
  render();
  const interval = setInterval(refresh, 1_000);
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("keypress", (_input, key) => {
    const keyName = key.ctrl && key.name === "c" ? "q" : key.name;
    if (keyName === "q") {
      clearInterval(interval);
      cleanup();
      process.removeListener("exit", cleanup);
      process.exit(0);
    } else if (keyName === "s") {
      void action("Spuštění MiniCRM", startApp);
    } else if (keyName === "x") {
      void action("Zastavení MiniCRM", stopApp);
    } else if (keyName === "r") {
      void action("Restart MiniCRM", restartApp);
    } else if (keyName === "m") {
      void action("Databázová migrace", () => runProjectScript("db:migrate", "Databázová migrace"));
    } else if (keyName === "d") {
      void action("Seed demonstračních dat", () =>
        runProjectScript("db:seed", "Seed demonstračních dat"),
      );
    } else if (keyName === "z") {
      if (Date.now() < resetConfirmationUntil) {
        resetConfirmationUntil = 0;
        void action("Obnova demonstrační databáze", resetDemoDatabase);
      } else {
        resetConfirmationUntil = Date.now() + 5_000;
        message = "Pozor: reset smaže lokální data. Do 5 sekund znovu stiskněte [z].";
        render();
      }
    } else if (keyName === "o") {
      openWeb();
      message = "Web byl otevřen ve výchozím prohlížeči.";
      render();
    }
  });

  process.on("exit", cleanup);
}
