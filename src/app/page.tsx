import Image from "next/image";
import Link from "next/link";
import BrochureButton from "@/components/BrochureButton";
import CustomerMarquee from "@/components/CustomerMarquee";
import Hero3D from "@/components/Hero3D";
import { CountUp, Parallax, Reveal, Tilt } from "@/components/motion";
import {
  ArrowRight,
  Bolt,
  Check,
  Cta,
  Factory,
  GhostCta,
  SectionLabel,
  SectionTitle,
  Shield,
} from "@/components/ui";
import {
  certifications,
  company,
  machineryStats,
  processStages,
  products,
} from "@/lib/company";

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="dot-grid scene relative flex min-h-[88vh] items-center overflow-hidden">
        {/* Drifting depth wash */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="animate-aurora absolute -top-48 -left-40 size-[42rem] rounded-full bg-primary/30 blur-[130px]" />
          <span className="animate-aurora-slow absolute top-1/4 -right-32 size-[38rem] rounded-full bg-accent/20 blur-[140px]" />
        </div>

        {/* Photographic base — also the fallback if WebGL is unavailable. */}
        <div aria-hidden className="absolute inset-y-0 right-0 hidden w-3/5 lg:block">
          <Parallax speed={-0.08} className="absolute inset-[-14%]">
            <div className="relative size-full">
              <Image
                src="/img/product/hero-fasteners.jpg"
                alt=""
                fill
                sizes="60vw"
                priority
                className="object-cover opacity-35 grayscale"
              />
            </div>
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/45" />
        </div>

        {/* Live WebGL fasteners. Decorative, pointer-transparent, lazy-loaded. */}
        <Hero3D className="pointer-events-none absolute inset-0 z-[1]" />

        {/* Keeps the headline legible where it crosses the 3D cluster. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-navy via-navy/70 to-transparent lg:via-navy/40"
        />

        <div className="container-site relative z-10 grid w-full gap-14 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <Reveal direction="right" duration={600}>
              <div className="mb-7 inline-flex items-center gap-3">
                <span className="h-1 w-12 bg-accent" />
                <span className="label-caps text-muted">
                  Established {company.lineageYear}
                </span>
              </div>
            </Reveal>

            <h1 className="font-display text-4xl leading-[1.03] font-extrabold tracking-tight text-white uppercase md:text-5xl lg:text-6xl xl:text-[4.25rem]">
              {["Fasteners", "engineered"].map((word, i) => (
                <Reveal key={word} delay={i * 110} depth duration={800}>
                  <span className="block">{word}</span>
                </Reveal>
              ))}
              <Reveal delay={220} depth duration={800}>
                <span className="block text-accent">to hold.</span>
              </Reveal>
            </h1>

            <Reveal delay={360}>
              <p className="font-body mt-8 max-w-xl border-l-2 border-muted/40 pl-6 text-base leading-relaxed text-muted lg:text-lg">
                {company.tagline}. Cold forged, thread rolled, heat treated, plated and sorted
                under our own roof across four units in Mohali — so the tolerance that leaves the
                header is the tolerance that reaches your line.
              </p>
            </Reveal>

            <Reveal delay={480}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Cta href="/products">View Products</Cta>
                <GhostCta href="/quality" tone="dark">
                  Quality &amp; Certifications
                </GhostCta>
              </div>
            </Reveal>

            {/* Certification pills and the brochure link share one compact row
                so the hero still fits a 720 px laptop viewport — and the right
                half stays clear for the 3D assembly. */}
            <Reveal delay={600} className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                {certifications.map((c) => (
                  <Link
                    key={c.standard}
                    href="/quality"
                    title={`Certificate ${c.certificateNo} — ${c.system}`}
                    className="animate-sheen relative inline-flex items-center gap-2.5 overflow-hidden border border-muted/30 bg-navy-deep/70 px-4 py-2.5 backdrop-blur transition-colors hover:border-accent/60"
                  >
                    <Shield className="size-4 shrink-0 text-accent" />
                    <span className="label-caps text-[0.7rem] text-white">{c.standard}</span>
                  </Link>
                ))}
                <BrochureButton
                  variant="onDark"
                  label="Brochure"
                  className="!px-4 !py-2.5 !text-[0.7rem]"
                />
              </div>
            </Reveal>
          </div>
        </div>

      </section>

      {/* --------------------------------------------------- Value proposition */}
      <section className="bg-primary">
        <div className="container-site grid divide-y divide-white/20 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            {
              icon: <Bolt className="size-8" />,
              title: "Precision Engineering",
              body: "Every heading and rolling batch is dimensioned on calibrated micrometers, vernier calipers and ring gauges before release.",
            },
            {
              icon: <Factory className="size-8" />,
              title: "Fully In-House",
              body: `${machineryStats.total} machines across ${machineryStats.units} units cover forming, threading, heat treatment, plating and sorting.`,
            },
            {
              icon: <Shield className="size-8" />,
              title: "Certified & Tested",
              body: "ISO 9001:2015 and ISO 14001:2015 certified, with independent third-party salt spray testing on finished parts.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 120} direction="up">
              <div className="group flex items-start gap-5 p-8">
                <span className="shrink-0 text-white/70 transition-transform duration-500 group-hover:scale-110 group-hover:text-white">
                  {item.icon}
                </span>
                <div>
                  <h3 className="label-caps text-white">{item.title}</h3>
                  <p className="font-body mt-2 text-sm leading-relaxed text-white/75">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="scene bg-white py-20 md:py-28">
        <div className="container-site grid items-center gap-16 lg:grid-cols-2">
          <Reveal direction="right" className="relative">
            <Tilt max={6} lift={14} glare={false}>
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src="/img/company/team.jpg"
                  alt="The Kartikey Fasteners team at the Mohali works"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                />
              </div>
              <div className="absolute bottom-0 left-0 border-l-4 border-accent bg-primary p-6">
                <span className="font-display block text-4xl leading-none font-extrabold text-white">
                  {company.lineageYear}
                </span>
                <span className="label-caps mt-2 block text-white/80">Established</span>
              </div>
            </Tilt>
          </Reveal>

          <div>
            <Reveal>
              <SectionLabel>Who we are</SectionLabel>
              <SectionTitle>Built on a quarter century of forming steel</SectionTitle>
            </Reveal>

            <Reveal delay={120}>
              <div className="font-body mt-8 space-y-5 text-base leading-relaxed text-body">
                <p>
                  Kartikey Fasteners began in {company.foundedYear}, carrying forward the works
                  and the know-how of Girdhar Fastners Private Limited, established in{" "}
                  {company.lineageYear}. We manufacture and export high tensile industrial
                  fasteners — bolts, nuts, washers, threaded bars, stud bars and a great deal
                  more.
                </p>
                <p>
                  We are in the business of bonding and tightening, and we approach customer
                  relationships the same way: through service, quality and price. Our first
                  preference is service, delivered as a quick response.
                </p>
              </div>
            </Reveal>

            <ul className="mt-10 space-y-4 border-t border-line pt-8">
              {[
                "Header, rolling, slotting and washer assembly lines in-house",
                "Own heat treatment and barrel plating — zinc, tin, copper and nickel",
                "Mill test certificate traceability from wire coil to packed carton",
              ].map((point, i) => (
                <Reveal key={point} delay={200 + i * 90} direction="left">
                  <li className="flex items-start gap-4">
                    <Check className="mt-1 size-4 shrink-0 text-primary" />
                    <span className="font-body text-sm text-navy">{point}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={480}>
              <div className="mt-10 flex flex-wrap gap-4">
                <GhostCta href="/about" tone="light">
                  Read our story
                </GhostCta>
                <BrochureButton variant="outline" label="Brochure" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Products */}
      <section className="scene bg-tint py-20 md:py-28">
        <div className="container-site">
          <Reveal>
            <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b-2 border-line pb-8 md:flex-row md:items-end">
              <div>
                <SectionLabel>Product divisions</SectionLabel>
                <SectionTitle>What we make</SectionTitle>
                <p className="font-body mt-3 max-w-xl text-body">
                  Eleven product lines in mild steel, stainless steel and brass — formed,
                  threaded and finished to the specification you send us.
                </p>
              </div>
              <Link
                href="/products"
                className="label-caps link-underline inline-flex items-center gap-2 text-primary"
              >
                Complete catalogue <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 90} pop duration={750}>
                <Tilt max={8} lift={20}>
                  <Link
                    href={`/products#${p.slug}`}
                    className="group relative flex h-80 items-end overflow-hidden bg-white"
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-transparent transition-colors duration-500 group-hover:from-primary group-hover:via-primary/60" />
                    <div className="relative z-10 w-full p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="label-caps text-white/70">{p.code}</span>
                        <ArrowRight className="size-4 translate-x-3 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </div>
                      <h3 className="font-display text-xl leading-tight font-bold text-white transition-transform duration-500 group-hover:translate-x-1">
                        {p.name}
                      </h3>
                      <span className="label-caps mt-1 block text-[0.7rem] text-white/60">
                        {p.materials}
                      </span>
                    </div>
                  </Link>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Process */}
      <section className="dot-grid scene relative overflow-hidden py-20 md:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="animate-aurora-slow absolute top-1/3 -left-40 size-[36rem] rounded-full bg-primary/25 blur-[130px]" />
        </div>

        <div className="container-site relative">
          <Reveal>
            <div className="max-w-2xl">
              <SectionLabel tone="dark">From wire to carton</SectionLabel>
              <SectionTitle tone="dark">Seven stages, one roof</SectionTitle>
              <p className="font-body mt-4 text-muted">
                Nothing leaves the building unmeasured. Each stage carries its own
                critical-to-quality checks and its own PQC sheet.
              </p>
            </div>
          </Reveal>

          <ol className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processStages.map((s, i) => (
              <Reveal key={s.step} delay={(i % 4) * 85} pop duration={750}>
                <li className="lift-3d h-full border border-muted/25 bg-navy/70 p-7 backdrop-blur-sm">
                  <span className="font-display block text-3xl leading-none font-extrabold text-accent/60">
                    {s.step}
                  </span>
                  <h3 className="font-display mt-4 text-lg font-bold text-white">{s.title}</h3>
                  <p className="font-body mt-3 text-sm leading-relaxed text-muted">
                    {s.checks[0]}
                  </p>
                </li>
              </Reveal>
            ))}
            <Reveal delay={340} pop duration={750}>
              <li className="lift-3d flex h-full items-center border-l-4 border-accent bg-primary p-7">
                <Link
                  href="/infrastructure"
                  className="label-caps inline-flex items-center gap-2 text-white"
                >
                  See the plant <ArrowRight className="size-4" />
                </Link>
              </li>
            </Reveal>
          </ol>

          <div className="mt-16 grid gap-8 border-t border-muted/20 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: machineryStats.headers, l: "Header machines", s: undefined },
              { n: machineryStats.rolling, l: "Rolling machines", s: undefined },
              { n: machineryStats.plating, l: "Plating barrels", s: undefined },
              {
                n: machineryStats.units,
                l: "Manufacturing units",
                s: `Plot ${company.plots.join(", ")} · Phase 9, Mohali`,
              },
            ].map((stat, i) => (
              <Reveal key={stat.l} delay={i * 110}>
                <div className="border-l-2 border-accent pl-5">
                  <CountUp
                    to={stat.n}
                    className="font-display block text-4xl leading-none font-extrabold tracking-tight text-white md:text-5xl"
                  />
                  <div className="label-caps mt-3 text-accent">{stat.l}</div>
                  {stat.s ? (
                    <div className="font-body mt-1 text-xs text-muted">{stat.s}</div>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Customers */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-site">
          <Reveal>
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex items-center gap-3">
                <span className="h-1 w-10 bg-primary" />
                <span className="label-caps text-body">Trusted by</span>
                <span className="h-1 w-10 bg-primary" />
              </div>
              <SectionTitle className="mx-auto max-w-2xl">
                Our valuable customers
              </SectionTitle>
            </div>
          </Reveal>
        </div>

        {/* Full-bleed marquee, faded at both edges */}
        <Reveal>
          <CustomerMarquee speed={55} />
        </Reveal>

        <div className="container-site mt-4">
          <Reveal delay={120}>
            <CustomerMarquee speed={70} reverse fade="w-20" />
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="animate-aurora absolute -top-32 right-1/4 size-[26rem] rounded-full bg-accent/30 blur-[110px]" />
        </div>

        <div className="container-site relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <div>
              <h2 className="font-display max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl">
                Send us a drawing, a sample, or a part number.
              </h2>
              <p className="font-body mt-4 max-w-xl text-white/80">
                Tell us the size, material and finish you need. We will come back with a quote
                and a lead time.
              </p>
            </div>
          </Reveal>

          <Reveal direction="left" delay={140}>
            <div className="flex shrink-0 flex-wrap gap-4">
              <Link
                href="/contact"
                className="label-caps group inline-flex items-center gap-3 border-l-4 border-accent bg-white px-8 py-4 text-primary transition-colors hover:bg-tint"
              >
                Request a quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <BrochureButton variant="onDark" label="Brochure" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
