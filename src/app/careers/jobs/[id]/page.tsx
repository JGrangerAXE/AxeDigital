import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { getOpenJobPosting } from "@/lib/careers/job-repository";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getOpenJobPosting((await params).id);
  if (!job) return { title: "Position Not Available", robots: { index: false, follow: false } };
  return { title: job.jobTitle, description: job.jobDescription.slice(0, 155) };
}

function JobSection({ title, children }: { title: string; children: string }) {
  return <section className="border-t border-white/10 py-8"><h2 className="text-sm font-black uppercase tracking-[.14em] text-[var(--accent)]">{title}</h2><div className="mt-4 whitespace-pre-line text-lg leading-8 text-white/70">{children}</div></section>;
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getOpenJobPosting((await params).id);
  if (!job) notFound();
  return <>
    <section className="surface-charcoal-gradient border-b border-white/10 pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div className="container-shell">
        <p className="eyebrow">Open position</p>
        <h1 className="display mt-6 max-w-5xl text-[clamp(3.5rem,9vw,7.5rem)]">{job.jobTitle}</h1>
        <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 text-lg text-white/70"><span>{job.location}</span>{job.payRange ? <span>{job.payRange}</span> : null}</div>
        <div className="mt-9"><ButtonLink href={`/careers?job=${job.id}#apply`}>Apply For This Position</ButtonLink></div>
      </div>
    </section>
    <div className="surface-dark py-16 sm:py-24"><div className="container-shell max-w-4xl">
      <JobSection title="Job Description">{job.jobDescription}</JobSection>
      <JobSection title="Job Duties">{job.jobDuties}</JobSection>
      <JobSection title="Experience Required">{job.experienceRequired}</JobSection>
      <JobSection title="Schedule">{job.schedule}</JobSection>
      <JobSection title="Location">{job.location}</JobSection>
      {job.payRange ? <JobSection title="Pay Range">{job.payRange}</JobSection> : null}
      <div className="border-t border-white/10 pt-10"><ButtonLink href={`/careers?job=${job.id}#apply`}>Apply For This Position</ButtonLink></div>
    </div></div>
  </>;
}
