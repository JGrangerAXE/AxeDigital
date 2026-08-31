import Image from "next/image";

type CredentialLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type CredentialCardProps = {
  title: string;
  logo?: CredentialLogo;
};

export function CredentialCard({ title, logo }: CredentialCardProps) {
  return (
    <article className="industrial-panel flex min-h-72 flex-col justify-between gap-10 p-7 sm:p-9">
      {logo ? (
        <div className="flex min-h-36 items-center justify-center bg-[var(--text-primary)] p-7 sm:p-9">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-auto max-h-32 w-auto max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="h-1 w-16 bg-[var(--accent)]" aria-hidden="true" />
      )}
      <h3 className="display text-4xl sm:text-5xl">{title}</h3>
    </article>
  );
}
