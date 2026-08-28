import { NextResponse } from "next/server";
import { AdminAuthenticationError, requireCareersAdmin } from "@/lib/admin/careers-auth";
import { JobAdminRepository } from "@/lib/careers/job-repository";
import { generateJobPostingPdf } from "@/lib/careers/job-posting-pdf";

export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCareersAdmin(request);
    const generated = await generateJobPostingPdf(await new JobAdminRepository().getPosting((await params).id));
    return new NextResponse(Buffer.from(generated.bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${generated.filename}"`, "Cache-Control": "private, no-store" } });
  } catch (error) {
    const status = error instanceof AdminAuthenticationError ? 401 : 404;
    return NextResponse.json({ ok: false, message: status === 401 && error instanceof Error ? error.message : "Posting PDF could not be generated." }, { status });
  }
}
