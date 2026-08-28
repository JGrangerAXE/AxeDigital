import "server-only";
import type { ApplicationInput, ValidatedResume } from "@/lib/validation/careers";
import type { JobApplicationContext } from "@/types/jobs";

export type ApplicationEmailPackage = {
  applicationId: string;
  submittedAt: string;
  input: ApplicationInput;
  summaryPdf: { bytes: Uint8Array; filename: string };
  resume: ValidatedResume | null;
  jobContext: JobApplicationContext | null;
};

export type ApplicationEmailDelivery = {
  providerMessageId: string;
};

export interface ApplicationEmailProvider {
  sendApplication(application: ApplicationEmailPackage): Promise<ApplicationEmailDelivery>;
}

export class EmailConfigurationError extends Error {}
export class EmailDeliveryError extends Error {}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export class ResendApplicationEmailProvider implements ApplicationEmailProvider {
  constructor(
    private readonly apiKey: string,
    private readonly recipient: string,
    private readonly sender: string,
  ) {}

  async sendApplication(application: ApplicationEmailPackage): Promise<ApplicationEmailDelivery> {
    const { input, applicationId, submittedAt, summaryPdf, resume, jobContext } = application;
    const submitted = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Denver",
    }).format(new Date(submittedAt));
    const subject = `NEW APPLICANT — ${input.fullName} — ${jobContext?.title ?? input.careerArea}`;
    const text = [
      "A new employment application has been received.",
      "",
      `Applicant: ${input.fullName}`,
      `Career area: ${input.careerArea}`,
      ...(jobContext ? [`Job posting: ${jobContext.title}`] : []),
      `Phone: ${input.phone}`,
      `Email: ${input.email}`,
      `Submitted: ${submitted}`,
      `Application ID: ${applicationId}`,
      "",
      "The standardized applicant summary is attached. The original resume is attached separately when supplied.",
    ].join("\n");
    const html = `
      <p>A new employment application has been received.</p>
      <table cellpadding="6" cellspacing="0" role="presentation">
        <tr><td><strong>Applicant</strong></td><td>${escapeHtml(input.fullName)}</td></tr>
        <tr><td><strong>Career area</strong></td><td>${escapeHtml(input.careerArea)}</td></tr>
        ${jobContext ? `<tr><td><strong>Job posting</strong></td><td>${escapeHtml(jobContext.title)}</td></tr>` : ""}
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(input.phone)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(input.email)}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${escapeHtml(submitted)}</td></tr>
        <tr><td><strong>Application ID</strong></td><td>${escapeHtml(applicationId)}</td></tr>
      </table>
      <p>The standardized applicant summary is attached. The original resume is attached separately when supplied.</p>
    `;

    const attachments = [
      {
        filename: summaryPdf.filename,
        content: Buffer.from(summaryPdf.bytes).toString("base64"),
        content_type: "application/pdf",
      },
    ];
    if (resume) {
      attachments.push({
        filename: resume.sanitizedFilename,
        content: Buffer.from(resume.bytes).toString("base64"),
        content_type: resume.mimeType,
      });
    }

    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.sender,
          to: [this.recipient],
          subject,
          text,
          html,
          attachments,
        }),
        signal: AbortSignal.timeout(20_000),
      });
    } catch {
      throw new EmailDeliveryError("Resend could not be reached.");
    }

    if (!response.ok) {
      throw new EmailDeliveryError(`Resend request failed with HTTP ${response.status}.`);
    }

    const result = await response.json() as { id?: string };
    if (!result.id) throw new EmailDeliveryError("Resend did not return a message ID.");
    return { providerMessageId: result.id };
  }
}

export function createApplicationEmailProviderFromEnvironment(): ApplicationEmailProvider {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.APPLICATION_RECIPIENT_EMAIL?.trim();
  const sender = process.env.APPLICATION_FROM_EMAIL?.trim();
  if (!apiKey || !recipient || !sender) {
    return {
      async sendApplication() {
        throw new EmailConfigurationError("Application email delivery is not fully configured.");
      },
    };
  }
  return new ResendApplicationEmailProvider(apiKey, recipient, sender);
}
