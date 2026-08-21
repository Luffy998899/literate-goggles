import type { Metadata } from "next";
import Image from "next/image";
import BrochureButton from "@/components/BrochureButton";
import PageHero from "@/components/PageHero";
import QuoteForm from "@/components/QuoteForm";
import { Reveal, Tilt } from "@/components/motion";
import { Clock, GhostCard, Mail, Phone, Pin, SectionLabel, SectionTitle } from "@/components/ui";
import { company, emails, whatsapp } from "@/lib/company";

export const metadata: Metadata = {
  title: "Contact",
  description: `Kartikey Fasteners, ${company.address.line1}, ${company.address.line2}. Phone ${company.phone}. Open ${company.days}, ${company.hours}.`,
};

const mapsQuery = encodeURIComponent(
  "Kartikey Fasteners, Phase 9, Industrial Area, Mohali, Punjab",
);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Better yet,
            <br />
            <span className="text-accent">see us in person.</span>
          </>
        }
        lede="We love our customers, so feel free to visit during normal business hours. Or send a drawing and a quantity, and we will come back with a price and a lead time."
        image="/img/facility/unit-gate.jpg"
      >
        <div className="flex flex-wrap gap-4">
          <a
            href={whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label-caps inline-flex items-center gap-3 border-l-4 border-[#25D366] bg-white/10 px-8 py-4 text-white transition-colors hover:bg-white/20"
          >
            Message on WhatsApp
          </a>
          <BrochureButton variant="onDark" label="Brochure" />
        </div>
      </PageHero>

      {/* ---------------------------------------------------- Details + form */}
      <section className="scene bg-tint py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          {/* Details */}
          <Reveal direction="right" className="lg:col-span-5">
            <SectionLabel>Reach us</SectionLabel>
            <SectionTitle>Kartikey Fasteners</SectionTitle>

            <ul className="mt-10 space-y-8">
              <li className="flex gap-5">
                <Pin className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  <span className="label-caps text-body/70">Works &amp; office</span>
                  <p className="font-body mt-2 text-base leading-relaxed text-navy">
                    {company.address.line1}
                    <br />
                    {company.address.line2}
                  </p>
                  <p className="font-body mt-2 text-sm text-body">
                    Manufacturing units: {company.plotsLabel}
                  </p>
                </div>
              </li>

              <li className="flex gap-5">
                <Phone className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  <span className="label-caps text-body/70">Phone</span>
                  <p className="mt-2">
                    <a
                      href={company.phoneHref}
                      className="font-display text-xl font-bold text-navy transition-colors hover:text-primary"
                    >
                      {company.phone}
                    </a>
                  </p>
                </div>
              </li>

              <li className="flex gap-5">
                <Clock className="mt-1 size-5 shrink-0 text-primary" />
                <div>
                  <span className="label-caps text-body/70">Hours</span>
                  <p className="font-body mt-2 text-base text-navy">
                    {company.hours}
                    <br />
                    {company.days}
                  </p>
                </div>
              </li>

              <li className="flex gap-5">
                <Mail className="mt-1 size-5 shrink-0 text-primary" />
                <div className="w-full">
                  <span className="label-caps text-body/70">Desks</span>
                  <ul className="mt-3 space-y-0">
                    {emails.map((e) => (
                      <li
                        key={e.value}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line py-2.5"
                      >
                        <span className="label-caps text-[0.7rem] text-body/70">{e.label}</span>
                        <a
                          href={`mailto:${e.value}`}
                          className="font-body text-sm break-all text-navy underline decoration-line underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                        >
                          {e.value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 block"
            >
              <Tilt max={7} lift={16} glare={false}>
                <div className="relative aspect-video w-full overflow-hidden border border-line">
                  <Image
                    src="/img/facility/exterior.jpg"
                    alt="Kartikey Fasteners works, Phase 9, Mohali"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                  />
                  <span className="label-caps absolute right-0 bottom-0 bg-primary px-4 py-2 text-[0.7rem] text-white">
                    Open in Maps
                  </span>
                </div>
              </Tilt>
            </a>
          </Reveal>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal direction="left" delay={120}>
              <QuoteForm />
            </Reveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                {
                  t: "What to include in an enquiry",
                  b: "Part type, thread size and length, material (MS / SS / brass), finish, quantity and any drawing or sample reference.",
                },
                {
                  t: "Certificates on request",
                  b: "Current ISO 9001:2015 and ISO 14001:2015 certificates and third-party test reports are available from the quality desk.",
                },
              ].map((c, i) => (
                <Reveal key={c.t} delay={240 + i * 110} depth>
                  <GhostCard className="lift-3d h-full bg-white">
                    <h3 className="font-display text-base font-bold text-navy">{c.t}</h3>
                    <p className="font-body mt-2 text-sm leading-relaxed text-body">{c.b}</p>
                  </GhostCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- Visit */}
      <section className="dot-grid scene py-16 md:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionLabel tone="dark">Visit</SectionLabel>
            <SectionTitle tone="dark">Phase 9, Industrial Area, Mohali</SectionTitle>
            <p className="font-body mt-6 max-w-xl text-muted">
              Our units sit in the SAS Nagar industrial belt outside Chandigarh. Come in during
              working hours and we will walk you from the wire stock through heading, rolling,
              plating and sorting.
            </p>
            <p className="label-caps mt-8 text-accent">
              {company.days} · {company.hours}
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-3">
            {[
              { src: "/img/facility/unit-gate.jpg", alt: "Unit entrance" },
              { src: "/img/facility/shop-floor.jpg", alt: "Shop floor" },
              { src: "/img/process/packing-sack.jpg", alt: "Branded packing sack" },
              { src: "/img/product/range.jpg", alt: "Finished product range" },
            ].map((img, i) => (
              <Reveal key={img.src} delay={i * 100} depth>
                <Tilt max={10} lift={18} glare={false}>
                  <div className="relative aspect-4/3 overflow-hidden bg-navy">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover opacity-80 grayscale transition-all duration-700 hover:scale-105 hover:opacity-100 hover:grayscale-0"
                    />
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
