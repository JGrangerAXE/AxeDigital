import type { Metadata } from "next";
import { AxeMedia } from "@/components/shared/AxeMedia";
import { CredentialCard } from "@/components/shared/CredentialCard";
import { InteriorPage } from "@/components/shared/InteriorPage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { integratedWorkflow } from "@/content/company";
import { axeMedia } from "@/content/media";

export const metadata: Metadata = {
  title: "What We Do",
  description: "Explore Axe Build’s vertically integrated design-build commercial construction capability.",
};

export default function WhatWeDo() {
  return (
    <InteriorPage
      eyebrow="Vertical Integration"
      title="Design → Fabricate → Coat → Build"
      copy="Axe Build is a vertically integrated design-build commercial construction company with in-house engineering, fabrication, coatings, and construction capability."
    >
      <section className="surface-dark">
        <div className="container-shell section-pad">
          <div>
            <p className="eyebrow">Credentials</p>
            <h2 className="display mt-5 text-5xl sm:text-6xl">Proven Capability.</h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <CredentialCard
                title="AISC CERTIFIED FABRICATOR"
                logo={{
                  src: "/logos/Cert_Fab_full.png",
                  alt: "AISC Certified Fabricator",
                  width: 252,
                  height: 126,
                }}
              />
              {/* Add the official Wyoming Resident Contractor mark through the logo prop when supplied. */}
              <CredentialCard title="WYOMING RESIDENT CONTRACTOR" />
            </div>
          </div>

          <ol className="mt-16 grid gap-4 md:grid-cols-2">
            {integratedWorkflow.map((stage, index) => (
              <li className="industrial-panel min-h-64 p-7 sm:p-9" key={stage.title}>
                <p className="text-xs font-black text-[var(--accent)]">0{index + 1}</p>
                <h2 className="display mt-14 text-5xl">{stage.title}</h2>
                <p className="mt-4 max-w-lg leading-7 text-white/60">{stage.copy}</p>
              </li>
            ))}
          </ol>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <AxeMedia asset={axeMedia.gradedSite} label="Commercial construction" className="min-h-96" sizes="(max-width: 1024px) 100vw, 50vw" />
            <AxeMedia asset={axeMedia.shopWide} label="In-house fabrication" className="min-h-96" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="surface-mid-gradient border-t border-white/10 py-20 sm:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <SectionHeading
            eyebrow="Project Role"
            title="General Contractor. Subcontractor."
            copy="Axe Build operates as a General Contractor and also partners with other General Contractors as a subcontractor."
          />
          <AxeMedia asset={axeMedia.fabricatedBeam} label="Structural steel commercial construction" className="min-h-80" sizes="(max-width: 1024px) 100vw, 55vw" />
        </div>
      </section>
    </InteriorPage>
  );
}
