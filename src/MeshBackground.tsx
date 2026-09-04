import { useEffect, useRef } from "react";

/**
 * Decorative animated point-grid mesh for the hero background.
 *
 * The grid lives in a small world space (x across, z into the screen) and is drawn
 * with a pinhole projection, so rows bunch up, shrink and dim as they recede toward a
 * horizon. Every buffer is allocated once per resize — the animation loop only writes
 * into existing arrays.
 */

const MAX_DPR = 2;

// Camera. Screen y for a point at depth z is horizon + (camHeight - wave) / z.
// The camera is not fixed: horizon and camHeight are solved each resize so the highest
// crest lands just under the hero copy and the nearest trough falls off the bottom
// edge. See solveCamera().
// The grid starts well in front of the bottom edge. If the nearest row sits AT the
// bottom edge, every crest on it opens a gap underneath with no row in front to fill
// it — that is the void under the "lip".
const Z_NEAR = 1.2;
// Kept modest on purpose. A large Z_FAR crushes the distant rows into a thin band, and
// since on-screen row width scales as 1/z it also shrinks the far rows until they no
// longer span the viewport — leaving the left and right edges empty.
const Z_FAR = 4;

// Where the nearest row's CREST sits, as a fraction of hero height. Past 1, so even
// the highest point of the front row is below the bottom edge and the foreground is
// solid at every x.
const MESH_FRONT = 1.02;
// Crest height as a fraction of camera height. This ratio is what makes the surface
// read as rolling terrain rather than a rippled plane. Must stay below 1.
const AMP_K = 0.48;
// Clearance between the top of the mesh and the lowest hero element.
const CEILING_GAP = 0.02;
// Depth past which the wave is damped, on top of the natural 1/z falloff. Kept close
// to Z_FAR: damping earlier than this flattens the distance into a smooth dome and
// loses the ridges stacking into the horizon.
const Z_DAMP = 3;

/** Extra amplitude falloff with depth. 1 in the foreground, shrinking past Z_DAMP. */
const dampAt = (z: number) => Math.min(1, Z_DAMP / z);

// World half-width of the grid. Wider than the viewport at Z_NEAR (so the front row
// bleeds off both edges) and narrower at Z_FAR (so the mesh visibly converges).
// WORLD_HALF_W * FOCAL_X_RATIO / Z_FAR is the farthest row's half-width in screen
// widths. It must clear 0.5 or the most distant rows stop short of the viewport edges
// and the corners of the mesh are simply missing.
const WORLD_HALF_W = 2.6;
const FOCAL_X_RATIO = 0.95;

const DRIFT = 0.004; // lateral drift in world units — a few pixels on screen

// Peak absolute value of calculateHeight, used to size the wave against the camera.
// Must include the per-point jitter term or crests can overshoot the ceiling.
const HEIGHT_PEAK = 1.475;

type Palette = {
  /** Cyan on the left, blue through the middle, violet on the right. */
  stops: [string, string, string];
  /** Colour used for the soft glow behind ridges and highlight points. */
  glowColor: string;
  line: number;
  ridge: number;
  point: number;
  glow: number;
  star: number;
};

const DARK: Palette = {
  stops: ["#22e3ff", "#3f6ff2", "#a855f7"],
  glowColor: "#4f7dff",
  line: 0.42,
  ridge: 0.4,
  point: 0.72,
  glow: 0.7,
  star: 0.2,
};

const LIGHT: Palette = {
  stops: ["#0e9bb8", "#2b52cc", "#7c3aed"],
  glowColor: "#3f63d8",
  line: 0.36,
  ridge: 0.34,
  point: 0.62,
  glow: 0.5,
  star: 0.16,
};

/** Grid density and wave scale by viewport width. */
function densityFor(width: number) {
  if (width < 640) return { cols: 40, rows: 30, amp: 0.6 };
  if (width < 1024) return { cols: 64, rows: 42, amp: 0.8 };
  if (width < 1536) return { cols: 86, rows: 54, amp: 1 };
  return { cols: 100, rows: 60, amp: 1 };
}

/**
 * Three slow sine waves give the rolling swells, plus a small per-point term keyed to
 * that vertex's fixed random phase. The last term is what stops every point sitting
 * exactly on the ideal surface — it breaks the machine-regular look and gives each
 * point its own slight depth, without being large enough to make the swells jagged.
 */
