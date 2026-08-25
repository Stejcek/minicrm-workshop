import { z } from "zod";

import { ACTIVITY_TYPES } from "../constants.js";

export const activityInputSchema = z.object({
  type: z.enum(ACTIVITY_TYPES, { errorMap: () => ({ message: "Neplatný typ aktivity." }) }),
  text: z.string().trim().min(1, "Text aktivity je povinný."),
  occurredAt: z.string().datetime({ offset: true, message: "Zadejte platné datum aktivity." }),
});

export type ActivityInput = z.infer<typeof activityInputSchema>;
