import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { generateApplicantSummaryPdf } from "../src/lib/careers/applicant-pdf";

test("generates a readable branded applicant-summary PDF with a standardized filename", async () => {
  const generated = await generateApplicantSummaryPdf({
    applicationId: "00000000-0000-4000-8000-000000000001",
    submittedAt: "2026-08-28T18:00:00.000Z",
    input: {
      fullName: "Test Àpplicant",
      phone: "555-0100",
      email: "applicant@example.com",
      careerArea: "Welding & Fabrication",
      relevantExperience: "Synthetic résumé text for PDF verification.",
      preferredContactMethod: "Email",
      bestTimeToContact: "Afternoons",
      optionalMessage: null,
    },
    resume: null,
  });

  assert.equal(generated.filename, "Axe_Applicant_Test_Applicant_00000000.pdf");
  assert.ok(generated.bytes.byteLength > 1000);
  const document = await PDFDocument.load(generated.bytes);
  assert.ok(document.getPageCount() >= 1);
  assert.equal(document.getTitle(), "Axe Build Employment Application — Test Àpplicant");
  assert.equal(document.getAuthor(), "Axe Build, LLC");
});
