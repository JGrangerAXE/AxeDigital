import { NextResponse } from "next/server";
import { AdminAuthenticationError, requireCareersAdmin } from "@/lib/admin/careers-auth";
import { JobAdminRepository } from "@/lib/careers/job-repository";
import { JobAdminValidationError, runJobAdminAction } from "@/lib/careers/job-admin-service";

export const runtime = "nodejs";
const safeError = (error: unknown) => error instanceof AdminAuthenticationError
  ? NextResponse.json({ ok: false, message: error.message }, { status: 401 })
  : NextResponse.json({ ok: false, message: error instanceof Error ? error.message : "Careers administration request failed.", ...(error instanceof JobAdminValidationError ? { errors: error.errors } : {}) }, { status: 400 });

export async function GET(request: Request) {
  try { await requireCareersAdmin(request); return NextResponse.json({ ok: true, ...(await new JobAdminRepository().dashboard()) }); } catch (error) { return safeError(error); }
}

export async function POST(request: Request) {
  try {
    await requireCareersAdmin(request);
    const dashboard = await runJobAdminAction(await request.json() as Record<string, unknown>, new JobAdminRepository());
    return NextResponse.json({ ok: true, ...dashboard as object });
  } catch (error) { return safeError(error); }
}
