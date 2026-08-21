import type { Metadata } from "next";
import Image from "next/image";
import BrochureButton from "@/components/BrochureButton";
import PageHero from "@/components/PageHero";
import TestEquipmentTable from "@/components/TestEquipmentTable";
import { CountUp, Reveal, Tilt } from "@/components/motion";
import { Check, Cta, GhostCard, SectionLabel, SectionTitle } from "@/components/ui";
import {
  company,
  machineryByPlot,
  machineryStats,
  processStages,
  testEquipment,
} from "@/lib/company";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "Four manufacturing units in Phase 9, Mohali: bolt forming, heading, thread rolling, slotting, washer assembly, heat treatment and barrel plating — plus a calibrated in-house measurement room.",
};

const galleryTop = [
  { src: "/img/facility/shop-floor.jpg", alt: "Header machine shop floor" },
  { src: "/img/facility/header-bank.jpg", alt: "Bank of header machines with wire stands" },
  { src: "/img/facility/rolling-line.jpg", alt: "Thread rolling line" },
  { src: "/img/facility/plating-plant.jpg", alt: "Plating and heat treatment plant" },
  { src: "/img/facility/machine-row.jpg", alt: "Row of forming machines" },
  { src: "/img/facility/unit-gate.jpg", alt: "Kartikey Fasteners unit entrance" },
];

