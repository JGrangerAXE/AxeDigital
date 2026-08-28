import test from "node:test";
import assert from "node:assert/strict";
import { runJobAdminAction, type JobAdminPort } from "../src/lib/careers/job-admin-service";

const id = "00000000-0000-4000-8000-000000000010";
const content = { jobTitle: "Welder", jobDescription: "Description", jobDuties: "Duties", experienceRequired: "Experience", schedule: "Schedule", location: "Colorado", payRange: null };
function fake() { const calls: string[] = []; const repository: JobAdminPort = { async dashboard() { calls.push("dashboard"); return { templates: [], postings: [] }; }, async createTemplate() { calls.push("createTemplate"); }, async updateTemplate() { calls.push("updateTemplate"); }, async createPosting(_content, status) { calls.push(`createPosting:${status}`); }, async updatePosting(_id, _content, status) { calls.push(`updatePosting:${status}`); }, async createPostingFromTemplate() { calls.push("createPostingFromTemplate"); }, async transitionPosting(_id, status) { calls.push(`transition:${status}`); } }; return { repository, calls }; }

test("admin creates and edits a template", async () => {
  const created = fake(); await runJobAdminAction({ action: "saveTemplate", templateName: "Welder", content }, created.repository); assert.deepEqual(created.calls, ["createTemplate", "dashboard"]);
  const edited = fake(); await runJobAdminAction({ action: "saveTemplate", id, templateName: "Welder", content }, edited.repository); assert.deepEqual(edited.calls, ["updateTemplate", "dashboard"]);
});
test("admin creates a posting from a template", async () => { const item = fake(); await runJobAdminAction({ action: "createPostingFromTemplate", templateId: id }, item.repository); assert.deepEqual(item.calls, ["createPostingFromTemplate", "dashboard"]); });
test("admin creates drafts, publishes, and edits postings", async () => {
  const draft = fake(); await runJobAdminAction({ action: "savePosting", content, status: "draft" }, draft.repository); assert.deepEqual(draft.calls, ["createPosting:draft", "dashboard"]);
  const published = fake(); await runJobAdminAction({ action: "savePosting", content, status: "open" }, published.repository); assert.deepEqual(published.calls, ["createPosting:open", "dashboard"]);
  const edited = fake(); await runJobAdminAction({ action: "savePosting", id, content, status: "open" }, edited.repository); assert.deepEqual(edited.calls, ["updatePosting:open", "dashboard"]);
});
test("admin marks postings filled, closes them, and archives history", async () => { for (const status of ["filled", "closed", "archived"] as const) { const item = fake(); await runJobAdminAction({ action: "transitionPosting", id, status }, item.repository); assert.deepEqual(item.calls, [`transition:${status}`, "dashboard"]); } });
