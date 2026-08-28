import { JOB_STATUSES, type JobContent, type JobStatus } from "@/types/jobs";

export type JobField = keyof JobContent | "templateName" | "status";
export type JobFieldErrors = Partial<Record<JobField, string>>;
const LIMITS = { templateName: 120, jobTitle: 160, jobDescription: 10000, jobDuties: 10000, experienceRequired: 10000, schedule: 2000, location: 500, payRange: 500 } as const;

function normalize(value: unknown, multiline = false) {
  if (typeof value !== "string") return "";
  const cleaned = value.replace(/\r\n?/g, "\n").trim();
  return multiline ? cleaned.split("\n").map((line) => line.trimEnd()).join("\n") : cleaned.replace(/\s+/g, " ");
}

export function isJobStatus(value: unknown): value is JobStatus { return typeof value === "string" && JOB_STATUSES.some((status) => status === value); }

export function validateJobContent(value: unknown): { success: true; content: JobContent } | { success: false; errors: JobFieldErrors } {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const content: JobContent = {
    jobTitle: normalize(source.jobTitle), jobDescription: normalize(source.jobDescription, true), jobDuties: normalize(source.jobDuties, true),
    experienceRequired: normalize(source.experienceRequired, true), schedule: normalize(source.schedule, true), location: normalize(source.location), payRange: normalize(source.payRange) || null,
  };
  const errors: JobFieldErrors = {};
  for (const field of ["jobTitle", "jobDescription", "jobDuties", "experienceRequired", "schedule", "location"] as const) {
    if (!content[field]) errors[field] = "This field is required.";
    else if (content[field].length > LIMITS[field]) errors[field] = "This field is too long.";
  }
  if (content.payRange && content.payRange.length > LIMITS.payRange) errors.payRange = "Pay range is too long.";
  return Object.keys(errors).length ? { success: false, errors } : { success: true, content };
}

export function validateTemplateName(value: unknown) {
  const templateName = normalize(value);
  if (!templateName) return { value: "", error: "Template name is required." };
  if (templateName.length > LIMITS.templateName) return { value: templateName, error: "Template name is too long." };
  return { value: templateName };
}

export function excerptJobDescription(value: string, maxLength = 220) {
  const singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxLength) return singleLine;
  const slice = singleLine.slice(0, maxLength - 1);
  const boundary = slice.lastIndexOf(" ");
  return `${slice.slice(0, boundary > maxLength * 0.65 ? boundary : undefined).trimEnd()}…`;
}

export function publicSiteUrl(value = process.env.PUBLIC_SITE_URL) {
  const configured = value?.trim();
  if (!configured) return "https://axebuild.com";
  try { return new URL(configured).origin; } catch { throw new Error("PUBLIC_SITE_URL must be a valid absolute URL."); }
}
