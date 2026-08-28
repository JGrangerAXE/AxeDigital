export const JOB_STATUSES = ["draft", "open", "filled", "closed", "archived"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export type JobContent = {
  jobTitle: string;
  jobDescription: string;
  jobDuties: string;
  experienceRequired: string;
  schedule: string;
  location: string;
  payRange: string | null;
};

export type JobTemplate = JobContent & { id: string; templateName: string; createdAt: string; updatedAt: string };
export type JobPosting = JobContent & {
  id: string;
  templateId: string | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  filledAt: string | null;
  closedAt: string | null;
};
export type PublicJobPosting = Pick<JobPosting, "id" | "jobTitle" | "jobDescription" | "jobDuties" | "experienceRequired" | "schedule" | "location" | "payRange" | "publishedAt">;
export type JobApplicationContext = { id: string; title: string };
