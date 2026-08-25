import { describe, expect, it } from "vitest";

import { activityInputSchema } from "./activity.js";
import { companyInputSchema } from "./company.js";
import { contactInputSchema } from "./contact.js";

describe("contactInputSchema", () => {
  const validContact = {
    firstName: "Alena",
    lastName: "Novotná",
    email: "alena@example.test",
    status: "NEW",
    nextContactAt: null,
  };

  it("accepts a valid contact", () => {
    expect(contactInputSchema.safeParse(validContact).success).toBe(true);
  });

  it.each([
    [{ ...validContact, firstName: "" }, "Jméno je povinné."],
    [{ ...validContact, lastName: " " }, "Příjmení je povinné."],
    [{ ...validContact, email: "invalid" }, "Zadejte platnou e-mailovou adresu."],
    [{ ...validContact, status: "UNKNOWN" }, "Neplatný stav kontaktu."],
  ])("rejects an invalid contact", (input, message) => {
    const result = contactInputSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe(message);
  });
});

describe("companyInputSchema", () => {
  it("rejects a blank company name", () => {
    const result = companyInputSchema.safeParse({ name: " " });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe("Název firmy je povinný.");
  });
});

describe("activityInputSchema", () => {
  it("rejects an unknown type and blank text", () => {
    const result = activityInputSchema.safeParse({
      type: "VISIT",
      text: " ",
      occurredAt: "2026-08-25T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});
