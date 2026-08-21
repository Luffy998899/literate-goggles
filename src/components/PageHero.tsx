import Image from "next/image";
import type { ReactNode } from "react";
import { Parallax, Reveal } from "./motion";

/**
 * Interior page hero: navy band, dot grid, drifting aurora, and a grayscale
 * plate that parallaxes in from the right.
 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  /** Decorative only — the section is a backdrop, so the img carries no alt. */
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="dot-grid scene relative overflow-hidden">
      {/* Depth wash behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="animate-aurora absolute -top-40 -left-32 size-[34rem] rounded-full bg-primary/25 blur-[110px]" />
        <span className="animate-aurora-slow absolute -right-24 -bottom-48 size-[30rem] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Parallax speed={-0.06} className="absolute inset-[-12%]">
          <div className="relative size-full">
            <Image
              src={image}
              alt=""
              fill
              sizes="50vw"
              className="object-cover opacity-45 grayscale"
              priority
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-navy/20" />
      </div>

      <div className="container-site relative py-20 md:py-28">
        <div className="max-w-2xl">
          <Reveal direction="right" duration={600}>
            <div className="mb-6 inline-flex items-center gap-3">
              <span className="h-1 w-10 bg-accent" />
              <span className="label-caps text-muted">{eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={90} depth>
            <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-white md:text-6xl">
              {title}
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="font-body mt-8 border-l-2 border-muted/40 pl-6 text-lg leading-relaxed text-muted">
              {lede}
            </p>
          </Reveal>

          {children ? (
            <Reveal delay={340}>
              <div className="mt-10">{children}</div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
