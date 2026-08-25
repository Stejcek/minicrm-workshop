import { describe, expect, it } from "vitest";

import { buildContactSearchParams } from "./client";

describe("buildContactSearchParams", () => {
  it("serializes only active filters", () => {
    expect(buildContactSearchParams({ q: "Ada Lovelace", status: "NEW" })).toBe(
      "q=Ada+Lovelace&status=NEW",
    );
    expect(buildContactSearchParams({})).toBe("");
  });
});
