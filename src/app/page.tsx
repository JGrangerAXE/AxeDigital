import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AxeMedia } from "@/components/shared/AxeMedia";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { axeMedia, type AxeMediaAsset } from "@/content/media";
import { getPublicContact } from "@/lib/site/contact";

export const metadata: Metadata = {
  title: "Build Something Real",
  description: "Explore skilled-trade careers and construction and fabrication capabilities at Axe Build, LLC.",
};

const jobValues = [
  { n: "01", title: "Tangible work", copy: "See the result of your effort take shape in the real world." },
  { n: "02", title: "Valuable skills", copy: "Build practical abilities that grow stronger with experience." },
  { n: "03", title: "Team contribution", copy: "Do work that matters to the people standing beside you." },
  { n: "04", title: "Career growth", copy: "Take on more as your judgment, skill, and confidence develop." },
];

const capabilities: Array<{ title: string; asset?: AxeMediaAsset; className: string }> = [
  { title: "Construction", asset: axeMedia.gradedSite, className: "min-h-80 lg:col-span-7" },
  { title: "Fabrication", asset: axeMedia.shopWide, className: "min-h-80 lg:col-span-5" },
  { title: "Welding", asset: axeMedia.fabricatedBeam, className: "min-h-64 lg:col-span-4" },
  { title: "Machining", asset: axeMedia.steelMachine, className: "min-h-64 lg:col-span-4" },
  { title: "Coatings", className: "min-h-64 lg:col-span-2" },
  { title: "Assembly", className: "min-h-64 lg:col-span-2" },
];

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
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-deep)] via-[var(--background-deep)]/72 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-deep)] via-transparent to-black/35" />
        <div className="container-shell relative z-10 pb-14 pt-28 sm:pb-20">
          <p className="eyebrow">Construction + Fabrication</p>
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
                  <h2 className="display text-5xl sm:text-6xl">Build With Axe</h2>
                  <p className="mt-4 max-w-sm leading-7 text-white/55">Careers, skilled trades, learning, and the chance to contribute.</p>
                </div>
                <span className="text-3xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
            </Link>
            <Link href="/contact" className="industrial-panel group min-h-72 p-7 transition-colors hover:border-[var(--accent)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--accent)]">For project partners</p>
              <div className="mt-16 flex items-end justify-between gap-5">
                <div>
                  <h2 className="display text-5xl sm:text-6xl">Build With Us</h2>
                  <p className="mt-4 max-w-sm leading-7 text-white/55">Construction, fabrication, project capabilities, and quote requests.</p>
                </div>
                <span className="text-3xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-charcoal-gradient border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Built at Axe" title="The Work Speaks." copy="Real jobsites, real equipment, and the people and machinery that move the work forward." />
          <div className="mt-10 grid gap-3 lg:grid-cols-12 lg:grid-rows-[22rem_18rem]">
            <AxeMedia asset={axeMedia.crewRebar} label="Construction / Field work" className="min-h-[34rem] lg:col-span-7 lg:row-span-2" sizes="(max-width: 1024px) 100vw, 58vw" />
            <AxeMedia asset={axeMedia.telehandlerEntry} label="Heavy equipment" className="min-h-72 lg:col-span-5" sizes="(max-width: 1024px) 100vw, 42vw" />
            <AxeMedia asset={axeMedia.plasmaCutting} label="Precision cutting" className="min-h-72 lg:col-span-2" sizes="(max-width: 1024px) 50vw, 17vw" />
            <AxeMedia asset={axeMedia.fabricatedBeam} label="Built in the shop" className="min-h-72 lg:col-span-3" sizes="(max-width: 1024px) 50vw, 25vw" />
          </div>
        </div>
      </section>

      <section className="surface-dark py-20 sm:py-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <SectionHeading eyebrow="More than a job" title="Learn It. Own It. Be Proud Of It." />
              <div className="mt-8"><ButtonLink href="/careers">Explore Careers</ButtonLink></div>
            </div>
            <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2">
              {jobValues.map((item) => (
                <article key={item.n} className="bg-[var(--background-deep)] p-5">
                  <p className="text-xs font-black text-[var(--accent)]">{item.n}</p>
                  <h3 className="mt-5 font-black uppercase tracking-[.05em]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
          <AxeMedia asset={axeMedia.liftsRaised} label="Serious equipment. Tangible work." className="min-h-[32rem] lg:min-h-full" sizes="(max-width: 1024px) 100vw, 55vw" />
        </div>
      </section>

      <section className="surface-mid-gradient border-y border-white/10 py-20 sm:py-24">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="What we do" title="One Team. Many Capabilities." copy="A visual preview of Axe capability across the field and the shop." />
            <ButtonLink href="/what-we-do" variant="secondary">View Capabilities</ButtonLink>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
            {capabilities.map((item, index) => item.asset ? (
              <AxeMedia key={item.title} asset={item.asset} label={`0${index + 1} / ${item.title}`} className={item.className} sizes="(max-width: 1024px) 100vw, 58vw" />
            ) : (
              <article key={item.title} className={`industrial-panel flex flex-col justify-between p-6 ${item.className}`}>
                <span className="text-xs font-black text-[var(--accent)]">0{index + 1}</span>
                <h3 className="text-2xl font-black uppercase tracking-[.04em]">{item.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-dark py-20 sm:py-24">
        <div className="container-shell">
          <SectionHeading eyebrow="Life at Axe" title="Real Work. Real People." copy="A first look at the equipment, environments, and hands-on work behind Axe." />
          <div className="mt-10 grid auto-rows-[15rem] grid-cols-2 gap-3 lg:auto-rows-[18rem] lg:grid-cols-12">
            <AxeMedia asset={axeMedia.excavatorsPortrait} label="In the field" className="row-span-2 lg:col-span-4" sizes="(max-width: 1024px) 50vw, 33vw" />
            <AxeMedia asset={axeMedia.liftsBay} label="On site" className="lg:col-span-5" sizes="(max-width: 1024px) 50vw, 42vw" />
            <AxeMedia asset={axeMedia.telehandlerDetail} label="Axe equipment" className="lg:col-span-3" sizes="(max-width: 1024px) 50vw, 25vw" />
            <AxeMedia asset={axeMedia.steelStock} label="Ready to build" className="lg:col-span-3" sizes="(max-width: 1024px) 50vw, 25vw" />
            <AxeMedia asset={axeMedia.weldingEquipment} label="Shop ready" className="lg:col-span-5" sizes="(max-width: 1024px) 50vw, 42vw" />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[var(--accent)] text-black">
        <div className="container-shell flex flex-col justify-between gap-8 py-14 lg:flex-row lg:items-center">
          <h2 className="display max-w-3xl text-5xl sm:text-7xl">Ready to Build Something?</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/careers" className="bg-black text-white hover:bg-white hover:text-black">Join Axe</ButtonLink>
            <ButtonLink href={quoteEmailHref ?? "/contact"} variant="secondary" className="border-black/40 text-black hover:bg-black hover:text-white">Request a Quote</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
