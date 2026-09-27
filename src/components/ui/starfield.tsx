import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  diamond: boolean;
};

/** A quiet, viewport-wide layer of pinprick stars above the cloud/grid backdrop. */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let dark = document.documentElement.classList.contains("dark");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height / 1_000_000) * 135);
      stars = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0005 + Math.random() * 0.0011,
        diamond: i % 11 === 0,
      }));
      render(performance.now());
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const pulse = reduceMotion.matches ? 0.65 : (Math.sin(time * star.speed + star.phase) + 1) / 2;
        const alpha = (dark ? 0.25 : 0.45) + pulse * (dark ? 0.48 : 0.4);

        // The soft outline preserves a white center against the light theme.
        if (!dark) {
          ctx.fillStyle = `rgba(56, 70, 91, ${alpha * 0.24})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.diamond ? 2.7 : 1.65, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        if (star.diamond) {
          const reach = 1.6 + pulse * 1.1;
          const half = 0.35 + star.size * 0.3;
          ctx.moveTo(star.x, star.y - reach);
          ctx.lineTo(star.x + half, star.y - half);
          ctx.lineTo(star.x + reach, star.y);
          ctx.lineTo(star.x + half, star.y + half);
          ctx.lineTo(star.x, star.y + reach);
          ctx.lineTo(star.x - half, star.y + half);
          ctx.lineTo(star.x - reach, star.y);
          ctx.lineTo(star.x - half, star.y - half);
          ctx.closePath();
        } else {
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    const tick = (time: number) => {
      render(time);
      if (!reduceMotion.matches) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion.matches) render(performance.now());
      else frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      if (reduceMotion.matches) render(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    reduceMotion.addEventListener("change", start);
    resize();
    start();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      themeObserver.disconnect();
      reduceMotion.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}