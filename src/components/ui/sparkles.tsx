import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  tw: number;
  ts: number;
};

export function SparklesCore({
  className,
  minSize = 0.4,
  maxSize = 1.2,
  particleDensity = 900,
  speed = 1,
  particleColor,
}: {
  className?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  speed?: number;
  particleColor?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const color = () => {
      if (particleColor) return particleColor;
      const cs = getComputedStyle(canvas);
      return cs.getPropertyValue("--sparkle-color").trim() || "#ffffff";
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(
        40,
        Math.round((w * h * particleDensity) / (1280 * 400)),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: minSize + Math.random() * (maxSize - minSize),
        vx: (Math.random() - 0.5) * 0.12 * speed,
        vy: (Math.random() - 0.5) * 0.12 * speed,
        a: Math.random(),
        tw: 0.004 + Math.random() * 0.014,
        ts: Math.random() > 0.5 ? 1 : -1,
      }));
    };

    let fill = color();
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fill;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        p.a += p.tw * p.ts;
        if (p.a <= 0.05) {
          p.a = 0.05;
          p.ts = 1;
        }
        if (p.a >= 1) {
          p.a = 1;
          p.ts = -1;
        }
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    build();
    tick();

    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      fill = color();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [minSize, maxSize, particleDensity, speed, particleColor]);

  return <canvas ref={ref} className={cn("block h-full w-full", className)} />;
}

export function NavSparkles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-24 w-full overflow-hidden sm:h-28"
      style={
        {
          "--sparkle-color":
            "color-mix(in oklab, var(--primary) 55%, var(--foreground))",
        } as React.CSSProperties
      }
    >
      {/* beam lines */}
      <div className="absolute inset-x-[12%] top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
      <div className="absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute inset-x-[34%] top-0 h-[5px] bg-gradient-to-r from-transparent via-primary/70 to-transparent blur-md" />
      <div className="absolute inset-x-[38%] top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />

      {/* glow under beam */}
      <div
        className="absolute left-1/2 top-0 h-24 w-[70%] -translate-x-1/2 opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 45%, transparent), transparent)",
        }}
      />

      <div className="absolute inset-0 [mask-image:radial-gradient(70%_100%_at_50%_0%,black,transparent)]">
        <SparklesCore minSize={0.4} maxSize={1.1} particleDensity={1100} />
      </div>
    </div>
  );
}