function calculateHeight(wx: number, z: number, phase: number, t: number) {
  return (
    Math.sin(wx * 2.6 + t * 0.26) * 0.62 +
    Math.sin(z * 1.35 - t * 0.19) * 0.46 +
    Math.sin((wx * 1.5 + z) * 1.1 + t * 0.31) * 0.34 +
    Math.sin(phase + t * 0.14) * 0.055
  );
}

/**
 * Solves horizon and camera height from the one number that varies — where the hero
 * content ends — so the mesh always spans the gap beneath it. Both constraints sit on
 * the crest line y = horizon + C/z, since the crest line is what bounds the mesh at
 * both ends:
 *   horizon + C / Z_FAR  = ceiling      (farthest crest — top of the mesh)
 *   horizon + C / Z_NEAR = MESH_FRONT   (nearest crest — below the bottom edge)
 * Troughs fall further below at every depth, so the surface stays solid throughout.
 */
function solveCamera(ceiling: number) {
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

export default function MeshBackground({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkRef = useRef(dark);
  // Set up by the effect below so the theme effect can recolour without restarting.
  const applyThemeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // ── Buffers, all sized in resizeCanvas / createGrid ──────────────────────
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let ampScale = 1;
    let gradient: CanvasGradient | null = null;
    let camera = solveCamera(0.7);

    let worldX = new Float32Array(0);
    let worldZ = new Float32Array(0);
    let phases = new Float32Array(0);
    let glows = new Uint8Array(0);
    let projX = new Float32Array(0);
    let projY = new Float32Array(0);
    let projCrest = new Float32Array(0); // 0..1, how close the point is to a wave crest
    let starX = new Float32Array(0);
    let starY = new Float32Array(0);
    let starPhase = new Float32Array(0);

    function createGrid() {
      const d = densityFor(width);
      ampScale = d.amp;
      // Everything below is in world/normalised space, so a resize that does not
      // change the density tier needs no rebuild — and must not reshuffle the random
      // phases, or the mesh visibly resets on mobile URL-bar show/hide.
      if (cols === d.cols && rows === d.rows && projX.length > 0) return;
      cols = d.cols;
      rows = d.rows;

      const count = cols * rows;
      worldX = new Float32Array(cols);
      worldZ = new Float32Array(rows);
      phases = new Float32Array(count);
      glows = new Uint8Array(count);
      projX = new Float32Array(count);
      projY = new Float32Array(count);
      projCrest = new Float32Array(count);

      for (let i = 0; i < cols; i++) {
        worldX[i] = -WORLD_HALF_W + (2 * WORLD_HALF_W * i) / (cols - 1);
      }
      // Rows are spaced by a power curve in 1/z rather than in z. Screen position is
      // linear in 1/z, so this controls the on-screen gaps directly: the exponent
      // above 1 keeps gaps shrinking with distance (the perspective cue) without the
      // enormous foreground gaps that uniform steps in z produce at small z.
      const invNear = 1 / Z_NEAR;
      const invFar = 1 / Z_FAR;
      for (let j = 0; j < rows; j++) {
        const u = j / (rows - 1);
        worldZ[j] = 1 / (invFar + (invNear - invFar) * Math.pow(1 - u, 1.9));
      }
      for (let k = 0; k < count; k++) {
        phases[k] = Math.random() * Math.PI * 2;
        glows[k] = Math.random() < 0.04 ? 1 : 0;
      }

      const starCount = width < 640 ? 14 : width < 1024 ? 24 : 36;
      starX = new Float32Array(starCount);
      starY = new Float32Array(starCount);
      starPhase = new Float32Array(starCount);
      for (let s = 0; s < starCount; s++) {
        starX[s] = Math.random();
        // Normalised against the mesh ceiling so they stay in the empty upper band.
        starY[s] = Math.random() * 0.95;
        starPhase[s] = Math.random() * Math.PI * 2;
      }
    }

    function buildGradient() {
      if (width === 0) return;
      const g = ctx!.createLinearGradient(0, 0, width, 0);
      const stops = (darkRef.current ? DARK : LIGHT).stops;
      // Holding each colour flat over a stretch before handing off gives three
      // readable zones rather than one continuous blue-ish wash.
      g.addColorStop(0, stops[0]);
      g.addColorStop(0.24, stops[0]);
      g.addColorStop(0.52, stops[1]);
      g.addColorStop(0.82, stops[2]);
      g.addColorStop(1, stops[2]);
      gradient = g;
    }

    /**
     * Lowest point of the hero content, as a fraction of hero height. The hero is
     * vertically centred, so this moves with viewport size (0.66 at 1920x1080, 0.72
     * at 1280x800) — the mesh ceiling has to follow it rather than be hard-coded.
     */
    function measureCeiling(heroRect: DOMRect) {
      const content = canvas!.nextElementSibling;
      if (!content || heroRect.height === 0) return 0.7;
      let lowest = 0;
      for (const el of content.querySelectorAll("h1, p, a, button, img")) {
        const b = el.getBoundingClientRect();
        if (b.height > 0 && b.bottom > lowest) lowest = b.bottom;
      }
      if (lowest === 0) return 0.7;
      const ratio = (lowest - heroRect.top) / heroRect.height + CEILING_GAP;
      return Math.min(0.82, Math.max(0.5, ratio));
    }

    function resizeCanvas() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      camera = solveCamera(measureCeiling(rect));
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGradient();
      return true;
    }

    /** Writes the projected screen position of every grid point into projX/projY. */
    function projectPoints(t: number) {
      const cx = width / 2;
      const horizon = height * camera.horizon;
      const camA = height * camera.camA;
      const focalX = width * FOCAL_X_RATIO;
      const amp = height * camera.amp * ampScale;

      for (let j = 0; j < rows; j++) {
        const z = worldZ[j];
        const invZ = 1 / z;
        const rowAmp = amp * dampAt(z);
        const drift = Math.sin(t * 0.12 + z * 0.5) * DRIFT;
        const rowOffset = j * cols;
        for (let i = 0; i < cols; i++) {
          const k = rowOffset + i;
          const wx = worldX[i];
          const h = calculateHeight(wx, z, phases[k], t);
          projX[k] = cx + (wx + drift) * focalX * invZ;
          projY[k] = horizon + (camA - h * rowAmp) * invZ;
          // Crests read brighter, which is what gives the mesh its glowing ridges.
          projCrest[k] = h > 0 ? Math.min(1, h / (HEIGHT_PEAK * 0.8)) : 0;
        }
      }
    }

    // Falls off with distance but never to zero: the far rows carry the wavy top
    // silhouette, and fading them out entirely both hides it and makes the mesh look
    // far shorter than the camera solve intends.
    // Most of the on-screen mesh is made of the *far* rows — the near ones are largely
    // below the bottom edge — so the floor here has to stay high or the visible
    // surface is uniformly dim.
    const depthFade = (j: number) => 0.55 + 0.45 * Math.pow(1 - j / (rows - 1), 0.9);

    function drawConnections(palette: Palette) {
      ctx!.strokeStyle = gradient!;
      ctx!.lineWidth = 1;

      // Back to front, so foreground hills layer over the ones behind them.
      for (let j = rows - 1; j >= 0; j--) {
        const fade = depthFade(j);
        const alpha = palette.line * fade;
        if (alpha < 0.004) continue;
        const rowOffset = j * cols;

        // Row line, broken wherever it runs off the sides.
        ctx!.globalAlpha = alpha;
        ctx!.beginPath();
        let pen = false;
        for (let i = 0; i < cols; i++) {
          const k = rowOffset + i;
          const x = projX[k];
          if (x < -60 || x > width + 60) {
            pen = false;
            continue;
          }
          if (pen) ctx!.lineTo(x, projY[k]);
          else ctx!.moveTo(x, projY[k]);
          pen = true;
        }
        ctx!.stroke();

        // Column segments from this row to the next.
        if (j < rows - 1) {
          ctx!.beginPath();
          const nextOffset = rowOffset + cols;
          for (let i = 0; i < cols; i++) {
            const x = projX[rowOffset + i];
            const nx = projX[nextOffset + i];
            if ((x < -60 || x > width + 60) && (nx < -60 || nx > width + 60)) continue;
            ctx!.moveTo(x, projY[rowOffset + i]);
            ctx!.lineTo(nx, projY[nextOffset + i]);
          }
          ctx!.stroke();
        }

        // Ridge pass: the stretch of this row that sits on a crest, drawn bright so
        // the wave tops read as glowing lines snaking across the landscape.
        ctx!.globalAlpha = Math.min(0.75, palette.ridge * fade);
        ctx!.lineWidth = 1.1;
        ctx!.shadowBlur = fade > 0.55 ? 5 * fade : 0;
        ctx!.beginPath();
        pen = false;
        for (let i = 0; i < cols; i++) {
          const k = rowOffset + i;
          const x = projX[k];
          if (projCrest[k] < 0.6 || x < -60 || x > width + 60) {
            pen = false;
            continue;
          }
          if (pen) ctx!.lineTo(x, projY[k]);
          else ctx!.moveTo(x, projY[k]);
          pen = true;
        }
        ctx!.stroke();
        ctx!.shadowBlur = 0;
        ctx!.lineWidth = 1;
      }
    }

    function drawPoints(palette: Palette) {
      ctx!.fillStyle = gradient!;

      for (let j = rows - 1; j >= 0; j--) {
        const fade = depthFade(j);
        const alpha = palette.point * fade;
        if (alpha < 0.01) continue;
        const invZ = 1 / worldZ[j];
        const r = Math.max(0.35, 1.8 * invZ);
        const rowOffset = j * cols;

        // Two batches per row — troughs at the base alpha, crests brighter and larger.
        for (let pass = 0; pass < 2; pass++) {
          const crest = pass === 1;
          ctx!.globalAlpha = crest ? Math.min(1, alpha * 1.6) : alpha;
          const pr = crest ? r * 1.25 : r;
          ctx!.beginPath();
          for (let i = 0; i < cols; i++) {
            const k = rowOffset + i;
            if (crest !== projCrest[k] > 0.45) continue;
            const x = projX[k];
            if (x < -20 || x > width + 20) continue;
            ctx!.moveTo(x + pr, projY[k]);
            ctx!.arc(x, projY[k], pr, 0, Math.PI * 2);
          }
          ctx!.fill();
        }
      }

      // A handful of near points get a soft glow.
      ctx!.shadowColor = (darkRef.current ? DARK : LIGHT).glowColor;
      for (let j = 0; j < rows; j++) {
        const fade = depthFade(j);
        if (fade < 0.45) break;
        const invZ = 1 / worldZ[j];
        const r = Math.max(0.6, 2.4 * invZ);
        const rowOffset = j * cols;
        ctx!.globalAlpha = palette.glow * fade;
        ctx!.shadowBlur = 8 * fade;
        for (let i = 0; i < cols; i++) {
          const k = rowOffset + i;
          if (!glows[k]) continue;
          const x = projX[k];
          if (x < -20 || x > width + 20) continue;
          ctx!.beginPath();
          ctx!.arc(x, projY[k], r, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.shadowBlur = 0;
    }

    function drawStars(palette: Palette, t: number) {
      ctx!.fillStyle = gradient!;
      for (let s = 0; s < starX.length; s++) {
        const twinkle = 0.55 + 0.45 * Math.sin(starPhase[s] + t * 0.22);
        ctx!.globalAlpha = palette.star * twinkle;
        ctx!.beginPath();
        ctx!.arc(starX[s] * width, starY[s] * camera.horizon * height, 1, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function render(t: number) {
      const palette = darkRef.current ? DARK : LIGHT;
      ctx!.clearRect(0, 0, width, height);
      ctx!.shadowColor = palette.glowColor;
      projectPoints(t);
      drawStars(palette, t);
      drawConnections(palette);
      drawPoints(palette);
      ctx!.globalAlpha = 1;
    }

    // ── Loop ─────────────────────────────────────────────────────────────────
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let running = false;

    function animate(now: number) {
      // Advance by real elapsed time, clamped so a backgrounded tab cannot jump.
      elapsed += Math.min(now - last, 100) / 1000;
      last = now;
      render(elapsed);
      frame = requestAnimationFrame(animate);
    }

    function start() {
      if (running || reduceMotion.matches) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(animate);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    function boot() {
      if (!resizeCanvas()) return;
      createGrid();
      if (reduceMotion.matches) {
        stop();
        render(0);
      } else if (!running) {
        start();
      }
    }

    boot();

    applyThemeRef.current = () => {
      buildGradient();
      if (!running) render(elapsed);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    let resizeFrame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!resizeCanvas()) return;
        createGrid();
        if (reduceMotion.matches || document.hidden) render(elapsed);
      });
    });
    observer.observe(canvas);

    const onMotionChange = () => {
      stop();
      boot();
    };

    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      applyThemeRef.current = () => {};
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  // Recolour on theme flip. The running loop picks up new colours on its next frame;
  // a paused/reduced-motion canvas needs an explicit repaint.
  useEffect(() => {
    darkRef.current = dark;
    applyThemeRef.current();
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
