import type { Metadata } from "next";
import { AxeMedia } from "@/components/shared/AxeMedia";
import { InteriorPage } from "@/components/shared/InteriorPage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { companyPurpose, companyValues } from "@/content/company";
import { axeMedia } from "@/content/media";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Axe Build, LLC developed into a vertically integrated design-build commercial construction company.",
};

export default function About() {
  return (
    <InteriorPage
      eyebrow="About Axe Build"
      title="Where Axe Build Came From."
      copy="Axe Build began as a construction team assembled by EMIT Technologies and became Axe Build, LLC on April 1, 2024."
    >
      <section className="surface-dark">
        <div className="container-shell section-pad">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <AxeMedia asset={axeMedia.crewRebar} label="Built through real construction work" className="min-h-[34rem]" sizes="(max-width: 1024px) 100vw, 52vw" priority />
            <div>
              <p className="eyebrow">2019–2024</p>
              <div className="mt-7 space-y-6 leading-8 text-white/65">
                <p>When EMIT Technologies began constructing a new 38,000 sq ft office addition in 2019, EMIT began hiring qualified construction personnel for the project. By the time the office addition was completed in 2021, a very capable and qualified construction team had been assembled.</p>
                <p>Even before the office was completed and as COVID hit, the decision was made to take on projects for external customers in the community. The construction team worked as Axe Build dba EMIT Technologies Inc.</p>
                <p>As Axe Build continued to grow and take on larger projects, it became apparent the team had matured enough to be a free-standing company. Legal work began in March 2024, and on April 1, 2024, Axe Build, LLC officially became an employer with seven members on the initial team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-charcoal-gradient border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow">Where We Are Now</p>
              <h2 className="display mt-6 max-w-2xl text-4xl sm:text-5xl lg:text-6xl">Built to Take Projects From Inception to Completion.</h2>
            </div>
            <div className="space-y-6 text-base leading-8 text-white/65 sm:text-lg sm:leading-9">
              <p>Axe Build has grown into a team of more than 30 people with the capability to take full-scale projects from early design through final construction. Our in-house capabilities now include design, engineering and specification, structural steel fabrication, sitework, concrete, and erection.</p>
              <p>Because these disciplines are vertically integrated under one company, Axe Build can tightly control quality, speed, and accuracy from one phase to the next. Just as importantly, our integrated structure lets us pivot quickly when jobsite conditions change, keeping decisions close to the work, reducing handoff delays, and maintaining forward momentum.</p>
            </div>
          </div>
          <ul className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-5" aria-label="Current in-house capabilities">
            {["Design + Engineering", "Fabrication", "Sitework", "Concrete", "Erection"].map((capability) => (
              <li key={capability} className="bg-[var(--background-deep)] px-5 py-6 text-sm font-black uppercase tracking-[.08em] text-white">
                {capability}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-mid-gradient border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Built for Vertical Integration"
            title="Design and Build Under One Company."
            copy="Axe Build focuses on structural steel commercial building construction, with the in-house capability to design, fabricate, coat, and build structural steel projects."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <article className="industrial-panel p-7 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.15em] text-[var(--accent)]">Construction</p>
              <p className="mt-8 leading-7 text-white/60">Axe Build has completed projects ranging from primarily earthwork and concrete to schools, hospitals, and buildings for the Wyoming Military.</p>
            </article>
            <article className="industrial-panel p-7 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.15em] text-[var(--accent)]">Engineering</p>
              <p className="mt-8 leading-7 text-white/60">Axe Build operates under a Design Build model with on-staff engineers, drafters and detailers.</p>
            </article>
            <article className="industrial-panel p-7 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.15em] text-[var(--accent)]">Project Role</p>
              <p className="mt-8 leading-7 text-white/60">Axe Build operates as a General Contractor and also partners with other General Contractors as a subcontractor.</p>
            </article>
          </div>
          <AxeMedia asset={axeMedia.shopWide} label="Engineering, fabrication, coatings, and construction" className="mt-4 min-h-96" sizes="100vw" />
        </div>
      </section>

      <section className="surface-charcoal-gradient py-20 sm:py-24">
        <div className="container-shell">
          <p className="eyebrow">Our Purpose</p>
          <h2 className="display display-statement mt-7 max-w-7xl text-4xl sm:text-6xl lg:text-7xl">{companyPurpose}</h2>
        </div>
      </section>

      <section className="surface-dark border-t border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Our Values" title="How Axe Build Works." />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {companyValues.map((value, index) => (
              <article key={value.title} className={`industrial-panel p-7 ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
                <p className="text-xs font-black text-[var(--accent)]">0{index + 1}</p>
                <h3 className="mt-10 text-2xl font-black uppercase">{value.title}</h3>
                <p className="mt-4 leading-7 text-white/60">{value.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </InteriorPage>
  );
}
