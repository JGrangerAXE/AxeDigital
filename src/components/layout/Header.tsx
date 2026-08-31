"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between">
        <Link href="/" className="logo-frame inline-flex px-2 py-1" aria-label="Axe Build home" onClick={() => setOpen(false)}>
          <Image src="/logos/AXE%20BUILD%20LOGO.png" alt="Axe Build, LLC" width={2059} height={984} priority className="h-auto w-[7rem] sm:w-32" />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`text-xs font-bold uppercase tracking-[.12em] transition-colors hover:text-[var(--accent)] ${pathname === link.href ? "text-[var(--accent)]" : "text-white/75"}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/careers#apply" className="bg-[var(--accent)] px-5 py-3 text-xs font-black uppercase tracking-[.12em] text-[var(--background-deep)] transition-colors hover:bg-white">
            Join Axe Build
          </Link>
        </nav>
        <button type="button" className="grid h-11 w-11 place-items-center border border-white/20 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          <span className="text-xl" aria-hidden="true">{open ? "×" : "≡"}</span>
        </button>
      </div>
      {open ? (
        <nav id="mobile-menu" className="surface-deep border-t border-white/10 px-4 pb-6 lg:hidden" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-4 text-base font-black uppercase tracking-[.1em]">{link.label}</Link>)}
          <Link href="/careers#apply" onClick={() => setOpen(false)} className="mt-5 flex min-h-12 items-center justify-center bg-[var(--accent)] font-black uppercase tracking-[.12em] text-[var(--background-deep)]">
            Join Axe Build
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
