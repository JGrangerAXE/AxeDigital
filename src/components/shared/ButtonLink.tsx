import Link from "next/link";
import type { ReactNode } from "react";
type Props = { href:string; children:ReactNode; variant?:"primary"|"secondary"|"text"; className?:string };
export function ButtonLink({ href, children, variant="primary", className="" }:Props) {
  const styles={ primary:"bg-[var(--accent)] text-black hover:bg-white", secondary:"border border-white/30 bg-black/20 text-white hover:border-white hover:bg-white hover:text-black", text:"text-white hover:text-[var(--accent)]" }[variant];
  return <Link href={href} className={`inline-flex min-h-12 items-center justify-center gap-3 px-6 text-sm font-black uppercase tracking-[.1em] transition-colors ${styles} ${className}`}>{children}<span aria-hidden="true">↗</span></Link>;
}
