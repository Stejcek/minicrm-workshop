import type { FastifyInstance } from "fastify";

import type { CompanyService } from "../services/company-service.js";

export function registerCompanyRoutes(app: FastifyInstance, companies: CompanyService) {
  app.get("/api/companies", () => companies.list());
  app.get<{ Params: { id: string } }>("/api/companies/:id", (request) =>
    companies.get(request.params.id),
  );
  app.post("/api/companies", { config: { successStatusCode: 201 } }, (request, reply) =>
    companies.create(request.body).then((company) => reply.code(201).send(company)),
  );
  app.put<{ Params: { id: string } }>("/api/companies/:id", (request) =>
    companies.update(request.params.id, request.body),
  );
  app.delete<{ Params: { id: string } }>("/api/companies/:id", async (request, reply) => {
    await companies.remove(request.params.id);
    return reply.code(204).send();
  });
}
