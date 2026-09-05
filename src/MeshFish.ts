import {
  driftAt,
  projectX,
  projectY,
  surfaceAt,
  type MeshView,
} from "./meshField";

/**
 * An occasional wireframe fish that leaps out of the hero mesh and splashes back in.
 *
 * Tuned to be rare and quiet on purpose: the hero copy is the subject, and a leaping
 * creature is the one thing on this page that can pull attention off it. The intent is
 * "wait, was that a fish?" — noticed once, then out of the way. Flip FISH_ENABLED to
 * false to remove it entirely.
 *
 * Everything here works in the isotropic world units documented in meshField.
 */

export const FISH_ENABLED = true;

/** Seconds between leaps, and before the first one. */
const FIRST_DELAY: [number, number] = [13, 21];
const GAP: [number, number] = [18, 35];

const AIRTIME: [number, number] = [1.0, 1.45];
const LAUNCH_Z: [number, number] = [1.9, 3.4];
// Nudged up alongside LAUNCH_Z so the apparent size stays put as fish move back.
const BODY_LEN = 0.15;

/**
 * Launch sites are chosen in SCREEN space, not world space. At near depths the mean
 * water line sits well below the bottom edge — only the crests are on screen — so
 * picking a world position at random puts most fish off-frame entirely. A candidate is
 * only usable if the water there renders inside this band.
 */
const LAUNCH_BAND: [number, number] = [0.84, 0.97];
const LAUNCH_TRIES = 20;
/** Apex, as a fraction of hero height. Quiet: a small hop, not a breach. */
const RISE: [number, number] = [0.085, 0.15];
/** Never use more than this share of the room between the water and the hero copy. */
const RISE_SAFETY = 0.6;
/** Keep the fish inside this share of the viewport width. */
const X_MARGIN = 0.4;

const DROPLETS = 18;
const RIPPLES = 3;
const RIPPLE_LIFE = 1.9;
const RIPPLE_SEGMENTS = 30;

const rand = ([lo, hi]: [number, number]) => lo + Math.random() * (hi - lo);

// ── Fish geometry ───────────────────────────────────────────────────────────
// Local axes: a along the body (nose positive), b up, c lateral. Built once.

type Ring = { a: number; r: number };
const RINGS: Ring[] = [
  { a: -0.5, r: 0.03 },
  { a: -0.26, r: 0.1 },
  { a: 0.0, r: 0.145 },
  { a: 0.24, r: 0.105 },
  { a: 0.46, r: 0.035 },
];
const RING_SEGMENTS = 6;

/** Flattened [a, b, c] triples. */
const VERTS: number[] = [];
const EDGES: number[] = []; // pairs of vertex indices

for (let ri = 0; ri < RINGS.length; ri++) {
  const { a, r } = RINGS[ri];
  for (let s = 0; s < RING_SEGMENTS; s++) {
    const ang = (s / RING_SEGMENTS) * Math.PI * 2;
    // Squashed laterally so the body reads as a fish rather than a tube.
    VERTS.push(a, Math.sin(ang) * r, Math.cos(ang) * r * 0.55);
  }
}
for (let ri = 0; ri < RINGS.length; ri++) {
  const base = ri * RING_SEGMENTS;
  for (let s = 0; s < RING_SEGMENTS; s++) {
    EDGES.push(base + s, base + ((s + 1) % RING_SEGMENTS));
    if (ri < RINGS.length - 1) EDGES.push(base + s, base + RING_SEGMENTS + s);
  }
}
// Forked tail, hanging off the rearmost ring.
const TAIL_ROOT = VERTS.length / 3;
VERTS.push(-0.52, 0, 0, -0.72, 0.13, 0, -0.72, -0.13, 0, -0.62, 0, 0);
EDGES.push(
  TAIL_ROOT, TAIL_ROOT + 1,
  TAIL_ROOT, TAIL_ROOT + 2,
  TAIL_ROOT + 1, TAIL_ROOT + 3,
  TAIL_ROOT + 2, TAIL_ROOT + 3
);
const VERT_COUNT = VERTS.length / 3;

// ── State ───────────────────────────────────────────────────────────────────

type Fish = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  gravity: number;
  /** Roll about the travel axis, so the fish is not always perfectly upright. */
  roll: number;
  age: number;
};

type Ripple = { x: number; z: number; age: number; strength: number };
type Droplet = { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number };

export type FishInk = {
  /** Stroke alpha for the body. */
  body: number;
  /** Stroke alpha for splash rings. */
  ripple: number;
  /** Fill alpha for droplets. */
  droplet: number;
};

