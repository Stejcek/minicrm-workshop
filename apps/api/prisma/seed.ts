import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const rootEnv = resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env");
if (existsSync(rootEnv)) dotenv.config({ path: rootEnv });
process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();

const companies = [
  {
    id: "demo-company-acme",
    name: "Acme Demo s.r.o.",
    website: "https://acme.example",
    industry: "Výroba",
  },
  {
    id: "demo-company-northstar",
    name: "Northstar Labs",
    website: "https://northstar.example",
    industry: "Výzkum",
  },
  {
    id: "demo-company-blue-meadow",
    name: "Blue Meadow Studio",
    website: "https://bluemeadow.example",
    industry: "Design",
  },
  {
    id: "demo-company-example",
    name: "Example Industries",
    website: null,
    industry: "Technologie",
  },
  {
    id: "demo-company-silver-pine",
    name: "Silver Pine Works",
    website: "https://silverpine.example",
    industry: "Stavebnictví",
  },
  {
    id: "demo-company-bright-path",
    name: "Bright Path Consulting",
    website: null,
    industry: "Poradenství",
  },
] as const;

const contacts = [
  [
    "demo-contact-01",
    "Alena",
    "Jiskrová",
    "alena.jiskrova@example.test",
    "+420 700 000 101",
    "demo-company-acme",
    "NEW",
    2,
  ],
  [
    "demo-contact-02",
    "Borek",
    "Měsíček",
    "borek.mesicek@example.test",
    null,
    "demo-company-acme",
    "CONTACTED",
    4,
  ],
  [
    "demo-contact-03",
    "Cecílie",
    "Vrbová",
    "cecilie.vrbova@example.test",
    "+420 700 000 103",
    "demo-company-northstar",
    "QUALIFIED",
    7,
  ],
  [
    "demo-contact-04",
    "Dalibor",
    "Skála",
    "dalibor.skala@example.test",
    null,
    "demo-company-northstar",
    "PROPOSAL",
    null,
  ],
  [
    "demo-contact-05",
    "Eliška",
    "Obláčková",
    "eliska.oblackova@example.test",
    "+420 700 000 105",
    "demo-company-blue-meadow",
    "WON",
    10,
  ],
  [
    "demo-contact-06",
    "Filip",
    "Modřín",
    "filip.modrin@example.test",
    null,
    "demo-company-blue-meadow",
    "LOST",
    null,
  ],
  [
    "demo-contact-07",
    "Gabriela",
    "Kompasová",
    "gabriela.kompasova@example.test",
    "+420 700 000 107",
    "demo-company-example",
    "NEW",
    12,
  ],
  [
    "demo-contact-08",
    "Hubert",
    "Lípa",
    "hubert.lipa@example.test",
    null,
    "demo-company-example",
    "CONTACTED",
    null,
  ],
  [
    "demo-contact-09",
    "Iveta",
    "Paprsková",
    "iveta.paprskova@example.test",
    "+420 700 000 109",
    "demo-company-silver-pine",
    "QUALIFIED",
    15,
  ],
  [
    "demo-contact-10",
    "Jonáš",
    "Křemen",
    "jonas.kremen@example.test",
    null,
    "demo-company-silver-pine",
    "PROPOSAL",
    18,
  ],
  [
    "demo-contact-11",
    "Klára",
    "Javorová",
    "klara.javorova@example.test",
    "+420 700 000 111",
    "demo-company-bright-path",
    "WON",
    null,
  ],
  [
    "demo-contact-12",
    "Leopold",
    "Pěšina",
    "leopold.pesina@example.test",
    null,
    "demo-company-bright-path",
    "NEW",
    21,
  ],
  [
    "demo-contact-13",
    "Milena",
    "Hvězdná",
    "milena.hvezdna@example.test",
    "+420 700 000 113",
    null,
    "CONTACTED",
    null,
  ],
  [
    "demo-contact-14",
    "Norbert",
    "Blankytný",
    "norbert.blankytny@example.test",
    null,
    null,
    "QUALIFIED",
    25,
  ],
  [
    "demo-contact-15",
    "Olivie",
    "Veselá",
    "olivie.vesela@example.test",
    "+420 700 000 115",
    null,
    "LOST",
    null,
  ],
] as const;

const activityTypes = ["NOTE", "CALL", "EMAIL", "MEETING"] as const;

function futureContactDate(daysFromSeed: number, position: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromSeed);
  date.setHours(8 + (position % 7), position % 2 === 0 ? 0 : 30, 0, 0);
  return date;
}

async function seed() {
  for (const company of companies) {
    await prisma.company.upsert({
      where: { id: company.id },
      update: { name: company.name, website: company.website, industry: company.industry },
      create: company,
    });
  }

  for (const [position, contact] of contacts.entries()) {
    const [id, firstName, lastName, email, phone, companyId, status, nextContactInDays] = contact;
    const data = {
      firstName,
      lastName,
      email,
      phone,
      companyId,
      status,
      nextContactAt:
        nextContactInDays === null ? null : futureContactDate(nextContactInDays, position),
    };
    await prisma.contact.upsert({ where: { id }, update: data, create: { id, ...data } });
  }

  for (let index = 0; index < 24; index += 1) {
    const id = `demo-activity-${String(index + 1).padStart(2, "0")}`;
    const contactId = contacts[index % contacts.length]?.[0] ?? "demo-contact-01";
    const type = activityTypes[index % activityTypes.length] ?? "NOTE";
    const occurredAt = new Date(Date.UTC(2026, 7, 1 + index, 8 + (index % 7), 0));
    const text =
      type === "NOTE"
        ? "Doplněny podklady k dalšímu rozhovoru."
        : type === "CALL"
          ? "Proběhl krátký úvodní hovor."
          : type === "EMAIL"
            ? "Odesláno shrnutí domluvených kroků."
            : "Proběhla demonstrační schůzka.";

    await prisma.activity.upsert({
      where: { id },
      update: { contactId, type, text, occurredAt },
      create: { id, contactId, type, text, occurredAt },
    });
  }
}

seed()
  .then(() => console.log("Demonstrační data MiniCRM byla připravena."))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Seed se nezdařil.");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