export default function InfrastructurePage() {
  return (
    <>
      <PageHero
        eyebrow="Plant & machinery"
        title={
          <>
            Four units.
            <br />
            <span className="text-accent">{machineryStats.total} machines.</span>
          </>
        }
        lede={`${company.plotsLabel}. Forming, threading, slotting, heat treatment, plating and sorting all sit inside our own walls — which is why a schedule change on Monday does not become a subcontractor's problem on Thursday.`}
        image="/img/facility/shop-floor.jpg"
      >
        <BrochureButton variant="onDark" label="Company profile" />
      </PageHero>

      {/* ---------------------------------------------------------- Stat ledger */}
      <section className="bg-primary py-12">
        <div className="container-site grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { v: machineryStats.headers, l: "Header machines" },
            { v: machineryStats.rolling, l: "Rolling machines" },
            { v: machineryStats.slotters, l: "Slotters" },
            { v: machineryStats.plating, l: "Furnaces & barrels" },
            { v: testEquipment.length, l: "Classes of test gear" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 90}>
              <div className="border-l-2 border-white/40 pl-5">
                <CountUp
                  to={s.v}
                  className="font-display block text-4xl leading-none font-extrabold text-white"
                />
                <div className="label-caps mt-3 text-white/75">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- Gallery */}
      <section className="scene bg-white py-20 md:py-24">
        <div className="container-site">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <SectionLabel>On the floor</SectionLabel>
              <SectionTitle>The works at Phase 9</SectionTitle>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryTop.map((img, i) => (
              <Reveal key={img.src} delay={(i % 3) * 100} depth duration={800}>
                <Tilt max={8} lift={18} glare={false}>
                  <div className="group relative aspect-4/3 overflow-hidden bg-white">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    />
                    <span className="label-caps absolute bottom-0 left-0 translate-y-full bg-navy/90 px-4 py-2 text-[0.7rem] text-white transition-transform duration-400 group-hover:translate-y-0">
                      {img.alt}
                    </span>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Process */}
      <section className="bg-tint py-20 md:py-28">
        <div className="container-site">
          <Reveal>
            <div className="mb-16 max-w-2xl">
              <SectionLabel>Manufacturing process</SectionLabel>
              <SectionTitle>Wire in. Packed carton out.</SectionTitle>
              <p className="font-body mt-4 text-body">
                Seven stages, each with its own critical-to-quality checks recorded on a PQC
                sheet before the batch moves on.
              </p>
            </div>
          </Reveal>

          <div className="scene space-y-px bg-line">
            {processStages.map((s, i) => (
              <article
                key={s.step}
                className="grid items-center gap-10 bg-tint py-12 lg:grid-cols-12"
              >
                <Reveal
                  direction={i % 2 === 1 ? "left" : "right"}
                  className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}
                >
                  <Tilt max={7} lift={16} glare={false}>
                    <div className="relative aspect-4/3 w-full overflow-hidden">
                      <Image
                        src={s.image}
                        alt={`${s.title} — Kartikey Fasteners`}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                      />
                      <span className="font-display absolute top-0 left-0 bg-primary px-4 py-2 text-lg font-extrabold text-white">
                        {s.step}
                      </span>
                    </div>
                  </Tilt>
                </Reveal>

                <Reveal
                  delay={120}
                  className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : ""}`}
                >
                  <h3 className="font-display text-2xl leading-tight font-bold tracking-tight text-navy md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="font-body mt-4 max-w-xl text-base leading-relaxed text-body">
                    {s.body}
                  </p>
                  <ul className="mt-8 space-y-3 border-t border-line pt-6">
                    {s.checks.map((c) => (
                      <li key={c} className="flex items-start gap-3">
                        <Check className="mt-1 size-3.5 shrink-0 text-primary" />
                        <span className="font-body text-sm text-navy">{c}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Machinery ledger */}
      <section className="dot-grid py-20 md:py-28">
        <div className="container-site">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <SectionLabel tone="dark">Master list</SectionLabel>
              <SectionTitle tone="dark">Machinery, unit by unit</SectionTitle>
              <p className="font-body mt-4 text-muted">
                {machineryStats.total} machines across {machineryStats.units} plots in Phase 9,
                SAS Nagar.
              </p>
            </div>
          </Reveal>

          <div className="space-y-10">
            {machineryByPlot.map((group) => (
              <Reveal key={group.plot} depth duration={800} className="border border-muted/25">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-muted/25 bg-navy-deep px-6 py-4">
                  <h3 className="font-display text-lg font-bold text-white">{group.plot}</h3>
                  <span className="label-caps text-accent">{group.role}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[42rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-muted/25">
                        {["Machinery", "Make", "Capacity / machine", "Qty"].map((h) => (
                          <th key={h} className="label-caps px-6 py-3 text-[0.7rem] text-muted">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-body text-sm">
                      {group.machines.map((m, i) => (
                        <tr
                          key={`${group.plot}-${m.machine}-${m.make}-${i}`}
                          className="border-b border-muted/15 last:border-0 hover:bg-white/5"
                        >
                          <td className="px-6 py-3 font-medium text-white">{m.machine}</td>
                          <td className="px-6 py-3 text-muted">{m.make}</td>
                          <td className="px-6 py-3 text-muted">{m.capacity}</td>
                          <td className="px-6 py-3">
                            <span className="font-display font-bold text-accent">{m.qty}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Metrology room */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-site">
          <div className="mb-14 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel>Measurement</SectionLabel>
              <SectionTitle>Calibrated instruments, not opinions</SectionTitle>
              <p className="font-body mt-4 max-w-xl text-body">
                Dimensions, hardness, torque, depth and finish are each measured on dedicated,
                calibrated gear. The list below is the equipment register we work to.
              </p>
            </div>
            <div className="scene grid grid-cols-3 gap-4 lg:col-span-5">
              {[
                { src: "/img/quality/rockwell-tester.png", label: "Rockwell hardness" },
                { src: "/img/quality/salt-spray-chamber.png", label: "Salt spray chamber" },
                { src: "/img/quality/vision-measuring.jpg", label: "Vision measuring" },
              ].map((t, i) => (
                <Reveal key={t.src} delay={i * 110} depth>
                  <figure className="lift-3d">
                    <div className="relative aspect-square bg-tint">
                      <Image
                        src={t.src}
                        alt={t.label}
                        fill
                        sizes="16vw"
                        className="object-contain p-3"
                      />
                    </div>
                    <figcaption className="label-caps mt-2 text-[0.65rem] text-body">
                      {t.label}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>

          <TestEquipmentTable />

          <div className="scene mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Heading CTQ",
                b: "Blank dia, head dia, washer dia, length, washer thickness and head thickness — plus a bit check.",
              },
              {
                t: "Rolling CTQ",
                b: "Thread dia and length on micrometer and vernier, Go / No-Go gauge on machine screws, visual point and thread check.",
              },
              {
                t: "Post-plating",
                b: "Thread ring gauge Go / No-Go after the dip and dry, then piece-by-piece segregation.",
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 110} depth>
                <GhostCard className="lift-3d h-full bg-white">
                  <h3 className="font-display text-base font-bold text-navy">{c.t}</h3>
                  <p className="font-body mt-2 text-sm text-body">{c.b}</p>
                </GhostCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="bg-tint py-16 md:py-20">
        <div className="container-site flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <SectionTitle className="max-w-2xl !text-3xl md:!text-4xl">
              Come and see it in person.
            </SectionTitle>
            <p className="font-body mt-4 max-w-xl text-body">
              We like our customers on the floor. {company.hours}, {company.days}.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Cta href="/contact">Arrange a visit</Cta>
            <BrochureButton variant="outline" label="Brochure" />
          </div>
        </div>
      </section>
    </>
  );
}
