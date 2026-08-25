import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

import { assertSafeWorkshopDatabaseUrl, defaultDatabaseUrl } from "./lib/database-safety.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const environmentFile = resolve(projectRoot, ".env");
if (existsSync(environmentFile)) process.loadEnvFile(environmentFile);

const databaseUrl = process.env.DATABASE_URL ?? defaultDatabaseUrl;
assertSafeWorkshopDatabaseUrl(databaseUrl);

let confirmed = process.argv.includes("--yes") || process.env.MINICRM_RESET_CONFIRMED === "1";

if (!confirmed && process.stdin.isTTY) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await prompt.question(
    "Tento krok smaže lokální workshopová data a znovu vytvoří demo data. Napište RESET: ",
  );
  prompt.close();
  confirmed = answer.trim() === "RESET";
}

if (!confirmed) {
  console.error("Reset byl zrušen. Pro neinteraktivní použití přidejte --yes.");
  process.exit(1);
}

const prismaScript = resolve(projectRoot, "scripts/prisma.mjs");
const child = spawn(process.execPath, [prismaScript, "migrate", "reset", "--force"], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

child.once("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
child.once("exit", (code) => process.exit(code ?? 1));
