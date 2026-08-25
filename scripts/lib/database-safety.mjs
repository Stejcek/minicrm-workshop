export const defaultDatabaseUrl = "file:./dev.db";

export function isSafeWorkshopDatabaseUrl(databaseUrl) {
  return databaseUrl === defaultDatabaseUrl;
}

export function assertSafeWorkshopDatabaseUrl(databaseUrl) {
  if (!isSafeWorkshopDatabaseUrl(databaseUrl)) {
    throw new Error(
      `Reset je povolen pouze pro výchozí lokální SQLite databázi (${defaultDatabaseUrl}). Aktuální hodnota: ${databaseUrl}`,
    );
  }
}
