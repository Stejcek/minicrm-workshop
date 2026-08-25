import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import { buildApp } from "./app.js";
import { createPrismaClient } from "./plugins/prisma.js";

const rootEnv = resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env");
if (existsSync(rootEnv)) dotenv.config({ path: rootEnv });
process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = createPrismaClient();
const app = await buildApp(prisma);
const port = Number(process.env.API_PORT ?? 3001);

const close = async () => {
  await app.close();
  await prisma.$disconnect();
};

process.on("SIGINT", close);
process.on("SIGTERM", close);

try {
  await app.listen({ host: "127.0.0.1", port });
} catch (error) {
  app.log.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
