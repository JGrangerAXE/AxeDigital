import { ButtonLink } from "@/components/shared/ButtonLink";
import { excerptJobDescription } from "@/lib/validation/jobs";
import type { PublicJobPosting } from "@/types/jobs";

export function JobListings({ jobs }: { jobs: PublicJobPosting[] }) {
  if (!jobs.length) return <div className="industrial-panel p-8"><h3 className="text-xl font-black uppercase">No Current Openings</h3><p className="mt-3 max-w-2xl leading-7 text-white/55">We may not have a specific position posted today, but we’re always interested in hearing from capable people. Submit an application below and tell us where you’d like to contribute.</p></div>;
  return <div className="grid gap-4">{jobs.map((job) => <article key={job.id} className="industrial-panel p-6 sm:p-8"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h3 className="text-2xl font-black uppercase sm:text-3xl">{job.jobTitle}</h3><p className="mt-2 text-sm text-white/55">{job.location}{job.payRange ? ` · ${job.payRange}` : ""}</p><p className="mt-4 max-w-2xl leading-7 text-white/60">{excerptJobDescription(job.jobDescription)}</p></div><div className="flex shrink-0 flex-wrap gap-3"><ButtonLink href={`/careers/jobs/${job.id}`} variant="secondary">View Position</ButtonLink><ButtonLink href={`/careers?job=${job.id}#apply`}>Apply</ButtonLink></div></div></article>)}</div>;
}
