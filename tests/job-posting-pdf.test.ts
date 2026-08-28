import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { generateJobPostingPdf, jobPostingPdfSections } from "../src/lib/careers/job-posting-pdf";
import type { JobPosting } from "../src/types/jobs";

const posting: JobPosting = { id: "00000000-0000-4000-8000-000000000010", templateId: null, jobTitle: "Construction Team Member", jobDescription: "Description ".repeat(250), jobDuties: "Duties", experienceRequired: "Experience", schedule: "Schedule", location: "Colorado", payRange: null, status: "open", createdAt: "2026-08-29T18:00:00Z", updatedAt: "2026-08-29T18:00:00Z", publishedAt: "2026-08-29T18:00:00Z", filledAt: null, closedAt: null };

test("job PDF is readable across pages and contains a configured QR destination", async () => {
  const generated = await generateJobPostingPdf(posting, "https://preview.example.com");
  assert.equal(generated.qrTarget, "https://preview.example.com/careers"); assert.match(generated.filename, /^Axe_Job_Construction_Team_Member\.pdf$/);
  const document = await PDFDocument.load(generated.bytes); assert.ok(document.getPageCount() >= 2); assert.equal(document.getAuthor(), "Axe Build, LLC");
});
test("job PDF omits a blank pay range and includes it when populated", () => {
  assert.equal(jobPostingPdfSections(posting).some(([title]) => title === "PAY RANGE"), false);
  assert.equal(jobPostingPdfSections({ ...posting, payRange: "$20–$30" }).some(([title]) => title === "PAY RANGE"), true);
});
