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

// Camera. Screen y for a flat point at depth z is HORIZON_RATIO*H + NEAR_DROP*H / z,
// so Z_NEAR lands just below the bottom edge and Z_FAR sits close to the horizon.
const HORIZON_RATIO = 0.52;
const NEAR_DROP = 0.5;
const Z_NEAR = 1;
const Z_FAR = 8;

// World half-width of the grid. Wider than the viewport at Z_NEAR (so the front row
// bleeds off both edges) and narrower at Z_FAR (so the mesh visibly converges).
const WORLD_HALF_W = 2.6;
const FOCAL_X_RATIO = 0.52;

// Large relative to NEAR_DROP (the camera height) — that ratio is what turns a rippled
// plane into a rolling landscape whose hills read side-on.
const AMPLITUDE_RATIO = 0.17;
const DRIFT = 0.004; // lateral drift in world units — a few pixels on screen

type Palette = {
  stops: [string, string, string];
  line: number;
  ridge: number;
  point: number;
  glow: number;
  star: number;
};

const DARK: Palette = {
  stops: ["#38d9ff", "#4f8cff", "#a78bfa"],
  line: 0.26,
  ridge: 0.3,
  point: 0.42,
  glow: 0.7,
  star: 0.2,
};

const LIGHT: Palette = {
  stops: ["#0e91ad", "#3b6fd4", "#7c5cd6"],
  line: 0.24,
  ridge: 0.26,
  point: 0.4,
  glow: 0.5,
  star: 0.16,
};

/** Grid density and wave scale by viewport width. */
function densityFor(width: number) {
  if (width < 640) return { cols: 34, rows: 24, amp: 0.5 };
  if (width < 1024) return { cols: 54, rows: 34, amp: 0.75 };
  if (width < 1536) return { cols: 72, rows: 42, amp: 1 };
  return { cols: 82, rows: 46, amp: 1 };
}

/** Sum of three slow sine waves plus a fixed per-point offset. */
function calculateHeight(wx: number, z: number, phase: number, t: number) {
  return (
    Math.sin(wx * 1.15 + t * 0.26) * 0.62 +
    Math.sin(z * 1.45 - t * 0.19) * 0.44 +
    Math.sin((wx * 0.8 + z) * 1.05 + t * 0.31) * 0.36 +
    Math.sin(phase + t * 0.14) * 0.08
  );
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
      // Near-uniform steps in z — that is what makes far rows bunch together. The
      // slight power curve adds a few extra rows up front so the foreground grid
      // does not stretch out into big gaps.
      for (let j = 0; j < rows; j++) {
        worldZ[j] = Z_NEAR + (Z_FAR - Z_NEAR) * Math.pow(j / (rows - 1), 1.18);
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
        // Keep them above the mesh, in the empty upper band.
        starY[s] = Math.random() * HORIZON_RATIO * 0.95;
        starPhase[s] = Math.random() * Math.PI * 2;
      }
    }

    function buildGradient() {
      if (width === 0) return;
      const g = ctx!.createLinearGradient(0, 0, width, 0);
      const stops = (darkRef.current ? DARK : LIGHT).stops;
      g.addColorStop(0, stops[0]);
      g.addColorStop(0.5, stops[1]);
      g.addColorStop(0.92, stops[2]);
      g.addColorStop(1, stops[2]);
      gradient = g;
    }

    function resizeCanvas() {
      const rect = canvas!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
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
      const horizon = height * HORIZON_RATIO;
      const camA = height * NEAR_DROP;
      const focalX = width * FOCAL_X_RATIO;
      const amp = height * AMPLITUDE_RATIO * ampScale;

      for (let j = 0; j < rows; j++) {
        const z = worldZ[j];
        const invZ = 1 / z;
        const drift = Math.sin(t * 0.12 + z * 0.5) * DRIFT;
        const rowOffset = j * cols;
        for (let i = 0; i < cols; i++) {
          const k = rowOffset + i;
          const wx = worldX[i];
          const h = calculateHeight(wx, z, phases[k], t);
          projX[k] = cx + (wx + drift) * focalX * invZ;
          projY[k] = horizon + (camA - h * amp) * invZ;
          // Crests read brighter, which is what gives the mesh its glowing ridges.
          projCrest[k] = h > 0 ? Math.min(1, h / 1.15) : 0;
        }
      }
    }

    // Gentle falloff — the far grid has to stay readable, not vanish, or the mesh
    // loses the stacked-ridge depth it gets from the distant rows.
    const depthFade = (j: number) => Math.pow(1 - j / (rows - 1), 0.8);

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
        ctx!.shadowBlur = fade > 0.35 ? 5 * fade : 0;
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
      ctx!.shadowColor = (darkRef.current ? DARK : LIGHT).stops[0];
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
        ctx!.arc(starX[s] * width, starY[s] * height, 1, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function render(t: number) {
      const palette = darkRef.current ? DARK : LIGHT;
      ctx!.clearRect(0, 0, width, height);
      ctx!.shadowColor = palette.stops[0];
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
