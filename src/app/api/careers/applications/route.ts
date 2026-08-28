import { NextResponse } from "next/server";
import { SupabaseApplicationRepository } from "@/lib/careers/application-repository";
import { generateApplicantSummaryPdf } from "@/lib/careers/applicant-pdf";
import { submitEmploymentApplication } from "@/lib/careers/submit-application";
import { createApplicationEmailProviderFromEnvironment } from "@/lib/email/application-email";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { validateApplicationForm } from "@/lib/validation/careers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAFE_FAILURE_MESSAGE = "We could not submit your application right now. Please try again.";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: SAFE_FAILURE_MESSAGE }, { status: 400 });
  }

  const validation = await validateApplicationForm(formData);
  if (!validation.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please correct the highlighted fields and try again.",
        fieldErrors: validation.errors,
      },
      { status: 400 },
    );
  }

  let repository: SupabaseApplicationRepository;
  try {
    repository = new SupabaseApplicationRepository(createServiceRoleClient());
  } catch (error) {
    console.error("Employment application storage is not configured.", {
      error: error instanceof Error ? error.message : "Unknown configuration error.",
    });
    return NextResponse.json(
      { ok: false, message: "Applications are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  try {
    await submitEmploymentApplication(validation.input, validation.resume, {
      repository,
      emailProvider: createApplicationEmailProviderFromEnvironment(),
      generatePdf: generateApplicantSummaryPdf,
      logError(message, details) {
        console.error(message, details);
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Employment application could not be stored.", {
      error: error instanceof Error ? error.message : "Unknown submission error.",
    });
    return NextResponse.json({ ok: false, message: SAFE_FAILURE_MESSAGE }, { status: 500 });
  }
}