export function createFishSystem() {
  let fish: Fish | null = null;
  let nextAt = rand(FIRST_DELAY);
  const ripples: Ripple[] = [];
  const droplets: Droplet[] = [];

  // Scratch buffers — reused every frame, never reallocated.
  const sx = new Float32Array(VERT_COUNT);
  const sy = new Float32Array(VERT_COUNT);
  const submerged = new Uint8Array(VERT_COUNT);

  function reset() {
    fish = null;
    ripples.length = 0;
    droplets.length = 0;
    nextAt = rand(FIRST_DELAY);
  }

  function addRipple(x: number, z: number, strength: number) {
    if (ripples.length >= RIPPLES) ripples.shift();
    ripples.push({ x, z, age: 0, strength });
  }

  function addDroplets(view: MeshView, x: number, y: number, z: number, count: number, power: number) {
    for (let i = 0; i < count; i++) {
      if (droplets.length >= DROPLETS) droplets.shift();
      const ang = Math.random() * Math.PI * 2;
      const spread = 0.04 + Math.random() * 0.09;
      droplets.push({
        x,
        y,
        z,
        vx: Math.cos(ang) * spread * power,
        vy: (0.13 + Math.random() * 0.16) * power,
        vz: Math.sin(ang) * spread * power * 0.6,
        life: 0.5 + Math.random() * 0.5,
      });
    }
    void view;
  }

  function launch(view: MeshView, t: number) {
    const bandTop = view.height * LAUNCH_BAND[0];
    const bandBottom = view.height * LAUNCH_BAND[1];

    for (let attempt = 0; attempt < LAUNCH_TRIES; attempt++) {
      const z = rand(LAUNCH_Z);
      // World x that still lands inside the viewport at this depth.
      const halfX = (X_MARGIN * view.width * z) / view.focalX;
      const x = (Math.random() * 2 - 1) * halfX;
      const surface = surfaceAt(view, x, z, t);
      const surfaceY = projectY(view, surface, z);
      if (surfaceY < bandTop || surfaceY > bandBottom) continue;

      // Rise is chosen on screen and converted back, so the hop looks the same size
      // whatever depth it happens at.
      const ceilingY = view.ceiling * view.height;
      const roomPx = (surfaceY - ceilingY) * RISE_SAFETY;
      const risePx = Math.min(view.height * rand(RISE), roomPx);
      if (risePx < view.height * 0.05) continue; // too cramped to read as a leap

      const apex = (risePx * z) / view.focalX;
      const airtime = rand(AIRTIME);
      const half = airtime / 2;
      const gravity = (2 * apex) / (half * half);
      const dir = Math.random() < 0.5 ? -1 : 1;

      fish = {
        x,
        y: surface,
        z,
        // Travels roughly 2.2 apex heights horizontally — a natural-looking arc.
        vx: (dir * (apex * 2.2)) / airtime,
        vy: gravity * half,
        vz: (Math.random() - 0.5) * 0.1,
        gravity,
        roll: (Math.random() - 0.5) * 0.7,
        age: 0,
      };
      addRipple(x, z, 0.85);
      addDroplets(view, x, surface, z, 7, 0.7);
      return;
    }
  }

  /** Advances every moving part. `dt` is clamped by the caller. */
  function update(view: MeshView, t: number, dt: number) {
    if (fish) {
      fish.age += dt;
      fish.x += fish.vx * dt;
      fish.y += fish.vy * dt;
      fish.z += fish.vz * dt;
      fish.vy -= fish.gravity * dt;

      const surface = surfaceAt(view, fish.x, fish.z, t);
      if (fish.vy < 0 && fish.y <= surface) {
        addRipple(fish.x, fish.z, 1);
        addDroplets(view, fish.x, surface, fish.z, 11, 1);
        fish = null;
      } else if (fish.age > 4) {
        fish = null; // safety net; should never fire
      }
    } else if (t >= nextAt) {
      launch(view, t);
      nextAt = t + rand(GAP);
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].age += dt;
      if (ripples[i].age > RIPPLE_LIFE) ripples.splice(i, 1);
    }
    for (let i = droplets.length - 1; i >= 0; i--) {
      const d = droplets[i];
      d.life -= dt;
      if (d.life <= 0) {
        droplets.splice(i, 1);
        continue;
      }
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.z += d.vz * dt;
      d.vy -= 1.1 * dt;
    }
  }

  function drawFish(ctx: CanvasRenderingContext2D, view: MeshView, t: number, ink: FishInk) {
    if (!fish) return;

    // Orthonormal basis from the velocity: forward, right, up. Pitch is what sells the
    // leap — nose up on the way out, nose down on the way in.
    const speed = Math.hypot(fish.vx, fish.vy, fish.vz) || 1;
    const fx = fish.vx / speed;
    const fy = fish.vy / speed;
    const fz = fish.vz / speed;
    // right = normalize(forward x worldUp)
    let rx = fz;
    let rz = -fx;
    const rl = Math.hypot(rx, rz) || 1;
    rx /= rl;
    rz /= rl;
    // up = right x forward
    let ux = -rz * fy;
    let uy = rz * fx - rx * fz;
    let uz = rx * fy;
    const ul = Math.hypot(ux, uy, uz) || 1;
    ux /= ul;
    uy /= ul;
    uz /= ul;
    // Roll tilts up/right about the travel axis.
    const cr = Math.cos(fish.roll);
    const sr = Math.sin(fish.roll);
    const uxr = ux * cr + rx * sr;
    const uyr = uy * cr;
    const uzr = uz * cr + rz * sr;
    const rxr = rx * cr - ux * sr;
    const ryr = -uy * sr;
    const rzr = rz * cr - uz * sr;

    const s = BODY_LEN;
    let anyVisible = false;
    for (let i = 0; i < VERT_COUNT; i++) {
      const a = VERTS[i * 3] * s;
      const b = VERTS[i * 3 + 1] * s;
      const c = VERTS[i * 3 + 2] * s;
      const wx = fish.x + a * fx + b * uxr + c * rxr;
      const wy = fish.y + a * fy + b * uyr + c * ryr;
      const wz = fish.z + a * fz + b * uzr + c * rzr;
      sx[i] = projectX(view, wx + driftAt(wz, t), wz);
      sy[i] = projectY(view, wy, wz);
      // Cut the body at the waterline so entry and exit read correctly.
      submerged[i] = wy < surfaceAt(view, wx, wz, t) ? 1 : 0;
      if (!submerged[i]) anyVisible = true;
    }
    if (!anyVisible) return;

    // Fade in and out at the waterline rather than popping.
    const surface = surfaceAt(view, fish.x, fish.z, t);
    const clearance = (fish.y - surface) / (BODY_LEN * 0.9);
    const alpha = ink.body * Math.max(0, Math.min(1, clearance));
    if (alpha < 0.01) return;

    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.35;
    // A little glow separates the fish from the mesh it is swimming out of; without
    // it the body reads as just another patch of grid.
    ctx.shadowBlur = 7;
    ctx.beginPath();
    for (let e = 0; e < EDGES.length; e += 2) {
      const p = EDGES[e];
      const q = EDGES[e + 1];
      if (submerged[p] || submerged[q]) continue;
      ctx.moveTo(sx[p], sy[p]);
      ctx.lineTo(sx[q], sy[q]);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
  }

  function drawRipples(ctx: CanvasRenderingContext2D, view: MeshView, t: number, ink: FishInk) {
    for (const r of ripples) {
      const k = r.age / RIPPLE_LIFE;
      // Expands quickly then eases; fades out over its life.
      const radius = 0.27 * (1 - Math.exp(-r.age * 2.4));
      const alpha = ink.ripple * r.strength * (1 - k) * (1 - k);
      if (alpha < 0.008) continue;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 0; i <= RIPPLE_SEGMENTS; i++) {
        const ang = (i / RIPPLE_SEGMENTS) * Math.PI * 2;
        const wx = r.x + Math.cos(ang) * radius;
        const wz = r.z + Math.sin(ang) * radius * 0.75;
        if (wz <= 0.2) continue;
        // Riding the real height field is what keeps the ring on the water.
        const wy = surfaceAt(view, wx, wz, t);
        const px = projectX(view, wx + driftAt(wz, t), wz);
        const py = projectY(view, wy, wz);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }

  function drawDroplets(ctx: CanvasRenderingContext2D, view: MeshView, t: number, ink: FishInk) {
    if (droplets.length === 0) return;
    ctx.beginPath();
    let drawn = 0;
    for (const d of droplets) {
      if (d.z <= 0.2) continue;
      const px = projectX(view, d.x + driftAt(d.z, t), d.z);
      const py = projectY(view, d.y, d.z);
      const r = Math.max(0.5, 1.7 / d.z);
      ctx.moveTo(px + r, py);
      ctx.arc(px, py, r, 0, Math.PI * 2);
      drawn++;
    }
    if (drawn === 0) return;
    ctx.globalAlpha = ink.droplet;
    ctx.fill();
  }

  /** Splash sits under the fish; both use the caller's stroke/fill style. */
  function draw(ctx: CanvasRenderingContext2D, view: MeshView, t: number, ink: FishInk) {
    drawRipples(ctx, view, t, ink);
    drawDroplets(ctx, view, t, ink);
    drawFish(ctx, view, t, ink);
    ctx.globalAlpha = 1;
  }

  return { update, draw, reset };
}

export type FishSystem = ReturnType<typeof createFishSystem>;
