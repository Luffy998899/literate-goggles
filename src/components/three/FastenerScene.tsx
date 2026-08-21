"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  flangeNut,
  hexBolt,
  hexNut,
  panScrew,
  selfTapper,
  washer,
  type Built,
} from "./fasteners";

/* -------------------------------------------------------------------------- */
/*  Easing                                                                     */
/* -------------------------------------------------------------------------- */

/** Overshoots, then settles — the "pop". */
const easeBack = (t: number) => {
  const c = 1.70158 + 1;
  return 1 + c * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* -------------------------------------------------------------------------- */

type Floater = {
  built: Built;
  /** Resting position. */
  home: THREE.Vector3;
  spin: THREE.Vector3;
  /** Seconds to wait before popping in. */
  delay: number;
  /** Bob amplitude and phase. */
  bob: number;
  phase: number;
};

export default function FastenerScene({
  className = "",
}: {
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    /* ---------------------------------------------------------- capability -- */

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // No WebGL — the photograph behind this canvas stays the hero.
      return;
    }

    /* ------------------------------------------------------------ renderer -- */

    const width = () => host.clientWidth || 1;
    const height = () => host.clientHeight || 1;

    // A single-core host says nothing about the visitor's GPU, but capping the
    // pixel ratio keeps mid-range phones from rendering four times the pixels
    // they can actually show.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width(), height());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width() / height(), 0.1, 100);
    camera.position.set(0, 0.2, 9.2);
    camera.lookAt(0, 0, 0);

    /* --------------------------------------------------------- environment -- */

    // Metal without an environment map renders as a black hole. RoomEnvironment
    // is a procedural studio box — no HDR file to download.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 6, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x7091e6, 3.2);
    rim.position.set(-6, 1.5, -4);
    scene.add(rim);

    const fill = new THREE.PointLight(0xadbbda, 22, 26);
    fill.position.set(-3, -2.5, 4);
    scene.add(fill);

    scene.add(new THREE.AmbientLight(0x8697c4, 0.5));

    /* ----------------------------------------------------------- materials -- */

    const steel = new THREE.MeshStandardMaterial({
      color: 0xccd6ea,
      metalness: 1,
      roughness: 0.26,
      envMapIntensity: 1.15,
    });

    const bluedSteel = new THREE.MeshStandardMaterial({
      color: 0x6f8fdf,
      metalness: 1,
      roughness: 0.34,
      envMapIntensity: 1.1,
    });

    const recess = new THREE.MeshStandardMaterial({
      color: 0x1b2447,
      metalness: 0.5,
      roughness: 0.6,
    });

    const materials = [steel, bluedSteel, recess];

    /* ------------------------------------------------------------- objects -- */

    const rig = new THREE.Group();
    scene.add(rig);

    // The centrepiece: bolt, washer and nut, which thread together on scroll.
    const assembly = new THREE.Group();
    assembly.position.set(0.15, 0.1, 0);
    assembly.rotation.z = 0.14;
    rig.add(assembly);

    const bolt = hexBolt(steel);
    bolt.group.position.set(0, 0.9, 0);
    assembly.add(bolt.group);

    const wash = washer(steel);
    assembly.add(wash.group);

    const nut = hexNut(steel);
    assembly.add(nut.group);

    // Satellites drifting around the assembly.
    const floaters: Floater[] = [
      {
        built: panScrew(steel, recess),
        home: new THREE.Vector3(-1.95, 1.35, -0.6),
        spin: new THREE.Vector3(0.16, 0.34, 0.1),
        delay: 0.15,
        bob: 0.2,
        phase: 0,
      },
      {
        built: selfTapper(bluedSteel, recess),
        home: new THREE.Vector3(2.15, -1.45, -0.3),
        spin: new THREE.Vector3(-0.2, 0.28, -0.14),
        delay: 0.42,
        bob: 0.26,
        phase: 1.9,
      },
      {
        built: flangeNut(steel),
        home: new THREE.Vector3(-1.85, -1.75, 0.7),
        spin: new THREE.Vector3(0.3, 0.42, 0.2),
        delay: 0.68,
        bob: 0.22,
        phase: 3.4,
      },
      {
        built: hexNut(bluedSteel),
        home: new THREE.Vector3(1.95, 1.9, 0.4),
        spin: new THREE.Vector3(-0.26, -0.36, 0.16),
        delay: 0.92,
        bob: 0.18,
        phase: 5.1,
      },
    ];

    for (const f of floaters) {
      f.built.group.position.copy(f.home);
      f.built.group.scale.setScalar(0.0001);
      rig.add(f.built.group);
    }

    const allBuilt: Built[] = [bolt, wash, nut, ...floaters.map((f) => f.built)];

    // Responsive framing.
    //
    // The cluster has to clear the headline, which occupies the left ~55% on
    // desktop. Rather than fight it with a heavier gradient — which would just
    // hide the 3D — the whole rig is pushed right and scaled down until it sits
    // beside the text. On portrait viewports there is no room beside anything,
    // so it centres, shrinks, and drifts behind the copy.
    const frame = () => {
      const aspect = width() / height();
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      if (aspect < 0.9) {
        camera.position.z = 13;
        rig.position.set(0, 1.1, 0);
        rig.scale.setScalar(0.62);
      } else if (aspect < 1.4) {
        camera.position.z = 12;
        rig.position.set(2.9, 0.35, 0);
        rig.scale.setScalar(0.74);
      } else {
        camera.position.z = 11;
        rig.position.set(3.4, 0.35, 0);
        rig.scale.setScalar(0.9);
      }

      renderer.setSize(width(), height(), false);
    };
    frame();

    /* -------------------------------------------------------------- input -- */

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    // Listen on the window so the cluster keeps tracking even when the cursor
    // is over the headline sitting on top of the canvas.
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* ------------------------------------------------------------- scroll -- */

    let scrollProgress = 0; // 0 at rest, 1 once the hero has scrolled away
    let scrollFrame = 0;

    const readScroll = () => {
      scrollFrame = 0;
      const r = host.getBoundingClientRect();
      scrollProgress = clamp01(-r.top / Math.max(r.height, 1));
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(readScroll);
    };
    readScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* --------------------------------------------------------- visibility -- */

    // Never burn a frame on a canvas nobody is looking at.
    let onScreen = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(host);

    let tabVisible = !document.hidden;
    const onVisibility = () => {
      tabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(frame);
    ro.observe(host);

    /* ---------------------------------------------------------------- loop -- */

    const clock = new THREE.Clock();
    let raf = 0;
    let elapsed = 0;

    const render = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      // Pointer parallax, eased so it glides rather than snaps.
      pointer.x = lerp(pointer.x, target.x, 1 - Math.pow(0.002, dt));
      pointer.y = lerp(pointer.y, target.y, 1 - Math.pow(0.002, dt));

      rig.rotation.y = pointer.x * 0.34;
      rig.rotation.x = pointer.y * 0.2;

      // --- the assembly: nut and washer thread onto the bolt as you scroll ---
      const assemble = easeOutCubic(clamp01(scrollProgress * 1.35));

      // Bolt tumbles gently, then steadies as the parts arrive.
      bolt.group.rotation.y = elapsed * 0.42;
      bolt.group.rotation.z = Math.sin(elapsed * 0.5) * 0.06 * (1 - assemble);
      bolt.group.position.y = 0.9 + Math.sin(elapsed * 0.8) * 0.09 * (1 - assemble);

      // Washer rises up the shank.
      wash.group.position.y = lerp(-2.6, -0.55, assemble);
      wash.group.position.x = lerp(-1.5, 0, assemble);
      wash.group.rotation.y = elapsed * 0.6;
      wash.group.rotation.x = lerp(0.7, 0, assemble);

      // Nut climbs and spins on, as it would on a real thread.
      nut.group.position.y = lerp(-3.4, -1.05, assemble);
      nut.group.position.x = lerp(1.6, 0, assemble);
      nut.group.rotation.y = elapsed * 0.5 + assemble * Math.PI * 6;
      nut.group.rotation.x = lerp(-0.6, 0, assemble);

      // The whole assembly drifts back and dims as the hero leaves.
      const exit = clamp01((scrollProgress - 0.55) / 0.45);
      assembly.position.z = -exit * 5;
      assembly.scale.setScalar(1 - exit * 0.35);

      // --- satellites: pop in on load, drift, pop out on the way past -------
      for (const f of floaters) {
        const t = clamp01((elapsed - f.delay) / 0.85);
        const popped = t <= 0 ? 0 : easeBack(t);

        const g = f.built.group;
        const out = clamp01((scrollProgress - 0.35) / 0.5);
        const scale = Math.max(popped * (1 - out), 0.0001);
        g.scale.setScalar(scale);

        g.position.set(
          f.home.x + Math.sin(elapsed * 0.4 + f.phase) * 0.18 + out * f.home.x * 0.8,
          f.home.y + Math.sin(elapsed * 0.75 + f.phase) * f.bob - out * 1.4,
          f.home.z - out * 3,
        );

        g.rotation.x += f.spin.x * dt;
        g.rotation.y += f.spin.y * dt;
        g.rotation.z += f.spin.z * dt;
      }

      renderer.render(scene, camera);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen || !tabVisible) {
        clock.getDelta(); // drop the gap so nothing lurches on resume
        return;
      }
      render();
    };

    if (reduced) {
      // One frame, fully assembled, no loop. `elapsed` past every pop delay is
      // what puts the satellites at full scale.
      elapsed = 6;
      scrollProgress = 0.75;
      render();
    } else {
      clock.start();
      raf = requestAnimationFrame(tick);
    }

    /* ------------------------------------------------------------ teardown -- */

    return () => {
      cancelAnimationFrame(raf);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();

      allBuilt.forEach((b) => b.dispose());
      materials.forEach((m) => m.dispose());
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden />;
}
