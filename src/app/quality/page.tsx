import type { Metadata } from "next";
import Image from "next/image";
import BrochureButton from "@/components/BrochureButton";
import PageHero from "@/components/PageHero";
import TestEquipmentTable from "@/components/TestEquipmentTable";
import { Reveal, Tilt } from "@/components/motion";
import { Check, Cta, LedgerRow, SectionLabel, SectionTitle } from "@/components/ui";
import {
  certificationScope,
  certifications,
  testingLab,
  thirdPartyTests,
} from "@/lib/company";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "ISO 9001:2015 (certificate 25MEQTV94) and ISO 14001:2015 (certificate 25MEETL86) certified by Magnitude Management Services. Independent salt spray testing to ASTM B-117-2019 by Indiana, Mohali.",
};

const testingMachines = [
  {
    src: "/img/quality/rockwell-tester.png",
    name: "Rockwell Hardness Tester",
    note: "Hardness verified in HRC after heat treatment.",
  },
  {
    src: "/img/quality/salt-spray-chamber.png",
    name: "Salt Spray Test Chamber",
    note: "In-house corrosion testing of plated finishes.",
  },
  {
    src: "/img/quality/vision-measuring.jpg",
    name: "Vision Measuring Machine",
    note: "Optical dimensional measurement of formed parts.",
  },
];

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality assurance"
        title={
          <>
            Certified.
            <br />
            <span className="text-accent">And independently tested.</span>
          </>
        }
        lede="Our quality and environmental management systems are certified to ISO 9001:2015 and ISO 14001:2015. Finished parts go out to an accredited third-party laboratory for salt spray testing to ASTM B-117-2019."
        image="/img/quality/iso-9001.jpg"
      >
        <BrochureButton variant="onDark" label="Company profile" />
      </PageHero>

      {/* ------------------------------------------------------- Certifications */}
      <section className="scene bg-white py-20 md:py-28">
        <div className="container-site">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <SectionLabel>Registered certificates</SectionLabel>
              <SectionTitle>Certificates of registration</SectionTitle>
              <p className="font-body mt-4 text-body">
                Issued by {certifications[0].body} — {certifications[0].accreditation}.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-2">
            {certifications.map((c, i) => (
              <Reveal key={c.standard} delay={i * 140} depth duration={800}>
                <article className="lift-3d h-full border border-line bg-white">
                <div className="grid gap-0 sm:grid-cols-5">
                  <div className="relative aspect-3/4 overflow-hidden sm:col-span-2 sm:aspect-auto">
                    <Image
                      src={c.image}
                      alt={`${c.standard} certificate of registration`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 40vw"
                      className="object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  <div className="p-7 sm:col-span-3">
                    <span className="label-caps text-primary">{c.system}</span>
                    <h3 className="font-display mt-3 text-2xl leading-tight font-extrabold text-navy">
                      {c.standard}
                    </h3>

                    <dl className="mt-6">
                      <LedgerRow label="Certificate no." value={c.certificateNo} />
                      <LedgerRow label="Issued" value={c.issued} />
                      <LedgerRow label="Valid until" value={c.expires} />
                      <LedgerRow label="Surveillance" value={c.surveillance} />
                    </dl>
                  </div>
                </div>

                <div className="border-t border-line bg-tint px-7 py-5">
                  <span className="label-caps text-body/70">Scope</span>
                  <p className="font-body mt-2 text-sm leading-relaxed text-body">
                    {certificationScope}
                  </p>
                </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Third party testing */}
      <section className="dot-grid scene relative overflow-hidden py-20 md:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="animate-aurora absolute top-0 -right-40 size-[34rem] rounded-full bg-primary/25 blur-[130px]" />
        </div>

        <div className="container-site relative">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <SectionLabel tone="dark">Third-party testing</SectionLabel>
              <SectionTitle tone="dark">Tested by {testingLab.name}</SectionTitle>
              <p className="font-body mt-4 text-muted">
                {testingLab.full} — {testingLab.note}. Samples are drawn by the customer and
                tested to ASTM B-117-2019.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-2">
            {thirdPartyTests.map((t, i) => (
              <Reveal key={t.report} delay={i * 140} depth duration={800}>
                <article className="lift-3d h-full border border-muted/25 bg-navy-deep/60">
                <div className="grid sm:grid-cols-5">
                  <div className="relative aspect-3/4 overflow-hidden sm:col-span-2 sm:aspect-auto">
                    <Image
                      src={t.image}
                      alt={`Salt spray test report ${t.report}`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 40vw"
                      className="object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="p-7 sm:col-span-3">
                    <span className="label-caps text-accent">Report {t.report}</span>
                    <h3 className="font-display mt-3 text-xl leading-tight font-bold text-white">
                      {t.sample}
                    </h3>
                    <dl className="mt-6">
                      <LedgerRow tone="dark" label="Method" value={t.method} />
                      <LedgerRow tone="dark" label="Duration" value={t.duration} />
                      <LedgerRow tone="dark" label="Discipline" value="Corrosion / chemical" />
                    </dl>
                    <p className="font-body mt-5 border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted">
                      {t.result}
                    </p>
                  </div>
                </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="font-body mt-8 text-xs text-muted/70">
            Test results apply to the samples as received; sample descriptions are as given by the
            customer.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ Testing machines */}
      <section className="scene bg-white py-20 md:py-28">
        <div className="container-site">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <SectionLabel>In-house</SectionLabel>
              <SectionTitle>Testing machines on site</SectionTitle>
            </div>
          </Reveal>

          <div className="grid gap-3 md:grid-cols-3">
            {testingMachines.map((m, i) => (
              <Reveal key={m.name} delay={i * 120} depth duration={800}>
                <Tilt max={9} lift={20} glare={false}>
                  <div className="h-full border border-line bg-white p-8">
                    <div className="animate-float-slow relative mx-auto aspect-square w-full max-w-56">
                      <Image
                        src={m.src}
                        alt={m.name}
                        fill
                        sizes="(min-width: 768px) 25vw, 60vw"
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-display mt-6 text-lg font-bold text-navy">{m.name}</h3>
                    <p className="font-body mt-2 text-sm leading-relaxed text-body">{m.note}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Traceability chain */}
      <section className="bg-tint py-20 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionLabel>Traceability</SectionLabel>
              <SectionTitle>From coil to carton</SectionTitle>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {[
                "Mill test certificate received with every wire consignment, stating chemical composition and mechanical properties.",
                "Wire diameter verified on a vernier caliper before the coil reaches a header.",
                "Wire pieces sent for third-party testing with an MTC report returned.",
                "CTQ and PQC check sheets completed at heading and at rolling.",
                "Thread ring gauge Go / No-Go after plating, then piece-by-piece segregation.",
              ].map((step, i) => (
                <Reveal key={step} delay={i * 90} direction="right">
                  <li className="flex items-start gap-4 border-b border-line pb-4">
                    <Check className="mt-1 size-4 shrink-0 text-primary" />
                    <span className="font-body text-sm leading-relaxed text-body">{step}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="scene grid grid-cols-2 gap-4">
            {[
              { src: "/img/process/ctq-micrometer.jpg", alt: "Micrometer check on a formed part" },
              { src: "/img/process/ctq-caliper.jpg", alt: "Digital vernier caliper check" },
              { src: "/img/process/pqc-sheet.jpg", alt: "PQC check sheet on the floor" },
              { src: "/img/process/thread-macro.jpg", alt: "Rolled thread inspected by hand" },
            ].map((img, i) => (
              <Reveal key={img.src} delay={i * 100} depth>
                <Tilt max={9} lift={16} glare={false}>
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                    />
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Equipment ledger */}
      <section className="bg-white py-20 md:py-24">
        <div className="container-site">
          <div className="mb-12 max-w-2xl">
            <SectionLabel>Equipment register</SectionLabel>
            <SectionTitle>Calibrated measurement gear</SectionTitle>
          </div>

          <TestEquipmentTable />
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-site flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl">
              Need our certificates on file?
            </h2>
            <p className="font-body mt-4 max-w-xl text-white/80">
              Write to our quality desk and we will send the current ISO certificates and the
              relevant test reports.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Cta href="/contact" className="border-l-white bg-white !text-primary hover:bg-tint">
              Contact quality
            </Cta>
            <BrochureButton variant="onDark" label="Brochure" />
          </div>
        </div>
      </section>
    </>
  );
}
