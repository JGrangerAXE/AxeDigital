import type { ApplicationRepository } from "./application-repository";
import type { ApplicationEmailProvider } from "../email/application-email";
import type { ApplicationInput, ValidatedResume } from "../validation/careers";

type SummaryPdf = { bytes: Uint8Array; filename: string };

export type SubmitApplicationDependencies = {
  repository: ApplicationRepository;
  emailProvider: ApplicationEmailProvider;
  generatePdf: (input: {
    applicationId: string;
    submittedAt: string;
    input: ApplicationInput;
    resume: ValidatedResume | null;
  }) => Promise<SummaryPdf>;
  createId?: () => string;
  now?: () => Date;
  logError?: (message: string, details: Record<string, unknown>) => void;
};

export type SubmitApplicationResult = {
  applicationId: string;
  emailDeliveryStatus: "sent" | "failed";
};

function errorSummary(error: unknown) {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 500);
  return "Unknown application notification error.";
}

export async function submitEmploymentApplication(
  input: ApplicationInput,
  resume: ValidatedResume | null,
  dependencies: SubmitApplicationDependencies,
): Promise<SubmitApplicationResult> {
  const createId = dependencies.createId ?? crypto.randomUUID;
  const now = dependencies.now ?? (() => new Date());
  const logError = dependencies.logError ?? (() => undefined);
  const applicationId = createId();
  const submittedAt = now().toISOString();
  let resumeStoragePath: string | null = null;

  if (resume) {
    resumeStoragePath = await dependencies.repository.uploadResume(applicationId, resume);
  }

  try {
    await dependencies.repository.insertApplication({
      id: applicationId,
      submittedAt,
      input,
      resume,
      resumeStoragePath,
    });
  } catch (error) {
    if (resumeStoragePath) {
      try {
        await dependencies.repository.removeResume(resumeStoragePath);
      } catch (cleanupError) {
        logError("Failed to clean up an orphaned employment resume.", {
          applicationId,
          error: errorSummary(cleanupError),
        });
      }
    }
    throw error;
  }

  const attemptedAt = now().toISOString();
  try {
    const summaryPdf = await dependencies.generatePdf({ applicationId, submittedAt, input, resume });
    const delivery = await dependencies.emailProvider.sendApplication({
      applicationId,
      submittedAt,
      input,
      summaryPdf,
      resume,
    });
    try {
      await dependencies.repository.markEmailSent(applicationId, attemptedAt, delivery.providerMessageId);
    } catch (statusError) {
      logError("Application email was sent, but delivery status could not be recorded.", {
        applicationId,
        error: errorSummary(statusError),
      });
    }
    return { applicationId, emailDeliveryStatus: "sent" };
  } catch (emailError) {
    const summary = errorSummary(emailError);
    try {
      await dependencies.repository.markEmailFailed(applicationId, attemptedAt, summary);
    } catch (statusError) {
      logError("Application was stored, but email failure status could not be recorded.", {
        applicationId,
        emailError: summary,
        statusError: errorSummary(statusError),
      });
    }
    logError("Application notification email failed after durable storage.", {
      applicationId,
      error: summary,
    });
    return { applicationId, emailDeliveryStatus: "failed" };
  }
}
