import * as THREE from "three";

/**
 * Fastener geometry, built procedurally.
 *
 * Everything here is generated in the browser from a handful of numbers, so the
 * page ships no .glb / .obj assets at all — which matters when the host is a
 * single-core shared box and the visitor may be on mobile data.
 */

/* -------------------------------------------------------------------------- */
/*  A helix, for threads                                                       */
/* -------------------------------------------------------------------------- */

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private radius: number,
    private height: number,
    private turns: number,
    /** Multiply the radius at the far end — < 1 tapers to a point. */
    private taper = 1,
  ) {
    super();
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const angle = t * this.turns * Math.PI * 2;
    const r = this.radius * (1 + (this.taper - 1) * t);
    return target.set(
      r * Math.cos(angle),
      this.height * 0.5 - t * this.height,
      r * Math.sin(angle),
    );
  }
}

function thread(
  radius: number,
  height: number,
  turns: number,
  crest: number,
  taper = 1,
  segments = 180,
) {
  return new THREE.TubeGeometry(
    new HelixCurve(radius, height, turns, taper),
    segments,
    crest,
    7,
    false,
  );
}

/* -------------------------------------------------------------------------- */
/*  Profiles                                                                   */
/* -------------------------------------------------------------------------- */

/** Hexagon outline, across-flats = 2 * r. */
function hexShape(r: number) {
  const s = new THREE.Shape();
  const circum = r / Math.cos(Math.PI / 6);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = circum * Math.cos(a);
    const y = circum * Math.sin(a);
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

function withHole(shape: THREE.Shape, holeRadius: number) {
  const hole = new THREE.Path();
  hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

const extrude = (shape: THREE.Shape, depth: number, bevel = 0.012) =>
  new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 24,
  });

/* -------------------------------------------------------------------------- */
/*  Parts                                                                      */
/* -------------------------------------------------------------------------- */

export type Built = { group: THREE.Group; dispose: () => void };

function assemble(parts: { geo: THREE.BufferGeometry; mat: THREE.Material }[]) {
  const group = new THREE.Group();
  for (const { geo, mat } of parts) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return {
    group,
    dispose: () => parts.forEach((p) => p.geo.dispose()),
  };
}

/** Hex head bolt, part-threaded. */
export function hexBolt(steel: THREE.Material): Built {
  const headR = 0.62;
  const headH = 0.42;
  const shankR = 0.34;
  const shankL = 2.5;

  const head = extrude(hexShape(headR), headH);
  head.rotateX(Math.PI / 2);
  head.translate(0, headH / 2, 0);

  const shank = new THREE.CylinderGeometry(shankR, shankR, shankL, 40);
  shank.translate(0, -shankL / 2, 0);

  const threads = thread(shankR, shankL * 0.62, 13, 0.075);
  threads.translate(0, -shankL * 0.69, 0);

  const tip = new THREE.CylinderGeometry(shankR, shankR * 0.82, 0.16, 40);
  tip.translate(0, -shankL - 0.06, 0);

  return assemble([
    { geo: head, mat: steel },
    { geo: shank, mat: steel },
    { geo: threads, mat: steel },
    { geo: tip, mat: steel },
  ]);
}

/** Hex nut with a chamfered bore. */
export function hexNut(steel: THREE.Material): Built {
  const r = 0.6;
  const bore = 0.34;
  const h = 0.46;

  const body = extrude(withHole(hexShape(r), bore), h);
  body.rotateX(Math.PI / 2);
  body.translate(0, h / 2, 0);

  // Internal thread, sunk just inside the bore so it reads through the hole.
  const inner = thread(bore + 0.02, h * 1.05, 3.2, 0.045);
  inner.translate(0, h / 2, 0);

  return assemble([
    { geo: body, mat: steel },
    { geo: inner, mat: steel },
  ]);
}

