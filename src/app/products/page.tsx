import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BrochureButton from "@/components/BrochureButton";
import PageHero from "@/components/PageHero";
import { Reveal, Tilt } from "@/components/motion";
import { ArrowRight, Cta, GhostCard, SectionLabel, SectionTitle } from "@/components/ui";
import { products } from "@/lib/company";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Self tapping screws, machine screws, hex bolts, foot bolts, studs, brass screws, earthing screws, pop rivets, cage nuts, hinges, nylock and flange nuts, and star washers in MS, SS and brass.",
};

const finishes = [
  { name: "Zinc", note: "Plain and RoHS dip, blue / yellow passivation" },
  { name: "Tin", note: "Barrel plated for solderability" },
  { name: "Copper", note: "Barrel plated undercoat and finish" },
  { name: "Nickel", note: "Dedicated nickel barrel line" },
  { name: "Self colour", note: "Supplied plain where specified" },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title={
          <>
            Eleven lines.
            <br />
            <span className="text-accent">One standard.</span>
          </>
        }
        lede="From a 2 mm self tapping screw to a foot bolt cold forged on a 1000 kg former — formed, threaded and finished to the specification you send us, in mild steel, stainless steel and brass."
        image="/img/product/range.jpg"
      >
        <BrochureButton variant="onDark" label="Full catalogue PDF" />
      </PageHero>

      {/* ---------------------------------------------------------- Index grid */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line pb-6">
            <span className="label-caps text-body">Jump to</span>
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`#${p.slug}`}
                className="font-body text-sm text-body underline decoration-line underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                {p.name}
              </Link>
            ))}
          </div>

          {/* ------------------------------------------------------- Product rows */}
          <div className="scene divide-y divide-line">
            {products.map((p, i) => (
              <article
                key={p.slug}
                id={p.slug}
                className="grid scroll-mt-28 items-center gap-10 py-14 lg:grid-cols-12"
              >
                <Reveal
                  direction={i % 2 === 1 ? "left" : "right"}
                  className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}
                >
                  <Tilt max={7} lift={16} glare={false}>
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-tint">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                      />
                    </div>
                  </Tilt>
                </Reveal>

                <Reveal
                  delay={120}
                  className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : ""}`}
                >
                  <span className="label-caps text-primary">{p.code}</span>
                  <h2 className="font-display mt-3 text-2xl leading-tight font-bold tracking-tight text-navy md:text-4xl">
                    {p.name}
                  </h2>
                  <p className="font-body mt-5 max-w-xl text-base leading-relaxed text-body">
                    {p.blurb}
                  </p>

                  <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-6">
                    <div>
                      <dt className="label-caps text-body/70">Material</dt>
                      <dd className="font-display mt-1 text-sm font-bold text-navy">
                        {p.materials}
                      </dd>
                    </div>
                    <div>
                      <dt className="label-caps text-body/70">Finish</dt>
                      <dd className="font-display mt-1 text-sm font-bold text-navy">
                        Zinc · Tin · Copper · Nickel
                      </dd>
                    </div>
                    <div>
                      <dt className="label-caps text-body/70">Sizes</dt>
                      <dd className="font-display mt-1 text-sm font-bold text-navy">
                        Made to order
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href="/contact"
                    className="label-caps link-underline mt-8 inline-flex items-center gap-2 text-primary"
                  >
                    Enquire about {p.name.split(",")[0]} <ArrowRight className="size-4" />
                  </Link>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Materials */}
      <section className="bg-tint py-20 md:py-24">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <div>
            <SectionLabel>Raw material</SectionLabel>
            <SectionTitle>MS and SS wire, in every size we run</SectionTitle>
            <p className="font-body mt-6 max-w-xl text-base leading-relaxed text-body">
              Wire arrives from vetted vendors with a mill test certificate on every invoice —
              chemical composition and mechanical properties stated in full. We verify the wire
              diameter on a vernier caliper before it reaches a header, and send wire pieces out for
              independent third-party testing with an MTC report.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="relative aspect-4/3">
                <Image
                  src="/img/process/raw-wire-coils.jpg"
                  alt="MS and SS wire coils in stock"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3">
                <Image
                  src="/img/process/mtc-report.jpg"
                  alt="Mill test certificate received with a wire consignment"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Finishes</SectionLabel>
            <SectionTitle>Plated in our own barrels</SectionTitle>
            <p className="font-body mt-6 text-base leading-relaxed text-body">
              Plating is done in-house at Plot 299, so finish is scheduled with the rest of the job
              rather than subcontracted around it.
            </p>

            <div className="mt-10 space-y-4">
              {finishes.map((f, i) => (
                <Reveal key={f.name} delay={i * 90} direction="left">
                  <GhostCard className="lift-3d bg-white">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="font-display text-lg font-bold text-navy">{f.name}</span>
                      <span className="font-body text-sm text-body">{f.note}</span>
                    </div>
                  </GhostCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="dot-grid py-16 md:py-20">
        <div className="container-site flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl">
              Need a size that is not on this page?
            </h2>
            <p className="font-body mt-4 max-w-xl text-muted">
              Most of what we ship is made to order. Send the drawing or the sample and we will
              quote it.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Cta href="/contact">Request a quote</Cta>
            <BrochureButton variant="onDark" label="Brochure" />
          </div>
        </div>
      </section>
    </>
  );
}
