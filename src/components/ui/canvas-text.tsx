"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CanvasTextProps = {
  children: string;
  className?: string;
  /** number of flowing curved lines */
  lines?: number;
  /** animation speed multiplier */
  speed?: number;
};

function readAccent(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return cs.getPropertyValue("--primary").trim() || "#6366f1";
}

let supportsRelativeOklch: boolean | null = null;

function colorFor(
  ctx: CanvasRenderingContext2D,
  accent: string,
  hueShift: number,
) {
  if (supportsRelativeOklch === null) {
    const prev = ctx.strokeStyle;
    ctx.strokeStyle = "#000";
    ctx.strokeStyle = `oklch(from ${accent} l c calc(h + 30))`;
    supportsRelativeOklch = ctx.strokeStyle !== "#000000";
    ctx.strokeStyle = prev;
  }
  if (supportsRelativeOklch) {
    return `oklch(from ${accent} l c calc(h + ${hueShift}))`;
  }
  return `hsl(${((260 + hueShift) % 360 + 360) % 360} 70% 60%)`;
}

/**
 * Animated text: colorful curved lines are drawn on a canvas and clipped to
 * the glyph shapes of the text using canvas compositing.
 */
export function CanvasText({
  children,
  className,
  lines = 22,
  speed = 1,
}: CanvasTextProps) {
  const hostRef = React.useRef<HTMLSpanElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const pointer = React.useRef({ x: 0.5, y: 0.5, active: 0 });

  React.useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const measure = measureRef.current;
    if (!host || !canvas || !measure) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let font = "";
    let accent = readAccent(host);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = measure.getBoundingClientRect();
      w = Math.max(1, Math.ceil(r.width));
      h = Math.max(1, Math.ceil(r.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cs = getComputedStyle(measure);
      font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
      accent = readAccent(host);
    };

    const start = performance.now();

    const draw = (now: number) => {
      const t = reduced ? 0 : ((now - start) / 1000) * speed;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // 1) glyph mask
      ctx.font = font;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(children, 0, h / 2);

      // 2) colorful curved lines, clipped to glyphs
      ctx.globalCompositeOperation = "source-in";
      ctx.lineCap = "round";

      const px = pointer.current.x;
      const py = pointer.current.y;
      const boost = pointer.current.active;

      for (let i = 0; i < lines; i++) {
        const p = i / (lines - 1);
        const hueShift = (p - 0.5) * 90;
        ctx.strokeStyle = colorFor(ctx, accent, hueShift);
        ctx.globalAlpha = 0.55 + 0.45 * Math.sin(p * Math.PI);
        ctx.lineWidth = 1.1 + 1.4 * Math.sin(p * Math.PI);
        ctx.beginPath();
        for (let x = -10; x <= w + 10; x += 6) {
          const nx = x / Math.max(w, 1);
          const wave =
            Math.sin(nx * 5.2 + t * 1.1 + p * 3.4) * (h * 0.16) +
            Math.sin(nx * 11 - t * 0.7 + p * 6) * (h * 0.07);
          const pull =
            boost *
            (h * 0.22) *
            Math.exp(-Math.pow((nx - px) * 4.5, 2)) *
            (py - 0.5) *
            2;
          const y = h * (0.15 + 0.7 * p) + wave + pull;
          if (x === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // ease pointer influence back down
      pointer.current.active *= 0.94;

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(performance.now());
    });
    ro.observe(measure);
    resize();

    raf = requestAnimationFrame(draw);

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.current.x = (e.clientX - r.left) / Math.max(r.width, 1);
      pointer.current.y = (e.clientY - r.top) / Math.max(r.height, 1);
      pointer.current.active = 1;
    };
    host.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
    };
  }, [children, lines, speed]);

  return (
    <span
      ref={hostRef}
      className={cn("relative inline-block align-baseline", className)}
    >
      {/* invisible text drives layout + font metrics + a11y */}
      <span ref={measureRef} className="invisible whitespace-pre">
        {children}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0"
      />
      <span className="sr-only">{children}</span>
    </span>
  );
}