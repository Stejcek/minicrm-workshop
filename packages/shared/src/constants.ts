export const CONTACT_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "WON",
  "LOST",
] as const;

export const ACTIVITY_TYPES = ["NOTE", "CALL", "EMAIL", "MEETING"] as const;

export const CONTACT_STATUS_LABELS = {
  NEW: "Nový",
  CONTACTED: "Kontaktovaný",
  QUALIFIED: "Kvalifikovaný",
  PROPOSAL: "Nabídka",
  WON: "Vyhráno",
  LOST: "Prohráno",
} as const;

export const ACTIVITY_TYPE_LABELS = {
  NOTE: "Poznámka",
  CALL: "Hovor",
  EMAIL: "E-mail",
  MEETING: "Schůzka",
} as const;
