import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import { formatDuration, parsePidRecord, readTail } from "./minicrm-process.mjs";
import { isSafeWorkshopDatabaseUrl } from "./database-safety.mjs";

const temporaryDirectory = mkdtempSync(join(tmpdir(), "minicrm-tui-test-"));

after(() => rmSync(temporaryDirectory, { recursive: true, force: true }));

test("parsePidRecord accepts only a safe PID record", () => {
  const record = {
    pid: 1234,
    startedAt: "2026-08-25T10:00:00.000Z",
    instanceId: "test-instance-id",
  };
  assert.deepEqual(parsePidRecord(record), record);
  assert.equal(parsePidRecord({ pid: -1, startedAt: "today" }), null);
  assert.equal(parsePidRecord({ pid: 1234 }), null);
});

test("readTail returns only the requested final log lines", () => {
  const file = join(temporaryDirectory, "application.log");
  writeFileSync(file, "první\ndruhý\ntřetí\nčtvrtý\n", "utf8");

  assert.deepEqual(readTail(file, 2), ["třetí", "čtvrtý"]);
  assert.deepEqual(readTail(join(temporaryDirectory, "missing.log"), 2), []);
});

test("formatDuration formats elapsed minutes and hours", () => {
  const startedAt = "2026-08-25T10:00:00.000Z";
  assert.equal(formatDuration(startedAt, Date.parse("2026-08-25T10:42:00.000Z")), "42 min");
  assert.equal(formatDuration(startedAt, Date.parse("2026-08-25T12:05:00.000Z")), "2 h 5 min");
});

test("database reset accepts only the default local workshop database", () => {
  assert.equal(isSafeWorkshopDatabaseUrl("file:./dev.db"), true);
  assert.equal(isSafeWorkshopDatabaseUrl("file:/tmp/other.db"), false);
  assert.equal(isSafeWorkshopDatabaseUrl("postgresql://production.example/crm"), false);
});
