import { z } from "zod";

import { CONTACT_STATUSES } from "../constants.js";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .optional();

const optionalDateTime = z
  .union([z.string().datetime({ offset: true }), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value ? value : null));

export const contactInputSchema = z.object({
  firstName: z.string().trim().min(1, "Jméno je povinné."),
  lastName: z.string().trim().min(1, "Příjmení je povinné."),
  email: z.string().trim().email("Zadejte platnou e-mailovou adresu."),
  phone: optionalText,
  companyId: optionalText,
  status: z.enum(CONTACT_STATUSES, { errorMap: () => ({ message: "Neplatný stav kontaktu." }) }),
  nextContactAt: optionalDateTime,
});

export const contactQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(CONTACT_STATUSES).optional(),
  companyId: z.string().trim().min(1).optional(),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
export type ContactQuery = z.infer<typeof contactQuerySchema>;
