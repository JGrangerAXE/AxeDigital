import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { getPublicContact } from "@/lib/site/contact";

const links = [
  { href: "/", label: "Home" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const contact = getPublicContact();
  const hasContact = Boolean(contact.phone || contact.email || contact.address);

  return (
    <footer className="site-footer border-t border-white/10">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="logo-frame inline-flex p-3" aria-label="Axe Build home">
            <Image src="/logos/AXE%20BUILD%20IMG%20TRANSPARENT%20resized.png" alt="Axe Build, LLC" width={1024} height={504} className="h-auto w-40" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/50">Construction and fabrication. Built by people who take pride in real work.</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-white/40">Navigate</p>
          <nav className="mt-4 grid gap-3" aria-label="Footer navigation">
            {links.map((link) => <Link key={link.href} href={link.href} className="w-fit text-sm text-white/70 hover:text-[var(--accent)]">{link.label}</Link>)}
          </nav>
        </div>
        {hasContact ? (
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-white/40">Contact</p>
            <address className="mt-4 not-italic text-sm leading-7 text-white/60">
              {contact.phone && contact.phoneHref ? <p><a href={contact.phoneHref} className="hover:text-[var(--accent)]">{contact.phone}</a></p> : null}
              {contact.email && contact.emailHref ? <p><a href={contact.emailHref} className="hover:text-[var(--accent)]">{contact.email}</a></p> : null}
              {contact.address ? <p>{contact.address}</p> : null}
            </address>
          </div>
        ) : null}
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-white/40">Build your future</p>
          <p className="my-4 text-sm leading-6 text-white/60">Interested in skilled work with Axe?</p>
          <ButtonLink href="/careers">Explore Careers</ButtonLink>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-3 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Axe Build, LLC. All rights reserved.</p>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
