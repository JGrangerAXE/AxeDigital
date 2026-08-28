import type { Metadata } from "next";
import Link from "next/link";
import { InteriorPage } from "@/components/shared/InteriorPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Axe Build, LLC handles information submitted through its website.",
};

export default function Privacy() {
  const privacyContact = process.env.PRIVACY_CONTACT_EMAIL?.trim();
  return (
    <InteriorPage
      eyebrow="Privacy"
      title="Privacy Information"
      copy="How Axe Build handles information submitted through this website."
    >
      <section className="surface-dark">
        <div className="container-shell section-pad">
          <div className="industrial-panel max-w-4xl space-y-9 p-7 sm:p-10">
            <section>
              <h2 className="text-xl font-black uppercase">Employment applications</h2>
              <p className="mt-4 leading-8 text-white/60">
                You may submit an employment application through this website. Application information may include your name, contact information, career area of interest, relevant experience, contact preferences, an optional message, and an optional resume.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-black uppercase">How application information is used</h2>
              <p className="mt-4 leading-8 text-white/60">
                Axe Build uses application information for recruiting and hiring purposes, including reviewing your interest and contacting you about potential employment opportunities.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-black uppercase">Service providers</h2>
              <p className="mt-4 leading-8 text-white/60">
                Axe Build uses service providers needed to host the website, privately store application records and optional resumes, and deliver internal application notifications. Those providers process information as necessary to operate the application workflow.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-black uppercase">Contact about your information</h2>
              <p className="mt-4 leading-8 text-white/60">
                Applicants may contact Axe Build with questions about employment-application information. {privacyContact ? (
                  <>Email <a className="text-white underline decoration-[var(--accent)] underline-offset-4" href={`mailto:${privacyContact}`}>{privacyContact}</a>.</>
                ) : (
                  <>Use the contact information published on our <Link className="text-white underline decoration-[var(--accent)] underline-offset-4" href="/contact">Contact page</Link>.</>
                )}
              </p>
            </section>
            <p className="border-l-2 border-[var(--accent)] pl-5 text-sm leading-7 text-white/45">
              This notice does not state a fixed retention period. Axe Build will update this information as its recruiting process, service providers, and approved data practices change.
            </p>
          </div>
        </div>
      </section>
    </InteriorPage>
  );
}
