import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isCareersAdminEmail } from "../src/lib/admin/careers-allowlist";
import { copyJobContent, publicationFields, transitionFields } from "../src/lib/careers/job-workflow";
import { excerptJobDescription, publicSiteUrl, validateJobContent } from "../src/lib/validation/jobs";

const content = { jobTitle: "Construction Team Member", jobDescription: "Build serious work.", jobDuties: "Support field construction.", experienceRequired: "Relevant hands-on experience.", schedule: "Schedule supplied in posting.", location: "Colorado", payRange: null };

test("job content validation enforces required fields and keeps pay range optional", () => {
  assert.equal(validateJobContent(content).success, true);
  assert.equal(validateJobContent({ ...content, jobTitle: "" }).success, false);
  assert.equal(validateJobContent({ ...content, payRange: "" }).success, true);
});
test("job excerpts remain concise", () => assert.ok(excerptJobDescription("work ".repeat(100)).length <= 220));
test("creating from a template copies content instead of retaining a live reference", () => { const copy = copyJobContent(content); assert.deepEqual(copy, content); assert.notEqual(copy, content); });
test("publish, fill, close, and archive lifecycle fields are deterministic", () => {
  const now = "2026-08-29T18:00:00.000Z";
  assert.deepEqual(publicationFields("open", null, now), { status: "open", published_at: now });
  assert.deepEqual(transitionFields("filled", now), { status: "filled", filled_at: now });
  assert.deepEqual(transitionFields("closed", now), { status: "closed", closed_at: now });
  assert.deepEqual(transitionFields("archived", now), { status: "archived" });
});
test("admin email allowlist is explicit and case-insensitive", () => { assert.equal(isCareersAdminEmail("Admin@AxeBuild.com", "admin@axebuild.com, second@axebuild.com"), true); assert.equal(isCareersAdminEmail("other@example.com", "admin@axebuild.com"), false); assert.equal(isCareersAdminEmail("admin@axebuild.com", undefined), false); });
test("public site URL produces the configured origin", () => assert.equal(publicSiteUrl("http://localhost:3000/path"), "http://localhost:3000"));

test("migration permits public reads only for open postings and protects templates", async () => {
  const sql = await readFile(new URL("../supabase/migrations/20260829000100_job_posting_workflow.sql", import.meta.url), "utf8");
  assert.match(sql, /status in \('draft', 'open', 'filled', 'closed', 'archived'\)/i);
  assert.match(sql, /create policy "Public can read open job postings"[\s\S]+using \(status = 'open'\)/i);
  assert.match(sql, /revoke all on table public\.job_templates from anon, authenticated/i);
  assert.match(sql, /add column job_posting_id uuid references public\.job_postings/i);
});

test("public job detail and application links retain posting context", async () => {
  const detail = await readFile(new URL("../src/app/careers/jobs/[id]/page.tsx", import.meta.url), "utf8");
  const listings = await readFile(new URL("../src/components/careers/JobListings.tsx", import.meta.url), "utf8");
  assert.match(detail, /getOpenJobPosting/); assert.match(detail, /careers\?job=\$\{job\.id\}#apply/);
  assert.match(listings, /careers\/jobs\/\$\{job\.id\}/); assert.match(listings, /careers\?job=\$\{job\.id\}#apply/);
});

test("admin API requires authentication before service-role repository construction", async () => {
  const route = await readFile(new URL("../src/app/api/admin/careers/route.ts", import.meta.url), "utf8");
  assert.ok(route.indexOf("await requireCareersAdmin(request)") < route.indexOf("new JobAdminRepository()"));
  const service = await readFile(new URL("../src/lib/careers/job-admin-service.ts", import.meta.url), "utf8");
  for (const action of ["saveTemplate", "createPostingFromTemplate", "savePosting", "transitionPosting"]) assert.match(service, new RegExp(action));
});
