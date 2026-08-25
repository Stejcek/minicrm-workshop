import { existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { buildApp } from "../src/app.js";

const testDbPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../../var/test.db");
const prisma = new PrismaClient({ datasourceUrl: `file:${testDbPath}` });
let app: FastifyInstance;

const validContact = {
  firstName: "Testovací",
  lastName: "Kontakt",
  email: "kontakt@example.test",
  phone: null,
  companyId: null,
  status: "NEW",
  nextContactAt: null,
};

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  if (existsSync(testDbPath)) rmSync(testDbPath);

  await prisma.$executeRawUnsafe("PRAGMA foreign_keys=ON");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE Company (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      website TEXT,
      industry TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE Contact (
      id TEXT NOT NULL PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      companyId TEXT,
      status TEXT NOT NULL DEFAULT 'NEW',
      nextContactAt DATETIME,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      CONSTRAINT Contact_companyId_fkey FOREIGN KEY (companyId) REFERENCES Company (id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE Activity (
      id TEXT NOT NULL PRIMARY KEY,
      contactId TEXT NOT NULL,
      type TEXT NOT NULL,
      text TEXT NOT NULL,
      occurredAt DATETIME NOT NULL,
      createdAt DATETIME NOT NULL,
      CONSTRAINT Activity_contactId_fkey FOREIGN KEY (contactId) REFERENCES Contact (id) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);

  app = await buildApp(prisma);
});

beforeEach(async () => {
  await prisma.activity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
  if (existsSync(testDbPath)) rmSync(testDbPath);
});

describe("MiniCRM API", () => {
  it("creates a company", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/companies",
      payload: { name: "Test Labs", website: "https://test.example", industry: "Výzkum" },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({ name: "Test Labs", industry: "Výzkum" });
  });

  it("validates a contact on the server", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/contacts",
      payload: { ...validContact, firstName: "", email: "neni-email" },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ message: "Jméno je povinné." });
  });

  it("creates and updates a contact", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/api/contacts",
      payload: validContact,
    });
    expect(created.statusCode).toBe(201);

    const contactId = created.json<{ id: string }>().id;
    const updated = await app.inject({
      method: "PUT",
      url: `/api/contacts/${contactId}`,
      payload: { ...validContact, firstName: "Upravený", status: "QUALIFIED" },
    });

    expect(updated.statusCode).toBe(200);
    expect(updated.json()).toMatchObject({ firstName: "Upravený", status: "QUALIFIED" });
  });

  it("searches contacts by name and email", async () => {
    await prisma.contact.createMany({
      data: [
        { ...validContact, id: "contact-search-1", firstName: "Ada", email: "ada@example.test" },
        { ...validContact, id: "contact-search-2", firstName: "Bela", email: "bela@sample.test" },
      ],
    });

    const byName = await app.inject({ method: "GET", url: "/api/contacts?q=Ada" });
    const byEmail = await app.inject({ method: "GET", url: "/api/contacts?q=sample" });

    expect(byName.json()).toHaveLength(1);
    expect(byEmail.json()).toHaveLength(1);
    expect(byEmail.json()[0]).toMatchObject({ firstName: "Bela" });
  });

  it("filters contacts by status and company", async () => {
    const company = await prisma.company.create({ data: { name: "Filter Company" } });
    await prisma.contact.createMany({
      data: [
        { ...validContact, id: "contact-filter-1", companyId: company.id, status: "WON" },
        { ...validContact, id: "contact-filter-2", email: "other@example.test", status: "NEW" },
      ],
    });

    const response = await app.inject({
      method: "GET",
      url: `/api/contacts?status=WON&companyId=${company.id}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({ status: "WON", companyId: company.id });
  });

  it("adds an activity and loads it with the contact detail", async () => {
    const contact = await prisma.contact.create({ data: validContact });
    const activity = await app.inject({
      method: "POST",
      url: `/api/contacts/${contact.id}/activities`,
      payload: {
        type: "NOTE",
        text: "Testovací poznámka",
        occurredAt: "2026-08-25T10:00:00.000Z",
      },
    });
    expect(activity.statusCode).toBe(201);

    const detail = await app.inject({ method: "GET", url: `/api/contacts/${contact.id}` });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().activities).toHaveLength(1);
    expect(detail.json().activities[0]).toMatchObject({ type: "NOTE", text: "Testovací poznámka" });
  });

  it("deletes a contact and its activities", async () => {
    const contact = await prisma.contact.create({ data: validContact });
    await prisma.activity.create({
      data: {
        contactId: contact.id,
        type: "CALL",
        text: "Hovor",
        occurredAt: new Date("2026-08-25T10:00:00.000Z"),
      },
    });

    const response = await app.inject({ method: "DELETE", url: `/api/contacts/${contact.id}` });

    expect(response.statusCode).toBe(204);
    expect(await prisma.activity.count()).toBe(0);
    expect(
      (await app.inject({ method: "GET", url: `/api/contacts/${contact.id}` })).statusCode,
    ).toBe(404);
  });

  it("blocks deleting a company that has contacts", async () => {
    const company = await prisma.company.create({ data: { name: "Protected Company" } });
    await prisma.contact.create({ data: { ...validContact, companyId: company.id } });

    const response = await app.inject({ method: "DELETE", url: `/api/companies/${company.id}` });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({
      message: "Firmu s přiřazenými kontakty nelze odstranit.",
    });
  });
});