/** Flat washer. */
export function washer(steel: THREE.Material): Built {
  const outer = new THREE.Shape();
  outer.absarc(0, 0, 0.62, 0, Math.PI * 2, false);
  const geo = extrude(withHole(outer, 0.3), 0.1, 0.008);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, 0.05, 0);
  return assemble([{ geo, mat: steel }]);
}

/** Pan head machine screw with a cross recess. */
export function panScrew(steel: THREE.Material, recess: THREE.Material): Built {
  const shankR = 0.24;
  const shankL = 2.1;

  // Dome head, swept from a profile.
  const profile: THREE.Vector2[] = [];
  const headR = 0.52;
  const headH = 0.34;
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    profile.push(new THREE.Vector2(headR * Math.cos((t * Math.PI) / 2), headH * Math.sin((t * Math.PI) / 2)));
  }
  profile.unshift(new THREE.Vector2(headR * 0.999, -0.06));
  profile.unshift(new THREE.Vector2(0, -0.06));
  const head = new THREE.LatheGeometry(profile, 44);

  const shank = new THREE.CylinderGeometry(shankR, shankR, shankL, 32);
  shank.translate(0, -shankL / 2 - 0.04, 0);

  const threads = thread(shankR, shankL * 0.94, 16, 0.06);
  threads.translate(0, -shankL / 2 - 0.04, 0);

  // Phillips recess: two crossed slots sunk into the dome.
  const slotA = new THREE.BoxGeometry(0.4, 0.1, 0.1);
  slotA.translate(0, headH - 0.03, 0);
  const slotB = slotA.clone();
  slotB.rotateY(Math.PI / 2);

  return assemble([
    { geo: head, mat: steel },
    { geo: shank, mat: steel },
    { geo: threads, mat: steel },
    { geo: slotA, mat: recess },
    { geo: slotB, mat: recess },
  ]);
}

/** Countersunk self tapping screw — tapered thread running to a point. */
export function selfTapper(steel: THREE.Material, recess: THREE.Material): Built {
  const shankR = 0.22;
  const shankL = 2.2;

  // Countersunk head.
  const head = new THREE.CylinderGeometry(0.5, shankR, 0.34, 40);
  head.translate(0, 0.17, 0);

  const cap = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 40);
  cap.translate(0, 0.36, 0);

  const shank = new THREE.CylinderGeometry(shankR, shankR * 0.15, shankL, 32);
  shank.translate(0, -shankL / 2, 0);

  const threads = thread(shankR * 1.05, shankL * 0.97, 15, 0.062, 0.18);
  threads.translate(0, -shankL / 2, 0);

  const slotA = new THREE.BoxGeometry(0.38, 0.08, 0.09);
  slotA.translate(0, 0.36, 0);
  const slotB = slotA.clone();
  slotB.rotateY(Math.PI / 2);

  return assemble([
    { geo: head, mat: steel },
    { geo: cap, mat: steel },
    { geo: shank, mat: steel },
    { geo: threads, mat: steel },
    { geo: slotA, mat: recess },
    { geo: slotB, mat: recess },
  ]);
}

/** Flange nut — hex body on a serrated skirt. */
export function flangeNut(steel: THREE.Material): Built {
  const r = 0.46;
  const bore = 0.26;
  const h = 0.4;

  const body = extrude(withHole(hexShape(r), bore), h);
  body.rotateX(Math.PI / 2);
  body.translate(0, h / 2 + 0.08, 0);

  const flangeOuter = new THREE.Shape();
  flangeOuter.absarc(0, 0, 0.72, 0, Math.PI * 2, false);
  const flange = extrude(withHole(flangeOuter, bore), 0.1, 0.01);
  flange.rotateX(Math.PI / 2);
  flange.translate(0, 0.09, 0);

  const inner = thread(bore + 0.02, h + 0.16, 3.4, 0.04);
  inner.translate(0, h / 2 + 0.06, 0);

  return assemble([
    { geo: body, mat: steel },
    { geo: flange, mat: steel },
    { geo: inner, mat: steel },
  ]);
}
