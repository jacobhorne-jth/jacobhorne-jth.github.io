/**
 * The world and camera model shared by the hero mesh and anything that has to sit in
 * it (see MeshFish). Rendering lives in MeshBackground; this module is only geometry.
 *
 * Two unit systems meet here, so the helpers below are the place to keep them straight:
 *  - `wx` and `z` are world units. Screen x is `cx + wx * focalX / z`.
 *  - Screen y is `horizon + (camA - wyPx) / z`, where wyPx is already in pixels.
 * Mixing those makes a circle project as an ellipse, so everything public here works in
 * ISOTROPIC world units ("U"): heights are divided by focalX so one U across equals one
 * U up. Only `MeshView` holds the raw pixel values.
 */

// The grid starts well in front of the bottom edge. If the nearest row sits AT the
// bottom edge, every crest on it opens a gap underneath with no row in front to fill
// it — that is the void under the "lip".
export const Z_NEAR = 1.2;
// Kept modest on purpose. A large Z_FAR crushes the distant rows into a thin band, and
// since on-screen row width scales as 1/z it also shrinks the far rows until they no
// longer span the viewport — leaving the left and right edges empty.
export const Z_FAR = 4;

// Where the nearest row's CREST sits, as a fraction of hero height. Past 1, so even
// the highest point of the front row is below the bottom edge and the foreground is
// solid at every x.
export const MESH_FRONT = 1.02;
// Crest height as a fraction of camera height. This ratio is what makes the surface
// read as rolling terrain rather than a rippled plane. Must stay below 1.
export const AMP_K = 0.48;
// Clearance between the top of the mesh and the lowest hero element.
export const CEILING_GAP = 0.02;
// Depth past which the wave is damped, on top of the natural 1/z falloff. Kept close
// to Z_FAR: damping earlier than this flattens the distance into a smooth dome and
// loses the ridges stacking into the horizon.
export const Z_DAMP = 3;

// World half-width of the grid. Wider than the viewport at Z_NEAR (so the front row
// bleeds off both edges) and narrower at Z_FAR (so the mesh visibly converges).
// WORLD_HALF_W * FOCAL_X_RATIO / Z_FAR is the farthest row's half-width in screen
// widths. It must clear 0.5 or the most distant rows stop short of the viewport edges
// and the corners of the mesh are simply missing.
export const WORLD_HALF_W = 2.6;
export const FOCAL_X_RATIO = 0.95;

export const DRIFT = 0.004; // lateral drift in world units — a few pixels on screen

// Peak absolute value of calculateHeight, used to size the wave against the camera.
// Must include the per-point jitter term or crests can overshoot the ceiling.
export const HEIGHT_PEAK = 1.475;

/** Extra amplitude falloff with depth. 1 in the foreground, shrinking past Z_DAMP. */
export const dampAt = (z: number) => Math.min(1, Z_DAMP / z);

/** Lateral drift of the whole surface at a given depth. */
export const driftAt = (z: number, t: number) => Math.sin(t * 0.12 + z * 0.5) * DRIFT;

/**
 * Three slow sine waves give the rolling swells, plus a small per-point term keyed to
 * that vertex's fixed random phase. The last term is what stops every point sitting
 * exactly on the ideal surface — it breaks the machine-regular look and gives each
 * point its own slight depth, without being large enough to make the swells jagged.
 */
export function calculateHeight(wx: number, z: number, phase: number, t: number) {
  return (
    Math.sin(wx * 2.6 + t * 0.26) * 0.62 +
    Math.sin(z * 1.35 - t * 0.19) * 0.46 +
    Math.sin((wx * 1.5 + z) * 1.1 + t * 0.31) * 0.34 +
    Math.sin(phase + t * 0.14) * 0.055
  );
}

export type Camera = { horizon: number; camA: number; amp: number };

/**
 * Solves horizon and camera height from the one number that varies — where the hero
 * content ends — so the mesh always spans the gap beneath it. Both constraints sit on
 * the crest line y = horizon + C/z, since the crest line is what bounds the mesh at
 * both ends:
 *   horizon + C / Z_FAR  = ceiling      (farthest crest — top of the mesh)
 *   horizon + C / Z_NEAR = MESH_FRONT   (nearest crest — below the bottom edge)
 * Troughs fall further below at every depth, so the surface stays solid throughout.
 */
export function solveCamera(ceiling: number): Camera {
  const dNear = dampAt(Z_NEAR);
  const dFar = dampAt(Z_FAR);
  const camA =
    (MESH_FRONT - ceiling) /
    (1 / Z_NEAR - 1 / Z_FAR - AMP_K * (dNear / Z_NEAR - dFar / Z_FAR));
  return {
    horizon: MESH_FRONT - (camA - AMP_K * camA * dNear) / Z_NEAR,
    camA,
    amp: (AMP_K * camA) / HEIGHT_PEAK,
  };
}

/** Everything needed to project, in pixels. Rebuilt on resize, mutated in place. */
export type MeshView = {
  width: number;
  height: number;
  cx: number;
  horizon: number;
  camA: number;
  amp: number;
  focalX: number;
  /** Lowest hero element, as a fraction of hero height. */
  ceiling: number;
};

export function makeView(): MeshView {
  return { width: 0, height: 0, cx: 0, horizon: 0, camA: 0, amp: 0, focalX: 0, ceiling: 0.7 };
}

export function updateView(
  view: MeshView,
  width: number,
  height: number,
  camera: Camera,
  ampScale: number,
  ceiling: number
) {
  view.width = width;
  view.height = height;
  view.cx = width / 2;
  view.horizon = height * camera.horizon;
  view.camA = height * camera.camA;
  view.amp = height * camera.amp * ampScale;
  view.focalX = width * FOCAL_X_RATIO;
  view.ceiling = ceiling;
}

export const projectX = (view: MeshView, wx: number, z: number) =>
  view.cx + (wx * view.focalX) / z;

/** `wyU` is in isotropic world units; the focalX factor converts it to pixels. */
export const projectY = (view: MeshView, wyU: number, z: number) =>
  view.horizon + (view.camA - wyU * view.focalX) / z;

/**
 * Height of the water at a continuous position, in isotropic world units. Uses phase 0
 * — the per-vertex jitter belongs to the grid points, not to the underlying surface.
 */
export const surfaceAt = (view: MeshView, wx: number, z: number, t: number) =>
  (calculateHeight(wx, z, 0, t) * view.amp * dampAt(z)) / view.focalX;

/**
 * Highest a point at depth z may rise while still rendering below the hero content.
 * The ceiling moves with viewport size, so anything that leaves the water has to
 * clamp against this rather than a fixed number.
 */
export const ceilingAt = (view: MeshView, z: number) =>
  (view.camA - (view.ceiling * view.height - view.horizon) * z) / view.focalX;
