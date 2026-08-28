import type { JobContent } from "@/types/jobs";
import { validateJobContent, validateTemplateName, type JobFieldErrors } from "@/lib/validation/jobs";

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class JobAdminValidationError extends Error { constructor(message: string, readonly errors: JobFieldErrors = {}) { super(message); } }
export interface JobAdminPort {
  dashboard(): Promise<unknown>;
  createTemplate(name: string, content: JobContent): Promise<unknown>;
  updateTemplate(id: string, name: string, content: JobContent): Promise<unknown>;
  createPosting(content: JobContent, status: "draft" | "open"): Promise<unknown>;
  updatePosting(id: string, content: JobContent, status: "draft" | "open"): Promise<unknown>;
  createPostingFromTemplate(id: string): Promise<unknown>;
  transitionPosting(id: string, status: "filled" | "closed" | "archived"): Promise<unknown>;
}

export async function runJobAdminAction(body: Record<string, unknown>, repository: JobAdminPort) {
  if (body.action === "saveTemplate") {
    const content = validateJobContent(body.content), name = validateTemplateName(body.templateName);
    if (!content.success || name.error) throw new JobAdminValidationError("Complete every required template field.", { ...(content.success ? {} : content.errors), templateName: name.error });
    if (body.id && !idPattern.test(String(body.id))) throw new JobAdminValidationError("Invalid template ID.");
    if (body.id) await repository.updateTemplate(String(body.id), name.value, content.content); else await repository.createTemplate(name.value, content.content);
  } else if (body.action === "createPostingFromTemplate") {
    if (!idPattern.test(String(body.templateId))) throw new JobAdminValidationError("Invalid template ID.");
    await repository.createPostingFromTemplate(String(body.templateId));
  } else if (body.action === "savePosting") {
    const content = validateJobContent(body.content), status = body.status === "open" ? "open" : "draft";
    if (!content.success) throw new JobAdminValidationError("Complete every required posting field.", content.errors);
    if (body.id && !idPattern.test(String(body.id))) throw new JobAdminValidationError("Invalid posting ID.");
    if (body.id) await repository.updatePosting(String(body.id), content.content, status); else await repository.createPosting(content.content, status);
  } else if (body.action === "transitionPosting") {
    if (!idPattern.test(String(body.id)) || !["filled", "closed", "archived"].includes(String(body.status))) throw new JobAdminValidationError("Invalid posting transition.");
    await repository.transitionPosting(String(body.id), body.status as "filled" | "closed" | "archived");
  } else throw new JobAdminValidationError("Unknown careers administration action.");
  return repository.dashboard();
}
