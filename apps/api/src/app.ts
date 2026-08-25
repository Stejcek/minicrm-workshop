import cors from "@fastify/cors";
import type { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import { ZodError } from "zod";

import { AppError } from "./errors.js";
import { CompanyRepository } from "./repositories/company-repository.js";
import { ContactRepository } from "./repositories/contact-repository.js";
import { registerCompanyRoutes } from "./routes/companies.js";
import { registerContactRoutes } from "./routes/contacts.js";
import { CompanyService } from "./services/company-service.js";
import { ContactService } from "./services/contact-service.js";

export async function buildApp(prisma: PrismaClient) {
  const app = Fastify({ logger: process.env.NODE_ENV !== "test" });

  await app.register(cors, {
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  });

  const companyService = new CompanyService(new CompanyRepository(prisma));
  const contactService = new ContactService(new ContactRepository(prisma), prisma);

  registerCompanyRoutes(app, companyService);
  registerContactRoutes(app, contactService);

  app.get("/api/health", () => ({ status: "ok" }));

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        message: error.issues[0]?.message ?? "Zkontrolujte zadané údaje.",
        issues: error.flatten().fieldErrors,
      });
    }
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }

    app.log.error(error);
    return reply.code(500).send({ message: "Požadavek se nepodařilo zpracovat." });
  });

  return app;
}
