import type { Metadata } from "next";
import Image from "next/image";
import BrochureButton from "@/components/BrochureButton";
import CustomerMarquee from "@/components/CustomerMarquee";
import PageHero from "@/components/PageHero";
import { CountUp, Reveal, Tilt } from "@/components/motion";
import { Cta, GhostCard, SectionLabel, SectionTitle } from "@/components/ui";
import { company, machineryStats, products } from "@/lib/company";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kartikey Fasteners started in 2018 on the foundation of Girdhar Fastners Private Limited, established 1999. Manufacturers and exporters of high tensile industrial fasteners from Mohali, Punjab.",
};

const qmsPrinciples = [
  "Customer focus",
  "Leadership",
  "Engagement of people",
  "Process approach",
  "Improvement",
  "Evidence-based decision making",
  "Relationship management",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`Established ${company.lineageYear}`}
        title={
          <>
            We forge fasteners.
            <br />
            <span className="text-accent">And relationships.</span>
          </>
        }
        lede="Kartikey Fasteners started in 2018 carrying the background of Girdhar Fastners Private Limited, established in 1999. We are manufacturers and exporters of high tensile industrial fasteners — bolts, nuts, washers, threaded bars, stud bars and many more."
        image="/img/company/team-group.jpg"
      >
        <BrochureButton variant="onDark" label="Company profile" />
      </PageHero>

      {/* --------------------------------------------------------- Introduction */}
      <section className="scene bg-white py-20 md:py-28">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel>Introduction</SectionLabel>
              <SectionTitle>
                We understand, innovate and manufacture fasteners like no one else in the
                industry
              </SectionTitle>
            </Reveal>

            <Reveal delay={120}>
              <div className="font-body mt-8 space-y-5 text-base leading-relaxed text-body">
                <p>
                  We guarantee consistent product quality, quick turnaround time and competitive
                  pricing. By aligning with us you gain more than the perfect fit between a
                  fastener and its mate — you get a long term partner, a like-minded company that
                  works to improve your business.
                </p>
                <p>
                  Today that means {machineryStats.total} machines across{" "}
                  {machineryStats.units} units in Phase 9, Mohali, {products.length} product lines
                  in mild steel, stainless steel and brass, and a quality system certified to ISO
                  9001:2015 and ISO 14001:2015.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
              {[
                {
                  n: company.lineageYear,
                  l: "Lineage begins",
                  s: "Girdhar Fastners Pvt. Ltd.",
                },
                {
                  n: company.foundedYear,
                  l: "Kartikey Fasteners",
                  s: "Founded on that background",
                },
                { n: products.length, l: "Product lines", s: "MS · SS · Brass" },
              ].map((stat, i) => (
                <Reveal key={stat.l} delay={i * 110}>
                  <div className="border-l-2 border-primary pl-5">
                    <CountUp
                      to={stat.n}
                      duration={i === 2 ? 900 : 1600}
                      className="font-display block text-4xl leading-none font-extrabold tracking-tight text-navy md:text-5xl"
                    />
                    <div className="label-caps mt-3 text-primary">{stat.l}</div>
                    <div className="font-body mt-1 text-xs text-body">{stat.s}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal direction="left" delay={200} className="lg:col-span-5">
            <Tilt max={7} lift={20} glare={false}>
              <div className="relative aspect-3/4 w-full overflow-hidden shadow-hard">
                <Image
                  src="/img/company/team.jpg"
                  alt="The Kartikey Fasteners team outside the Mohali works"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Tilt>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Philosophy */}
      <section className="dot-grid scene relative overflow-hidden py-20 md:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="animate-aurora absolute -top-32 right-0 size-[32rem] rounded-full bg-primary/25 blur-[130px]" />
        </div>

        <div className="container-site relative">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <SectionLabel tone="dark">Our philosophy</SectionLabel>
              <SectionTitle tone="dark">
                Our product is used to bond and tighten. So is our approach to customers.
              </SectionTitle>
            </div>
          </Reveal>

          <div className="grid gap-3 md:grid-cols-2">
            <Reveal direction="right" depth duration={800}>
              <div className="lift-3d h-full border border-muted/25 bg-navy/80 p-10 backdrop-blur-sm">
                <span className="label-caps text-accent">Bonding</span>
                <p className="font-body mt-6 text-base leading-relaxed text-muted">
                At KF we do not only forge fasteners — we forge a long term relationship with the
                customer by understanding their needs, improving their product value and reducing
                their cost. We are in the business where our product is used to bond or tighten, so
                  with the same philosophy we want our customer to bond with us through service,
                  quality and price, and to tighten that relationship with mutual understanding.
                </p>
              </div>
            </Reveal>
            <Reveal direction="left" delay={140} depth duration={800}>
              <div className="lift-3d h-full border border-muted/25 bg-navy/80 p-10 backdrop-blur-sm">
                <span className="label-caps text-accent">Quick response</span>
                <p className="font-body mt-6 text-base leading-relaxed text-muted">
                At KF our first preference is the service provided to the customer, in the form of a
                quick response. With satisfied customers all over, we have perfected ourselves as a
                company that builds its success on constant modernisation and is motivated by
                constant customer satisfaction. We openly welcome suggestions from our valued
                  clients — they are what has strengthened our foothold in this competitive
                  market.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Aim */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="animate-aurora-slow absolute -bottom-40 left-1/3 size-[30rem] rounded-full bg-accent/30 blur-[120px]" />
        </div>

        <div className="container-site relative max-w-4xl text-center">
          <Reveal>
            <span className="label-caps text-white/70">Our aim</span>
            <h2 className="font-display mt-6 text-3xl leading-tight font-extrabold tracking-tight text-white uppercase md:text-5xl">
              Quality &amp; customer satisfaction
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="font-body mt-8 text-lg leading-relaxed text-white/85">
              Quality is the strength we are proud of. It is the oil that lubricates the path of
              the sales graph — a product is sure to reach the height of that graph provided its
              quality is superior and advanced.
            </p>
            <p className="font-body mt-5 text-lg leading-relaxed text-white/85">
              We are committed to achieving customer satisfaction by supplying international
              quality products that meet all requirements, and to continually improving business
              effectiveness through the optimisation of process.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- Vision & quality policy */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionLabel>Vision</SectionLabel>
              <SectionTitle>Where we are going</SectionTitle>
            </Reveal>
            <ul className="mt-8 space-y-5">
              {[
                "To be the largest and most respected private company with a global footprint.",
                "To widely expand the supply of our nuts, bolts and washers.",
                "To introduce more and more products.",
                "Through streamlined processes and experienced staff, to continue aggressive yet sustainable growth.",
              ].map((v, i) => (
                <Reveal key={v} delay={i * 90} direction="right">
                  <li className="border-l-2 border-primary pl-5">
                    <p className="font-body text-base leading-relaxed text-body">{v}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal direction="left" delay={140}>
            <SectionLabel>Quality policy</SectionLabel>
            <SectionTitle>What we hold ourselves to</SectionTitle>
            <div className="font-body mt-8 space-y-5 text-base leading-relaxed text-body">
              <p>
                The shared goal and responsibility of each KF employee is to understand our customer
                needs and satisfaction through continuous improvement of our process and
                performance — to give them a cost-effective, quality product and service of
                international standard.
              </p>
              <p>
                Our employees are our backbone. We believe that if our people grow, health-wise and
                wealth-wise, the company grows with them. At KF we train our employees through
                periodic training and provide them with the latest technology to achieve better
                quality and production, and to minimise production cost.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- QMS ring */}
      <section className="scene bg-tint py-20 md:py-24">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2">
          {/* The source diagram is drawn on black, so it is framed on a navy
              plate rather than floated on the light band. */}
          <Reveal direction="right">
            <Tilt max={10} lift={22} glare={false}>
              <div className="animate-float-slow relative aspect-square w-full max-w-md bg-navy p-6">
                <Image
                  src="/img/quality/qms-principles.png"
                  alt="The seven quality management principles"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-contain p-6"
                />
              </div>
            </Tilt>
          </Reveal>

          <div>
            <Reveal delay={120}>
              <SectionLabel>Quality management system</SectionLabel>
              <SectionTitle>Seven principles, applied daily</SectionTitle>
            </Reveal>
            <ul className="mt-8 grid gap-px bg-line sm:grid-cols-2">
              {qmsPrinciples.map((p, i) => (
                <Reveal key={p} delay={200 + i * 70} className="last:sm:col-span-2">
                  <li className="flex h-full items-baseline gap-4 bg-tint px-5 py-4 transition-colors hover:bg-white">
                    <span className="label-caps text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-sm text-navy">{p}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Customers */}
      <section className="scene bg-white py-20 md:py-28">
        <div className="container-site">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <SectionLabel>Our valuable customers</SectionLabel>
              <SectionTitle>Who we supply</SectionTitle>
              <p className="font-body mt-4 text-body">
                Appliance, electrical, power backup and electronics manufacturers who need a
                fastener to be the same part on the ten-thousandth piece as it was on the first.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <CustomerMarquee speed={58} />
        </Reveal>

        <div className="container-site">
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Consistent quality",
                b: "Guaranteed batch to batch, with CTQ checks recorded at heading, rolling and after plating.",
              },
              {
                t: "Quick turnaround",
                b: "Forming, finishing and sorting under one roof means fewer handoffs and shorter lead times.",
              },
              {
                t: "Competitive pricing",
                b: "Cost reduction is treated as part of the engineering brief, not an afterthought.",
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
      <section className="dot-grid py-16 md:py-20">
        <div className="container-site flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal>
            <h2 className="font-display max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl">
              Let&apos;s tighten the relationship.
            </h2>
            <p className="font-body mt-4 max-w-xl text-muted">
              Tell us what you need to fasten and we will tell you how we would make it.
            </p>
          </Reveal>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Cta href="/contact">Talk to us</Cta>
            <BrochureButton variant="onDark" label="Brochure" />
          </div>
        </div>
      </section>
    </>
  );
}
