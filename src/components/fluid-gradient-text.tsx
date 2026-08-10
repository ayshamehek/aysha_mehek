import * as React from "react";
import { cn } from "@/lib/utils";

type FluidGradientTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  /** radius of the fluid highlight in px */
  radius?: number;
};

/**
 * Renders text with a fluid gradient highlight that follows pointer movement.
 * A dim base layer is overlaid by a bright accent layer masked with a radial
 * gradient positioned at the pointer.
 */
export function FluidGradientText({
  children,
  className,
  radius = 140,
  ...props
}: FluidGradientTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);

  const handleMove = React.useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const mask = pos
    ? `radial-gradient(${radius}px ${radius}px at ${pos.x}px ${pos.y}px, #000 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0) 72%)`
    : `radial-gradient(${radius}px ${radius}px at 50% 120%, #000 0%, rgba(0,0,0,0) 70%)`;

  return (
    <span
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={() => setPos(null)}
      className={cn("relative inline-block select-none", className)}
      {...props}
    >
      <span
        aria-hidden
        className="block bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(180deg, color-mix(in oklab, var(--foreground) 22%, transparent), color-mix(in oklab, var(--foreground) 8%, transparent))",
        }}
      >
        {children}
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 block bg-clip-text text-transparent transition-[opacity] duration-300"
        style={{
          backgroundImage:
            "linear-gradient(110deg, color-mix(in oklab, var(--primary) 85%, var(--foreground)), var(--foreground) 45%, color-mix(in oklab, var(--primary) 70%, var(--foreground)))",
          WebkitMaskImage: mask,
          maskImage: mask,
          opacity: pos ? 1 : 0.55,
        }}
      >
        {children}
      </span>

      <span className="sr-only">{children}</span>
    </span>
  );
}
