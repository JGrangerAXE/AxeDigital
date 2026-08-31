import Image from "next/image";
import type { AxeMediaAsset } from "@/content/media";

type Props = {
  asset: AxeMediaAsset;
  className?: string;
  imageClassName?: string;
  label?: string;
  priority?: boolean;
  sizes?: string;
};

export function AxeMedia({
  asset,
  className = "",
  imageClassName = "",
  label,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  return (
    <figure className={`group relative isolate overflow-hidden bg-[var(--background-deep)] ${className}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectPosition: asset.position }}
        className={`object-cover transition-transform duration-700 group-hover:scale-[1.015] ${imageClassName}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background-deep)]/80 via-transparent to-[var(--background-deep)]/15" aria-hidden="true" />
      {label ? (
        <figcaption className="absolute inset-x-0 bottom-0 p-5 text-xs font-black uppercase tracking-[.16em] text-white">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
