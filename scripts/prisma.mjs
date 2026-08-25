import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = resolve(root, ".env");

if (existsSync(envFile)) process.loadEnvFile(envFile);
process.env.DATABASE_URL ??= "file:./dev.db";

const requireFromApi = createRequire(resolve(root, "apps/api/package.json"));
const prismaCli = requireFromApi.resolve("prisma/build/index.js");
const child = spawn(process.execPath, [prismaCli, ...process.argv.slice(2)], {
  cwd: resolve(root, "apps/api"),
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 1));
