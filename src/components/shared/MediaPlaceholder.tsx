type Props={ label:string; className?:string; detail?:string };
export function MediaPlaceholder({ label, detail="Approved Axe media", className="" }:Props) {
 return <div className={`media-placeholder flex min-h-48 flex-col justify-between p-5 ${className}`} role="img" aria-label={`${label} media placeholder. ${detail}.`}><span className="w-fit border border-white/20 bg-black/50 px-3 py-2 text-[.65rem] font-bold uppercase tracking-[.18em] text-white/70">Media placeholder</span><div><p className="text-xs font-black uppercase tracking-[.16em] text-[var(--accent)]">{label}</p><p className="mt-1 max-w-xs text-xs leading-5 text-white/45">{detail}</p></div></div>;
}
