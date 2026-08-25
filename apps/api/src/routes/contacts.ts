import type { FastifyInstance } from "fastify";

import type { ContactService } from "../services/contact-service.js";

export function registerContactRoutes(app: FastifyInstance, contacts: ContactService) {
  app.get("/api/dashboard", () => contacts.dashboard());
  app.get("/api/contacts", (request) => contacts.list(request.query));
  app.get<{ Params: { id: string } }>("/api/contacts/:id", (request) =>
    contacts.get(request.params.id),
  );
  app.post("/api/contacts", (request, reply) =>
    contacts.create(request.body).then((contact) => reply.code(201).send(contact)),
  );
  app.put<{ Params: { id: string } }>("/api/contacts/:id", (request) =>
    contacts.update(request.params.id, request.body),
  );
  app.delete<{ Params: { id: string } }>("/api/contacts/:id", async (request, reply) => {
    await contacts.remove(request.params.id);
    return reply.code(204).send();
  });
  app.post<{ Params: { id: string } }>("/api/contacts/:id/activities", (request, reply) =>
    contacts
      .addActivity(request.params.id, request.body)
      .then((activity) => reply.code(201).send(activity)),
  );
}
