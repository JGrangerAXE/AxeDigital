import type { JobContent, JobStatus } from "@/types/jobs";

export function copyJobContent(source: JobContent): JobContent {
  return { jobTitle: source.jobTitle, jobDescription: source.jobDescription, jobDuties: source.jobDuties, experienceRequired: source.experienceRequired, schedule: source.schedule, location: source.location, payRange: source.payRange };
}

export function publicationFields(status: "draft" | "open", publishedAt: string | null, now: string) {
  return { status, published_at: status === "open" ? (publishedAt ?? now) : publishedAt };
}

export function transitionFields(status: Extract<JobStatus, "filled" | "closed" | "archived">, now: string) {
  return { status, ...(status === "filled" ? { filled_at: now } : status === "closed" ? { closed_at: now } : {}) };
}
