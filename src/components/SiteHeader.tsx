"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { company, nav } from "@/lib/company";
import { ArrowRight } from "./ui";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${company.name} home`}>
          <Image
            src="/img/logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="h-11 w-11 object-contain"
          />
          <span className="leading-none">
            <span className="font-display block text-base font-extrabold tracking-tight text-navy">
              KARTIKEY
            </span>
            <span className="font-display block text-base font-extrabold tracking-tight text-primary">
              FASTENERS
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`label-caps border-b-2 pb-1 transition-colors ${
                isActive(item.href)
                  ? "border-primary text-primary"
                  : "border-transparent text-body hover:text-navy"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden items-center gap-2 border-l-4 border-accent bg-primary px-6 py-3 text-white transition-colors hover:bg-primary-dk md:inline-flex"
          >
            <span className="label-caps">Request Quote</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            className="border border-line p-2.5 text-navy transition-colors hover:bg-tint lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              {open ? (
                <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="square" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-line bg-white lg:hidden">
          <div className="container-site flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`label-caps border-b border-line py-4 ${
                  isActive(item.href) ? "text-primary" : "text-body"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 mb-4 inline-flex items-center justify-center gap-2 border-l-4 border-accent bg-primary px-6 py-4 text-white"
            >
              <span className="label-caps">Request Quote</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
