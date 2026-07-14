import type { Metadata } from "next";
import Image from "next/image";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { JobListings } from "@/components/careers/JobListings";
import { AxeMedia } from "@/components/shared/AxeMedia";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { sampleJobs } from "@/content/sample-jobs";
import { axeMedia, type AxeMediaAsset } from "@/content/media";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore skilled-trade career areas and future opportunities with Axe Build, LLC.",
};

const values = [
  { title: "Real Work", copy: "Build, repair, fabricate, and operate—work with a visible result." },
  { title: "Valuable Skills", copy: "Develop practical knowledge through hands-on experience and focused learning." },
  { title: "Serious Equipment", copy: "Work around the tools, machines, and equipment the job demands." },
  { title: "Room to Grow", copy: "Build capability over time and be ready for greater responsibility." },
];

const areas: Array<{ title: string; asset?: AxeMediaAsset }> = [
  { title: "Construction", asset: axeMedia.crewRebar },
  { title: "Welding & Fabrication", asset: axeMedia.fabricatedBeam },
  { title: "Machine Operation", asset: axeMedia.steelMachine },
  { title: "Painting & Coatings" },
  { title: "Assembly", asset: axeMedia.shopWide },
  { title: "General Application", asset: axeMedia.telehandlerDetail },
];

const expectations = ["Compensation", "Schedule", "Benefits", "Training", "Advancement"];
const process = ["Apply", "Talk With Us", "Meet the Team", "Get to Work"];

export default function CareersPage() {
  return (
    <>
      <section className="relative min-h-[88svh] overflow-hidden border-b border-white/10 pt-20">
        <Image
          src={axeMedia.telehandlerEntry.src}
          alt={axeMedia.telehandlerEntry.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: axeMedia.telehandlerEntry.position }}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-deep)] via-[var(--background-deep)]/72 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-dark)] via-transparent to-black/30" />
        <div className="container-shell relative flex min-h-[calc(88svh-5rem)] items-end pb-14 pt-28 sm:pb-20">
          <div>
            <p className="eyebrow">Careers at Axe</p>
            <h1 className="display mt-6 max-w-5xl text-[clamp(4rem,10vw,8.5rem)]">
              Your Work Should <span className="text-[var(--accent)]">Mean Something.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Learn useful skills. Contribute to a capable team. Build work you can point to—and a career that develops with you.
            </p>
            <div className="mt-8"><ButtonLink href="#opportunities">View Opportunities</ButtonLink></div>
          </div>
        </div>
      </section>

      <section className="surface-dark py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Why Axe" title="Work Worth Doing." copy="No inflated promises. Just a clear focus on skilled work, contribution, and getting better at what you do." />
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_.92fr]">
            <div className="grid gap-3 sm:grid-cols-2">
              {values.map((value, index) => (
                <article key={value.title} className="industrial-panel min-h-52 p-6">
                  <p className="text-xs font-black text-[var(--accent)]">0{index + 1}</p>
                  <h2 className="mt-12 text-2xl font-black uppercase">{value.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/55">{value.copy}</p>
                </article>
              ))}
            </div>
            <AxeMedia asset={axeMedia.crewRebar} label="Real work. Real contribution." className="min-h-[32rem]" sizes="(max-width: 1024px) 100vw, 48vw" />
          </div>
        </div>
      </section>

      <section className="surface-mid-gradient border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Career areas" title="Find Your Direction." copy="These categories represent types of work at Axe—not active job postings." />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, index) => area.asset ? (
              <AxeMedia key={area.title} asset={area.asset} label={`0${index + 1} / ${area.title}`} className="min-h-72" sizes="(max-width: 768px) 100vw, 33vw" />
            ) : (
              <article key={area.title} className="industrial-panel flex min-h-72 flex-col justify-between p-6">
                <span className="text-xs font-black text-[var(--accent)]">0{index + 1}</span>
                <div>
                  <h3 className="text-2xl font-black uppercase">{area.title}</h3>
                  <p className="mt-2 text-sm text-white/45">Career category</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="opportunities" className="surface-dark scroll-mt-20 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Open opportunities" title="See Where You Fit." copy="Positions will appear here when they are entered into the careers system. The records below are clearly marked development samples and are not active openings." />
          <div className="mt-10"><JobListings jobs={sampleJobs} /></div>
        </div>
      </section>

      <section className="surface-charcoal border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="What to expect" title="The Details Belong With The Job." copy="Details vary by position and will be provided in each job listing." />
          <div className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {expectations.map((item) => (
              <div key={item} className="bg-[var(--background-dark)] p-6">
                <h3 className="font-black uppercase">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-white/45">To be confirmed for each position.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-dark py-20 sm:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <SectionHeading eyebrow="Hiring process" title="Simple. Direct. Human." />
            <AxeMedia asset={axeMedia.plasmaCutting} label="Skill in motion" className="mt-8 min-h-72" sizes="(max-width: 1024px) 100vw, 36vw" />
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {process.map((step, index) => (
              <li key={step} className="industrial-panel min-h-44 p-6">
                <span className="text-xs font-black text-[var(--accent)]">Step {index + 1}</span>
                <h3 className="mt-12 text-xl font-black uppercase">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="surface-mid-gradient scroll-mt-20 border-t border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="General interest" title="Start The Conversation." copy="Don’t see a current fit? Tell us where you’re interested in contributing. This first-pass form validates entries locally but does not submit or store them." />
          <ApplicationForm />
        </div>
      </section>
    </>
  );
}
