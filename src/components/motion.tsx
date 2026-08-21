"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Shared viewport ticker                                                     */
/* -------------------------------------------------------------------------- */

/*
  One rAF-throttled scroll/resize listener for the whole page, rather than an
  IntersectionObserver per element.

  IntersectionObserver is the more efficient tool, but it can go silent — an
  occluded or backgrounded tab may never deliver a callback, and an element that
  never reveals is an element the reader never sees. Measuring rects against a
  single shared listener is a few tenths of a millisecond per frame for the ~45
  reveals on this page, and it is deterministic everywhere.
*/

type Watcher = () => void;

const watchers = new Set<Watcher>();
let queued = false;
let listening = false;

function pump() {
  if (!queued) return; // whichever of rAF / timer arrives first wins
  queued = false;
  for (const w of watchers) w();
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(pump);
  // requestAnimationFrame does not fire while a tab is not compositing — a
  // backgrounded or occluded window — but timers still do. Without this the
  // very first measurement can be lost and the page never reveals at all.
  setTimeout(pump, 64);
}

function watch(fn: Watcher) {
  if (!listening && typeof window !== "undefined") {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // A late web font or image can reflow the page under an element that has
    // already been measured.
    window.addEventListener("load", schedule);
  }
  watchers.add(fn);
  schedule();
  return () => {
    watchers.delete(fn);
  };
}

/** Fraction of the viewport an element must rise above before it reveals. */
const ENTER_AT = 0.88;

function useInView<T extends HTMLElement>(
  /** Keep watching and un-reveal on exit, instead of settling once. */
  repeat = false,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let settled = false;

    const unwatch = watch(() => {
      if (settled) return;

      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = r.top < vh * ENTER_AT && r.bottom > 0;

      if (visible) {
        setInView(true);
        if (!repeat) {
          settled = true;
          // Stop measuring something that will never change again.
          queueMicrotask(unwatch);
        }
      } else if (repeat) {
        setInView(false);
      }
    });

    return unwatch;
  }, [repeat]);

  return { ref, inView };
}

/* --- prefers-reduced-motion, as an external store ------------------------- */

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getMotionSnapshot = () => window.matchMedia(MOTION_QUERY).matches;

// On the server we cannot know, and the markup must match what the client
// renders first — so assume motion is allowed and let the CSS media query in
// globals.css cover the gap until hydration.
const getMotionServerSnapshot = () => false;

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot,
  );
}

/* -------------------------------------------------------------------------- */
/*  Reveal — fade + travel in as the element enters the viewport               */
/* -------------------------------------------------------------------------- */

type Direction = "up" | "left" | "right";

const OFFSET: Record<Direction, string> = {
  up: "translate3d(0, 2.5rem, 0)",
  left: "translate3d(2.5rem, 0, 0)",
  right: "translate3d(-2.5rem, 0, 0)",
};

export function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 700,
  /** Adds a slight rotate-in on the X axis for a card-flipping-up feel. */
  depth = false,
  /**
   * Scale up from small with an overshoot, and shrink away again on exit.
   * Reserved for decorative blocks — never for a paragraph somebody is reading.
   */
  pop = false,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  depth?: boolean;
  pop?: boolean;
}) {
  // `pop` keeps watching so the element can leave as well as arrive.
  const { ref, inView } = useInView<HTMLDivElement>(pop);

  const from = pop
    ? `perspective(1100px) rotateX(14deg) scale(0.82) ${OFFSET[direction]}`
    : depth
      ? `perspective(1200px) rotateX(8deg) ${OFFSET[direction]}`
      : OFFSET[direction];

  // Only the tuning knobs are inline; the hidden state itself is a CSS rule, so
  // reduced-motion and <noscript> can override it. See globals.css.
  const vars = {
    "--rv-from": from,
    "--rv-delay": `${delay}ms`,
    "--rv-dur": `${duration}ms`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`reveal ${pop ? "rv-pop" : ""} ${inView ? "rv-in" : ""} ${className}`}
      style={vars}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tilt — pointer-tracked 3D rotation                                         */
/* -------------------------------------------------------------------------- */

export function Tilt({
  children,
  className = "",
  /** Maximum rotation in degrees. */
  max = 9,
  /** How far the content lifts toward the viewer on hover, in px. */
  lift = 18,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [style, setStyle] = useState<CSSProperties>({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, on: false });

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0 → 1
      const py = (e.clientY - r.top) / r.height;

      setStyle({
        transform: `perspective(1000px) rotateY(${(px - 0.5) * max * 2}deg) rotateX(${
          (0.5 - py) * max * 2
        }deg) translateZ(${lift}px)`,
        transition: "transform 120ms ease-out",
      });
      setGlarePos({ x: px * 100, y: py * 100, on: true });
    },
    [max, lift, reduced],
  );

  const onLeave = useCallback(() => {
    setStyle({
      transform: "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)",
      transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
    });
    setGlarePos((p) => ({ ...p, on: false }));
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={style}
    >
      {children}
      {glare && !reduced ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: glarePos.on ? 1 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18), transparent 55%)`,
          }}
        />
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Parallax — translate on scroll                                             */
/* -------------------------------------------------------------------------- */

export function Parallax({
  children,
  className = "",
  /** Positive drifts down as you scroll, negative drifts up. */
  speed = -0.12,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      // Distance of the element's centre from the viewport centre.
      const delta = r.top + r.height / 2 - window.innerHeight / 2;
      setOffset(delta * speed);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed, reduced]);

  return (
    <div
      ref={ref}
      className={className}
      style={reduced ? undefined : { transform: `translate3d(0, ${offset}px, 0)` }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CountUp — animate a number once it scrolls into view                       */
/* -------------------------------------------------------------------------- */

export function CountUp({
  to,
  duration = 1400,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // A zero-length run lands on the final value on the very first frame, which
    // is exactly what reduced-motion wants — and keeps the update inside the
    // animation callback rather than the effect body.
    const span = reduced ? 0 : duration;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = span === 0 ? 1 : Math.min((now - start) / span, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Marquee — continuous horizontal scroll, pauses on hover                    */
/* -------------------------------------------------------------------------- */

export function Marquee({
  children,
  className = "",
  speed = 45,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds for one full pass. */
  speed?: number;
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
