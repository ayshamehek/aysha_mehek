"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MovingBorder({
  children,
  className,
  containerClassName,
  borderClassName,
  as: Tag = "div",
  duration = 3000,
  radius = "1.25rem",
  borderWidth = 1,
  showSparkle = true,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: keyof React.JSX.IntrinsicElements;
  duration?: number;
  radius?: string;
  borderWidth?: number;
  showSparkle?: boolean;
}) {
  const base = "color-mix(in oklab, var(--primary) 30%, transparent)";
  const glow = "color-mix(in oklab, var(--primary) 90%, transparent)";
  const core = "color-mix(in oklab, var(--primary) 100%, transparent)";

  return (
    <Tag
      className={cn(
        "group relative overflow-hidden",
        containerClassName,
      )}
      style={{ borderRadius: radius }}
    >
      {/* rotating conic gradient ring — the moving border */}
      <motion.div
        className={cn(
          "pointer-events-none absolute -inset-[45%] z-0",
          borderClassName,
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `conic-gradient(
            from 0deg,
            ${base} 0deg,
            ${glow} 40deg,
            ${core} 70deg,
            ${glow} 100deg,
            ${base} 150deg,
            ${base} 180deg,
            ${glow} 220deg,
            ${core} 250deg,
            ${glow} 280deg,
            ${base} 330deg,
            ${base} 360deg
          )`,
        }}
      />

      {/* counter-rotating sparkle layer */}
      {showSparkle && (
        <motion.div
          className="pointer-events-none absolute -inset-[40%] z-0 opacity-60 mix-blend-screen"
          animate={{ rotate: -360 }}
          transition={{
            duration: duration / 1000 + 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              transparent 60deg,
              ${core} 90deg,
              transparent 120deg,
              transparent 180deg,
              transparent 240deg,
              ${core} 270deg,
              transparent 300deg,
              transparent 360deg
            )`,
            filter: "blur(1px)",
          }}
        />
      )}

      {/* accent glow behind the visible border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          borderRadius: radius,
          boxShadow:
            "0 0 36px -2px color-mix(in oklab, var(--primary) 65%, transparent), inset 0 0 28px -14px color-mix(in oklab, var(--primary) 35%, transparent)",
        }}
      />

      {/* inner mask that creates the thin visible border */}
      <div
        className={cn(
          "relative z-10 h-full w-full bg-card",
          className,
        )}
        style={{
          borderRadius: `calc(${radius} - ${borderWidth}px)`,
          margin: `${borderWidth}px`,
          width: `calc(100% - ${borderWidth * 2}px)`,
          height: `calc(100% - ${borderWidth * 2}px)`,
        }}
      >
        {children}
      </div>
    </Tag>
  );
}
