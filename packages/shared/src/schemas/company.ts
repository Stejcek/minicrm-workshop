import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .optional();

export const companyInputSchema = z.object({
  name: z.string().trim().min(1, "Název firmy je povinný."),
  website: optionalText,
  industry: optionalText,
});

export type CompanyInput = z.infer<typeof companyInputSchema>;
