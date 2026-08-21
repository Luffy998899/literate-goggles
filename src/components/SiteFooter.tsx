import Image from "next/image";
import Link from "next/link";
import BrochureButton from "./BrochureButton";
import { company, emails, nav } from "@/lib/company";
import { Clock, Mail, Phone, Pin } from "./ui";

export default function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Identity */}
        <div>
          <div className="inline-flex items-center gap-3 bg-white p-3">
            <Image
              src="/img/logo.png"
              alt={company.name}
              width={44}
              height={44}
              className="h-10 w-10 object-contain"
            />
            <span className="leading-none">
              <span className="font-display block text-sm font-extrabold text-navy">KARTIKEY</span>
              <span className="font-display block text-sm font-extrabold text-primary">FASTENERS</span>
            </span>
          </div>
          <p className="font-body mt-6 text-sm text-muted">
            {company.tagline}. Cold forged, rolled, heat treated and plated in-house across four
            units in Mohali, Punjab.
          </p>
          <p className="label-caps mt-6 text-accent">Established {company.lineageYear}</p>

          <div className="mt-6">
            <BrochureButton variant="onDark" label="Brochure" className="!px-5 !py-3" />
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="label-caps mb-5 text-white">Navigate</h4>
          <ul className="font-body space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-white hover:decoration-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Reach */}
        <div>
          <h4 className="label-caps mb-5 text-white">Reach Us</h4>
          <ul className="font-body space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <Pin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                {company.address.line1}
                <br />
                {company.address.line2}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
              <a href={company.phoneHref} className="hover:text-white">
                {company.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>
                {company.hours}
                <br />
                {company.days}
              </span>
            </li>
          </ul>
        </div>

        {/* Desks */}
        <div>
          <h4 className="label-caps mb-5 text-white">Desks</h4>
          <ul className="font-body space-y-3 text-sm">
            {emails.map((e) => (
              <li key={e.value}>
                <span className="label-caps block text-[0.7rem] text-muted/70">{e.label}</span>
                <a
                  href={`mailto:${e.value}`}
                  className="flex items-start gap-2 text-xs wrap-anywhere text-muted transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 size-3.5 shrink-0 text-accent" />
                  {e.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-muted/20">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="font-body text-xs text-muted">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="label-caps text-[0.7rem] text-muted/70">
            ISO 9001:2015 · ISO 14001:2015 Certified
          </p>
        </div>
      </div>
    </footer>
  );
}
