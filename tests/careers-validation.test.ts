import test from "node:test";
import assert from "node:assert/strict";
import {
  CAREER_AREAS,
  MAX_RESUME_BYTES,
  RESUME_MIME_TYPES,
  validateApplicationForm,
} from "../src/lib/validation/careers";

function validForm(area = "Construction") {
  const form = new FormData();
  form.set("name", "Test Applicant");
  form.set("phone", "555-0100");
  form.set("email", "applicant@example.com");
  form.set("area", area);
  form.set("experience", "Hands-on project experience.");
  form.set("contact", "Email");
  form.set("time", "Weekday afternoons");
  form.set("note", "Optional test message.");
  return form;
}

function pdfFile(name = "resume.pdf") {
  return new File([new TextEncoder().encode("%PDF-1.4\n%%EOF")], name, { type: RESUME_MIME_TYPES.pdf });
}

function docxFile(name = "resume.docx") {
  const bytes = new TextEncoder().encode("PK\u0003\u0004[Content_Types].xml word/document.xml");
  return new File([bytes], name, { type: RESUME_MIME_TYPES.docx });
}

test("accepts an application without a resume", async () => {
  const result = await validateApplicationForm(validForm());
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.resume, null);
});

test("accepts a valid optional job posting context", async () => {
  const form = validForm();
  form.set("jobPostingId", "00000000-0000-4000-8000-000000000010");
  const result = await validateApplicationForm(form);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.jobPostingId, "00000000-0000-4000-8000-000000000010");
});

test("accepts a valid PDF resume and preserves its metadata", async () => {
  const form = validForm();
  form.set("resume", pdfFile("Test Résumé.pdf"));
  const result = await validateApplicationForm(form);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.resume?.originalFilename, "Test Résumé.pdf");
    assert.equal(result.resume?.sanitizedFilename, "Test-Resume.pdf");
    assert.equal(result.resume?.mimeType, RESUME_MIME_TYPES.pdf);
  }
});

test("accepts a valid DOCX resume", async () => {
  const form = validForm();
  form.set("resume", docxFile());
  const result = await validateApplicationForm(form);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.resume?.mimeType, RESUME_MIME_TYPES.docx);
});

for (const area of CAREER_AREAS) {
  test(`accepts approved career area: ${area}`, async () => {
    const result = await validateApplicationForm(validForm(area));
    assert.equal(result.success, true);
  });
}

test("rejects a missing required field", async () => {
  const form = validForm();
  form.delete("phone");
  const result = await validateApplicationForm(form);
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.errors.phone);
});

test("rejects an invalid email", async () => {
  const form = validForm();
  form.set("email", "not-an-email");
  const result = await validateApplicationForm(form);
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.errors.email);
});

test("rejects an arbitrary career area", async () => {
  const result = await validateApplicationForm(validForm("Executive"));
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.errors.area);
});

test("rejects an oversized resume", async () => {
  const bytes = new Uint8Array(MAX_RESUME_BYTES + 1);
  bytes.set(new TextEncoder().encode("%PDF-"));
  const form = validForm();
  form.set("resume", new File([bytes], "large.pdf", { type: RESUME_MIME_TYPES.pdf }));
  const result = await validateApplicationForm(form);
  assert.equal(result.success, false);
  if (!result.success) assert.match(result.errors.resume ?? "", /5 MB/);
});

test("rejects an unsupported resume type", async () => {
  const form = validForm();
  form.set("resume", new File(["MZ"], "resume.exe", { type: "application/x-msdownload" }));
  const result = await validateApplicationForm(form);
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.errors.resume);
});

test("rejects empty relevant experience", async () => {
  const form = validForm();
  form.set("experience", "  \n  ");
  const result = await validateApplicationForm(form);
  assert.equal(result.success, false);
  if (!result.success) assert.ok(result.errors.experience);
});
