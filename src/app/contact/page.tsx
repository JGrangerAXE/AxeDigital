import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { InteriorPage } from "@/components/shared/InteriorPage";
import { getPublicContact } from "@/lib/site/contact";

export const metadata: Metadata = {
  title: "Contact & Request a Quote",
  description: "Contact Axe Build, LLC or prepare a future project quote request.",
};

export default function Contact() {
  const contact = getPublicContact();
  const details = [
    { label: "Phone", value: contact.phone, href: contact.phoneHref },
    { label: "Email", value: contact.email, href: contact.emailHref },
    { label: "Location", value: contact.address, href: null },
  ].filter((detail) => detail.value);
  const hasActions = Boolean(contact.phoneHref || contact.emailHref || contact.quoteEmailHref);
  const hasContactContent = details.length > 0 || hasActions;

  return (
    <InteriorPage eyebrow="Contact" title="Tell Us What You’re Building.">
      {hasContactContent ? (
        <section className="surface-mid">
          <div className="container-shell section-pad">
            <div className={hasActions ? "grid gap-10 lg:grid-cols-[.7fr_1.3fr]" : "max-w-2xl"}>
              {details.length > 0 ? (
                <aside className="industrial-panel p-7">
                  <h2 className="text-xl font-black uppercase">Contact details</h2>
                  <dl className="mt-8 grid gap-6 text-sm">
                    {details.map((detail) => (
                      <div key={detail.label}>
                        <dt className="font-bold text-white/40">{detail.label}</dt>
                        <dd className="mt-1">
                          {detail.href ? (
                            <a className="transition-colors hover:text-[var(--accent)]" href={detail.href}>{detail.value}</a>
                          ) : detail.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </aside>
              ) : null}
              {hasActions ? (
                <div className="industrial-panel flex flex-col justify-between gap-10 p-7 sm:p-9">
                  <h2 className="display max-w-2xl text-4xl sm:text-5xl">Start a Conversation.</h2>
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {contact.phoneHref ? <ButtonLink href={contact.phoneHref}>Call Axe Build</ButtonLink> : null}
                    {contact.emailHref ? <ButtonLink href={contact.emailHref} variant="secondary">Email Axe Build</ButtonLink> : null}
                    {contact.quoteEmailHref ? <ButtonLink href={contact.quoteEmailHref} variant="secondary">Request a Quote</ButtonLink> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </InteriorPage>
  );
}
