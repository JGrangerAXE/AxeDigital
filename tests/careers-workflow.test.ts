import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createSubmissionGate } from "../src/lib/careers/submission-gate";
import { submitEmploymentApplication } from "../src/lib/careers/submit-application";
import { RESUME_MIME_TYPES } from "../src/lib/validation/careers";

const input = {
  fullName: "Test Applicant",
  phone: "555-0100",
  email: "applicant@example.com",
  careerArea: "Construction" as const,
  relevantExperience: "Test experience",
  preferredContactMethod: "Email" as const,
  bestTimeToContact: "Afternoon",
  optionalMessage: null,
};

test("submission gate prevents duplicate starts until the request finishes", () => {
  const gate = createSubmissionGate();
  assert.equal(gate.tryStart(), true);
  assert.equal(gate.tryStart(), false);
  assert.equal(gate.isActive(), true);
  gate.finish();
  assert.equal(gate.tryStart(), true);
});

test("email failure preserves the stored application and private resume", async () => {
  const events: string[] = [];
  const resumeBytes = new TextEncoder().encode("%PDF-1.4\n%%EOF");
  const resume = {
    file: new File([resumeBytes], "resume.pdf", { type: RESUME_MIME_TYPES.pdf }),
    originalFilename: "resume.pdf",
    sanitizedFilename: "resume.pdf",
    mimeType: RESUME_MIME_TYPES.pdf,
    sizeBytes: resumeBytes.length,
    bytes: resumeBytes,
  };
  const repository = {
    async uploadResume() { events.push("resume-uploaded"); return "test-id/resume.pdf"; },
    async removeResume() { events.push("resume-removed"); },
    async insertApplication() { events.push("application-inserted"); },
    async markEmailSent() { events.push("email-sent-recorded"); },
    async markEmailFailed() { events.push("email-failed-recorded"); },
  };

  const result = await submitEmploymentApplication(input, resume, {
    repository,
    emailProvider: { async sendApplication() { throw new Error("Simulated provider failure"); } },
    async generatePdf() { return { bytes: new Uint8Array([1]), filename: "summary.pdf" }; },
    createId: () => "00000000-0000-4000-8000-000000000001",
    now: () => new Date("2026-08-28T18:00:00.000Z"),
  });

  assert.equal(result.emailDeliveryStatus, "failed");
  assert.deepEqual(events, ["resume-uploaded", "application-inserted", "email-failed-recorded"]);
});

test("database failure cleans up an uploaded resume", async () => {
  const events: string[] = [];
  const resumeBytes = new TextEncoder().encode("%PDF-1.4\n%%EOF");
  const resume = {
    file: new File([resumeBytes], "resume.pdf", { type: RESUME_MIME_TYPES.pdf }),
    originalFilename: "resume.pdf",
    sanitizedFilename: "resume.pdf",
    mimeType: RESUME_MIME_TYPES.pdf,
    sizeBytes: resumeBytes.length,
    bytes: resumeBytes,
  };
  await assert.rejects(() => submitEmploymentApplication(input, resume, {
    repository: {
      async uploadResume() { events.push("resume-uploaded"); return "test-id/resume.pdf"; },
      async removeResume() { events.push("resume-removed"); },
      async insertApplication() { events.push("insert-failed"); throw new Error("Simulated insert failure"); },
      async markEmailSent() {},
      async markEmailFailed() {},
    },
    emailProvider: { async sendApplication() { return { providerMessageId: "unused" }; } },
    async generatePdf() { return { bytes: new Uint8Array([1]), filename: "summary.pdf" }; },
    createId: () => "00000000-0000-4000-8000-000000000001",
  }));
  assert.deepEqual(events, ["resume-uploaded", "insert-failed", "resume-removed"]);
});

test("migration keeps application records and resume storage private", async () => {
  const sql = await readFile(
    new URL("../supabase/migrations/20260828000100_employment_applications.sql", import.meta.url),
    "utf8",
  );
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /force row level security/i);
  assert.match(sql, /revoke all on table public\.employment_applications from anon, authenticated/i);
  assert.match(sql, /'employment-resumes'[\s\S]+false/i);
  assert.doesNotMatch(sql, /create\s+policy/i);
});
