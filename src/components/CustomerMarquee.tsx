import { Marquee } from "./motion";
import { customers } from "@/lib/company";

/**
 * A continuously scrolling row of customer names, faded at both edges.
 * Used on the homepage (twice, in opposing directions) and the about page.
 */
export default function CustomerMarquee({
  speed,
  reverse = false,
  /** Width of the edge fade, in Tailwind spacing units. */
  fade = "w-24",
}: {
  speed: number;
  reverse?: boolean;
  fade?: string;
}) {
  const names = reverse ? [...customers].reverse() : customers;

  return (
    <div className="relative">
      <Marquee speed={speed}>
        {names.map((name) => (
          <span
            key={name}
            className="label-caps border-r border-line px-10 py-6 whitespace-nowrap text-body transition-colors hover:text-primary"
          >
            {name}
          </span>
        ))}
      </Marquee>
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 ${fade} bg-gradient-to-r from-white to-transparent`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 ${fade} bg-gradient-to-l from-white to-transparent`}
      />
    </div>
  );
}
