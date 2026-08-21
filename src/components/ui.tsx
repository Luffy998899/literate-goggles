import Link from "next/link";
import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*  Buttons — 0px radius, mono caps label, accent bar on primary               */
/* -------------------------------------------------------------------------- */

export function Cta({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 border-l-4 border-accent bg-primary px-8 py-4 text-white transition-colors duration-200 hover:bg-primary-dk ${className}`}
    >
      <span className="label-caps">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

export function GhostCta({
  href,
  children,
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  /** `dark` = sits on a navy band, `light` = sits on white/tint. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const styles =
    tone === "dark"
      ? "border-muted text-white hover:bg-white/10"
      : "border-line text-primary hover:bg-tint";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 border px-8 py-4 transition-colors duration-200 ${styles} ${className}`}
    >
      <span className="label-caps">{children}</span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section furniture                                                          */
/* -------------------------------------------------------------------------- */

export function SectionLabel({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <div className="mb-6 inline-flex items-center gap-3">
      <span className={`h-1 w-10 ${tone === "dark" ? "bg-accent" : "bg-primary"}`} />
      <span className={`label-caps ${tone === "dark" ? "text-muted" : "text-body"}`}>
        {children}
      </span>
    </div>
  );
}

export function SectionTitle({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-3xl leading-tight font-bold tracking-tight md:text-5xl ${
        tone === "dark" ? "text-white" : "text-navy"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

/** Ghost card: no fill, 1px outline, accent bar on the left. */
export function GhostCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-line border-l-2 border-l-primary p-6 transition-colors duration-200 hover:border-primary/50 ${className}`}
    >
      {children}
    </div>
  );
}

/** Key/value row in the "technical ledger" style. */
export function LedgerRow({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={`flex flex-wrap items-baseline justify-between gap-2 border-b py-3 ${
        tone === "dark" ? "border-muted/25" : "border-line"
      }`}
    >
      <span className={`label-caps ${tone === "dark" ? "text-muted" : "text-body"}`}>
        {label}
      </span>
      <span
        className={`font-body text-sm ${tone === "dark" ? "text-white" : "text-navy"}`}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Icons — inline so the page carries no icon-font dependency                 */
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string };

export function ArrowRight({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="square" />
    </svg>
  );
}

export function Check({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className} aria-hidden>
      <path d="M4 12.5l5.5 5.5L20 7" strokeLinecap="square" />
    </svg>
  );
}

export function Shield({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5L15.5 10" strokeLinecap="square" />
    </svg>
  );
}

export function Factory({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M3 21V10l6 3.5V10l6 3.5V6l6 3v12z" />
      <path d="M3 21h18" strokeLinecap="square" />
    </svg>
  );
}

export function Bolt({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M9 2.6h6l3 3v3.8l-3 3H9l-3-3V5.6z" />
      <path d="M10.5 12.4h3V21h-3z" />
    </svg>
  );
}

export function Pin({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <path d="M12 22s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="11" r="2.6" />
    </svg>
  );
}

export function Phone({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <path d="M4 5c0-.8.7-1.5 1.5-1.5h2L9 7.5 7.3 9a13 13 0 007.7 7.7L16.5 15l4 1.5v2c0 .8-.7 1.5-1.5 1.5A15.5 15.5 0 014 5z" />
    </svg>
  );
}

export function Mail({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" />
      <path d="M3 6l9 6.5L21 6" strokeLinecap="square" />
    </svg>
  );
}

export function Clock({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.6 2.2" strokeLinecap="square" />
    </svg>
  );
}
