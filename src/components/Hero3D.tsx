"use client";

import dynamic from "next/dynamic";

/**
 * three.js is ~150 kB gzipped, which has no business in the initial bundle for
 * a page that must stay readable without it. Loading it here, client-side only,
 * keeps it in its own chunk that arrives after the hero has already painted.
 *
 * The canvas is transparent and purely decorative: if WebGL is unavailable, or
 * the chunk never loads, the photograph underneath is the hero and nothing is
 * lost but the flourish.
 */
const FastenerScene = dynamic(() => import("./three/FastenerScene"), {
  ssr: false,
});

export default function Hero3D({ className = "" }: { className?: string }) {
  return <FastenerScene className={className} />;
}
