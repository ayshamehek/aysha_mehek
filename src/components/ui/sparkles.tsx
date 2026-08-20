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
  rot: number;
  rotSpeed: number;
  shape: "circle" | "star" | "diamond";
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  maxLife: number;
};

export function SparklesCore({
  className,
  minSize = 0.6,
  maxSize = 2.2,
  particleDensity = 1400,
  speed = 1.2,
  particleColor,
  glow = true,
}: {
  className?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  speed?: number;
  particleColor?: string;
  glow?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let shootingStars: ShootingStar[] = [];
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
        60,
        Math.round((w * h * particleDensity) / (1280 * 320)),
      );
      particles = Array.from({ length: count }, () => {
        const shapeRoll = Math.random();
        let shape: Particle["shape"] = "circle";
        if (shapeRoll > 0.75) shape = "star";
        else if (shapeRoll > 0.55) shape = "diamond";
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: minSize + Math.random() * (maxSize - minSize),
          vx: (Math.random() - 0.5) * 0.18 * speed,
          vy: (Math.random() - 0.5) * 0.18 * speed,
          a: Math.random(),
          tw: 0.006 + Math.random() * 0.022,
          ts: Math.random() > 0.5 ? 1 : -1,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.04,
          shape,
        };
      });
    };

    let fill = color();

    const spawnShootingStar = () => {
      if (Math.random() > 0.015 || shootingStars.length > 2) return;
      const startY = Math.random() * h * 0.5;
      const speedMag = 3 + Math.random() * 3;
      shootingStars.push({
        x: -40,
        y: startY,
        vx: speedMag,
        vy: speedMag * 0.35,
        len: 60 + Math.random() * 80,
        life: 1,
        maxLife: 1,
      });
    };

    const drawStar = (x: number, y: number, r: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        ctx.lineTo(Math.cos(angle + Math.PI / 4) * r * 0.4, Math.sin(angle + Math.PI / 4) * r * 0.4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawDiamond = (x: number, y: number, r: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.6, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = fill;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        p.a += p.tw * p.ts;
        if (p.a <= 0.04) {
          p.a = 0.04;
          p.ts = 1;
        }
        if (p.a >= 1) {
          p.a = 1;
          p.ts = -1;
        }
        p.rot += p.rotSpeed;

        if (glow) {
          ctx.shadowColor = fill;
          ctx.shadowBlur = p.r * 4;
        } else {
          ctx.shadowBlur = 0;
        }

        if (p.shape === "star") {
          drawStar(p.x, p.y, p.r * 1.4, p.rot, p.a);
        } else if (p.shape === "diamond") {
          drawDiamond(p.x, p.y, p.r * 1.2, p.a);
        } else {
          ctx.globalAlpha = p.a;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // shooting stars
      spawnShootingStar();
      ctx.shadowBlur = 0;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.01;
        if (s.life <= 0 || s.x > w + s.len || s.y > h + s.len) {
          shootingStars.splice(i, 1);
          continue;
        }
        const alpha = s.life;
        const grad = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - s.vx * (s.len / s.vx),
          s.y - s.vy * (s.len / s.vx),
        );
        grad.addColorStop(0, fill);
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - s.vx * (s.len / s.vx),
          s.y - s.vy * (s.len / s.vy),
        );
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
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
  }, [minSize, maxSize, particleDensity, speed, particleColor, glow]);

  return <canvas ref={ref} className={cn("block h-full w-full", className)} />;
}

export function NavSparkles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-28 w-full overflow-hidden sm:h-36"
      style={
        {
          "--sparkle-color":
            "color-mix(in oklab, var(--primary) 70%, var(--foreground))",
        } as React.CSSProperties
      }
    >
      {/* strong beam lines */}
      <div className="absolute inset-x-[10%] top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
      <div className="absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute inset-x-[30%] top-0 h-[6px] bg-gradient-to-r from-transparent via-primary/80 to-transparent blur-md" />
      <div className="absolute inset-x-[36%] top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute inset-x-[22%] top-0 h-[10px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-xl" />

      {/* intense glow under beam */}
      <div
        className="absolute left-1/2 top-0 h-28 w-[80%] -translate-x-1/2 opacity-80 blur-3xl sm:h-36 sm:w-[75%]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 55%, transparent), transparent)",
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-20 w-[40%] -translate-x-1/2 opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 75%, transparent), transparent)",
        }}
      />

      {/* particle field — wider mask for visibility */}
      <div className="absolute inset-0 [mask-image:radial-gradient(85%_100%_at_50%_0%,black,transparent)]">
        <SparklesCore minSize={0.7} maxSize={1.7} particleDensity={1600} speed={1.3} />
      </div>
    </div>
  );
}
