import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { JobContent, JobPosting, JobStatus, JobTemplate, PublicJobPosting } from "@/types/jobs";
import { copyJobContent, publicationFields, transitionFields } from "@/lib/careers/job-workflow";

const PUBLIC_FIELDS = "id,job_title,job_description,job_duties,experience_required,schedule,location,pay_range,published_at";
type Row = Record<string, unknown>;
function contentColumns(content: JobContent) { return { job_title: content.jobTitle, job_description: content.jobDescription, job_duties: content.jobDuties, experience_required: content.experienceRequired, schedule: content.schedule, location: content.location, pay_range: content.payRange }; }

export function mapPublicJob(row: Row): PublicJobPosting {
  return { id: String(row.id), jobTitle: String(row.job_title), jobDescription: String(row.job_description), jobDuties: String(row.job_duties), experienceRequired: String(row.experience_required), schedule: String(row.schedule), location: String(row.location), payRange: row.pay_range ? String(row.pay_range) : null, publishedAt: row.published_at ? String(row.published_at) : null };
}
function mapTemplate(row: Row): JobTemplate { return { ...mapPublicJob(row), templateName: String(row.template_name), createdAt: String(row.created_at), updatedAt: String(row.updated_at) }; }
function mapPosting(row: Row): JobPosting { return { ...mapPublicJob(row), templateId: row.template_id ? String(row.template_id) : null, status: String(row.status) as JobStatus, createdAt: String(row.created_at), updatedAt: String(row.updated_at), filledAt: row.filled_at ? String(row.filled_at) : null, closedAt: row.closed_at ? String(row.closed_at) : null }; }

export async function getOpenJobPostings(client?: SupabaseClient): Promise<PublicJobPosting[]> {
  try {
    const { data, error } = await (client ?? createServerSupabaseClient()).from("job_postings").select(PUBLIC_FIELDS).eq("status", "open").order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapPublicJob(row as Row));
  } catch (error) {
    console.error("Public job postings could not be loaded.", { error: error instanceof Error ? error.message : "Unknown error" });
    return [];
  }
}

export async function getOpenJobPosting(id: string, client?: SupabaseClient): Promise<PublicJobPosting | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return null;
  try {
    const { data, error } = await (client ?? createServerSupabaseClient()).from("job_postings").select(PUBLIC_FIELDS).eq("id", id).eq("status", "open").maybeSingle();
    if (error) throw error;
    return data ? mapPublicJob(data as Row) : null;
  } catch (error) {
    console.error("Public job posting could not be loaded.", { error: error instanceof Error ? error.message : "Unknown error" });
    return null;
  }
}

export class JobAdminRepository {
  constructor(private readonly client: SupabaseClient = createServiceRoleClient()) {}
  async dashboard() {
    const [templates, postings] = await Promise.all([this.client.from("job_templates").select("*").order("template_name"), this.client.from("job_postings").select("*").order("created_at", { ascending: false })]);
    if (templates.error || postings.error) throw new Error("Careers records could not be loaded.");
    return { templates: (templates.data ?? []).map((row) => mapTemplate(row as Row)), postings: (postings.data ?? []).map((row) => mapPosting(row as Row)) };
  }
  async createTemplate(templateName: string, content: JobContent) {
    const { data, error } = await this.client.from("job_templates").insert({ template_name: templateName, ...contentColumns(content) }).select("*").single();
    if (error) throw new Error("Template could not be created.");
    return mapTemplate(data as Row);
  }
  async updateTemplate(id: string, templateName: string, content: JobContent) {
    const { data, error } = await this.client.from("job_templates").update({ template_name: templateName, ...contentColumns(content) }).eq("id", id).select("*").single();
    if (error) throw new Error("Template could not be updated.");
    return mapTemplate(data as Row);
  }
  async createPosting(content: JobContent, status: "draft" | "open", templateId: string | null = null) {
    const { data, error } = await this.client.from("job_postings").insert({ ...contentColumns(content), template_id: templateId, status, published_at: status === "open" ? new Date().toISOString() : null }).select("*").single();
    if (error) throw new Error("Posting could not be created.");
    return mapPosting(data as Row);
  }
  async createPostingFromTemplate(templateId: string) {
    const { data, error } = await this.client.from("job_templates").select("*").eq("id", templateId).single();
    if (error || !data) throw new Error("Template could not be found.");
    return this.createPosting(copyJobContent(mapTemplate(data as Row)), "draft", templateId);
  }
  async updatePosting(id: string, content: JobContent, status: "draft" | "open") {
    const current = await this.getPosting(id);
    const { data, error } = await this.client.from("job_postings").update({ ...contentColumns(content), ...publicationFields(status, current.publishedAt, new Date().toISOString()) }).eq("id", id).select("*").single();
    if (error) throw new Error("Posting could not be updated.");
    return mapPosting(data as Row);
  }
  async transitionPosting(id: string, status: "filled" | "closed" | "archived") {
    const { data, error } = await this.client.from("job_postings").update(transitionFields(status, new Date().toISOString())).eq("id", id).select("*").single();
    if (error) throw new Error("Posting status could not be updated.");
    return mapPosting(data as Row);
  }
  async getPosting(id: string) {
    const { data, error } = await this.client.from("job_postings").select("*").eq("id", id).single();
    if (error || !data) throw new Error("Posting could not be found.");
    return mapPosting(data as Row);
  }
}
