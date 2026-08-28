import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationInput, ValidatedResume } from "@/lib/validation/careers";
import type { JobApplicationContext } from "@/types/jobs";

export const EMPLOYMENT_RESUMES_BUCKET = "employment-resumes";

export type ApplicationRecord = {
  id: string;
  submittedAt: string;
  input: ApplicationInput;
  resume: ValidatedResume | null;
  resumeStoragePath: string | null;
  jobContext: JobApplicationContext | null;
};

export interface ApplicationRepository {
  uploadResume(applicationId: string, resume: ValidatedResume): Promise<string>;
  removeResume(storagePath: string): Promise<void>;
  insertApplication(record: ApplicationRecord): Promise<void>;
  markEmailSent(applicationId: string, attemptedAt: string, providerMessageId: string): Promise<void>;
  markEmailFailed(applicationId: string, attemptedAt: string, errorSummary: string): Promise<void>;
}

export class ApplicationPersistenceError extends Error {}

export class SupabaseApplicationRepository implements ApplicationRepository {
  constructor(private readonly client: SupabaseClient) {}

  async uploadResume(applicationId: string, resume: ValidatedResume) {
    const storagePath = `${applicationId}/${resume.sanitizedFilename}`;
    const { error } = await this.client.storage
      .from(EMPLOYMENT_RESUMES_BUCKET)
      .upload(storagePath, resume.bytes, {
        contentType: resume.mimeType,
        upsert: false,
      });
    if (error) throw new ApplicationPersistenceError("Resume storage failed.");
    return storagePath;
  }

  async removeResume(storagePath: string) {
    const { error } = await this.client.storage.from(EMPLOYMENT_RESUMES_BUCKET).remove([storagePath]);
    if (error) throw new ApplicationPersistenceError("Orphaned resume cleanup failed.");
  }

  async insertApplication(record: ApplicationRecord) {
    const { input, resume } = record;
    const { error } = await this.client.from("employment_applications").insert({
      id: record.id,
      submitted_at: record.submittedAt,
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      career_area: input.careerArea,
      relevant_experience: input.relevantExperience,
      preferred_contact_method: input.preferredContactMethod,
      best_time_to_contact: input.bestTimeToContact,
      optional_message: input.optionalMessage,
      resume_storage_path: record.resumeStoragePath,
      resume_original_filename: resume?.originalFilename ?? null,
      resume_mime_type: resume?.mimeType ?? null,
      resume_size_bytes: resume?.sizeBytes ?? null,
      application_status: "new",
      email_delivery_status: "pending",
      job_posting_id: record.jobContext?.id ?? null,
    });
    if (error) throw new ApplicationPersistenceError("Application database storage failed.");
  }

  async markEmailSent(applicationId: string, attemptedAt: string, providerMessageId: string) {
    const { error } = await this.client
      .from("employment_applications")
      .update({
        email_delivery_status: "sent",
        email_delivery_attempted_at: attemptedAt,
        email_delivered_at: attemptedAt,
        email_provider_message_id: providerMessageId,
        email_error_summary: null,
      })
      .eq("id", applicationId);
    if (error) throw new ApplicationPersistenceError("Email success status could not be recorded.");
  }

  async markEmailFailed(applicationId: string, attemptedAt: string, errorSummary: string) {
    const { error } = await this.client
      .from("employment_applications")
      .update({
        email_delivery_status: "failed",
        email_delivery_attempted_at: attemptedAt,
        email_delivered_at: null,
        email_provider_message_id: null,
        email_error_summary: errorSummary.slice(0, 500),
      })
      .eq("id", applicationId);
    if (error) throw new ApplicationPersistenceError("Email failure status could not be recorded.");
  }
}
