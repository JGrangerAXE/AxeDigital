import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AxeMedia } from "@/components/shared/AxeMedia";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { CredentialCard } from "@/components/shared/CredentialCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { companyPurpose, integratedWorkflow } from "@/content/company";
import { axeMedia } from "@/content/media";
import { getPublicContact } from "@/lib/site/contact";

export const metadata: Metadata = {
  title: "Build Something Real",
  description: "Explore careers and vertically integrated design-build commercial construction at Axe Build, LLC.",
};

export default function Home() {
  const { quoteEmailHref } = getPublicContact();

  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden border-b border-white/10 pt-20">
        <Image
          src={axeMedia.excavatorsWide.src}
          alt={axeMedia.excavatorsWide.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: axeMedia.excavatorsWide.position }}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-deep)] via-[var(--background-deep)]/75 to-[var(--background-deep)]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-deep)] via-transparent to-[var(--background-deep)]/45" />
        <div className="container-shell relative z-10 pb-14 pt-28 sm:pb-20">
          <p className="eyebrow leading-relaxed">
 	 <span>
   	 <span className="block">Vertically Integrated Commercial Contractor</span>
  	  <span className="block">Design · Build · Fabricate · Construct</span>
 	 </span>
	</p>
          <h1 className="display mt-6 max-w-5xl text-[clamp(4.5rem,13vw,10rem)]">
            Build Something <span className="text-[var(--accent)]">Real.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/80 sm:text-2xl">
            Serious work. Valuable skills. A career you can be proud of.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/careers">Explore Careers</ButtonLink>
            <ButtonLink href="/what-we-do" variant="secondary">See What We Do</ButtonLink>
          </div>
        </div>
        <div className="absolute bottom-5 right-5 hidden items-center gap-3 text-[.6rem] font-bold uppercase tracking-[.18em] text-white/60 sm:flex">
          <span className="h-px w-12 bg-white/40" /> Real work. Real scale.
        </div>
      </section>

      <section className="surface-mid py-16 sm:py-20">
        <div className="container-shell">
          <div className="grid gap-4 lg:grid-cols-2">
            <Link href="/careers" className="industrial-panel group min-h-72 p-7 transition-colors hover:border-[var(--accent)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--accent)]">For candidates</p>
              <div className="mt-16 flex items-end justify-between gap-5">
                <div>
                  <h2 className="display text-5xl sm:text-6xl">Work With Axe Build</h2>
                  <p className="mt-4 max-w-sm leading-7 text-white/55">Careers, skilled trades, and the chance to contribute.</p>
                </div>
                <span className="text-3xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
            </Link>
            <Link href="/contact" className="industrial-panel group min-h-72 p-7 transition-colors hover:border-[var(--accent)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--accent)]">For project partners</p>
              <div className="mt-16 flex items-end justify-between gap-5">
                <div>
                  <h2 className="display text-5xl sm:text-6xl">Build With Axe Build</h2>
                  <p className="mt-4 max-w-md leading-7 text-white/55">Design-build commercial construction with in-house engineering, fabrication, coatings, and construction.</p>
                </div>
                <span className="text-3xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-charcoal-gradient border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Credentials" title="Proven Capability." />
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
            <CredentialCard
              title="WYOMING RESIDENT CONTRACTOR"
              logo={{
                src: "/logos/wyoming-resident-contractor-2251.png",
                alt: "Wyoming Resident Contractor 2251",
                width: 2348,
                height: 2073,
              }}
            />
          </div>
        </div>
      </section>

      <section className="surface-dark py-20 sm:py-24">
        <div className="container-shell py-4 sm:py-8">
          <p className="eyebrow">Our Purpose</p>
          <h2 className="display display-statement mt-7 max-w-7xl text-4xl sm:text-6xl lg:text-7xl">{companyPurpose}</h2>
        </div>
      </section>

      <section className="surface-mid-gradient border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Vertical Integration" title="Design → Fabricate → Coat → Build" copy="Axe Build is a vertically integrated design-build commercial construction company with in-house engineering, fabrication, coatings, and construction capability." />
            <ButtonLink href="/what-we-do" variant="secondary">View Capabilities</ButtonLink>
          </div>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {integratedWorkflow.map((stage, index) => (
              <li key={stage.title} className="industrial-panel flex min-h-64 flex-col justify-between p-6">
                <span className="text-xs font-black text-[var(--accent)]">0{index + 1}</span>
                <div>
                  <h3 className="display text-4xl">{stage.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/55">{stage.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="surface-dark py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Life at Axe Build" title="Real Work. Real People." copy="A look at the equipment, environments, and hands-on work behind Axe Build." />
          <div className="mt-10 grid auto-rows-[15rem] grid-cols-2 gap-3 lg:auto-rows-[18rem] lg:grid-cols-12">
            <AxeMedia asset={axeMedia.excavatorsPortrait} label="" className="row-span-2 lg:col-span-4" sizes="(max-width: 1024px) 50vw, 33vw" />
            <AxeMedia asset={axeMedia.liftsBay} label="" className="lg:col-span-5" sizes="(max-width: 1024px) 50vw, 42vw" />
            <AxeMedia asset={axeMedia.telehandlerDetail} label="" className="lg:col-span-3" sizes="(max-width: 1024px) 50vw, 25vw" />
            <AxeMedia asset={axeMedia.steelStock} label="" className="lg:col-span-3" sizes="(max-width: 1024px) 50vw, 25vw" />
            <AxeMedia asset={axeMedia.weldingEquipment} label="" className="lg:col-span-5" sizes="(max-width: 1024px) 50vw, 42vw" />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[var(--accent)] text-[var(--background-deep)]">
        <div className="container-shell flex flex-col justify-between gap-8 py-14 lg:flex-row lg:items-center">
          <h2 className="display max-w-3xl text-5xl sm:text-7xl">Ready to Build Something?</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/careers" className="bg-[var(--background-deep)] text-white hover:bg-white hover:text-[var(--background-deep)]">Join Axe Build</ButtonLink>
            <ButtonLink href={quoteEmailHref ?? "/contact"} variant="secondary" className="border-[var(--background-deep)]/40 text-[var(--background-deep)] hover:bg-[var(--background-deep)] hover:text-white">Request a Quote</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
