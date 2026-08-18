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
  const glowColor = "color-mix(in oklab, var(--primary) 65%, transparent)";

  return (
    <Tag
      className={cn(
        "group relative overflow-hidden",
        containerClassName,
      )}
      style={{ borderRadius: radius }}
    >
      {/* animated rotating conic gradient ring — the moving border */}
      <motion.div
        className={cn(
          "pointer-events-none absolute -inset-[300%] z-0",
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
            transparent 0deg,
            ${glowColor} 20deg,
            color-mix(in oklab, var(--primary) 100%, transparent) 55deg,
            ${glowColor} 90deg,
            transparent 160deg,
            transparent 360deg
          )`,
        }}
      />

      {/* secondary sparkle ring rotating counter-clockwise */}
      {showSparkle && (
        <motion.div
          className="pointer-events-none absolute -inset-[250%] z-0 opacity-70 mix-blend-screen"
          animate={{ rotate: -360 }}
          transition={{
            duration: duration / 1000 + 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              transparent 120deg,
              color-mix(in oklab, var(--primary) 85%, transparent) 150deg,
              color-mix(in oklab, var(--primary) 45%, transparent) 200deg,
              transparent 230deg,
              transparent 360deg
            )`,
            filter: "blur(1.5px)",
          }}
        />
      )}

      {/* soft accent glow behind the visible border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          borderRadius: radius,
          boxShadow:
            "0 0 34px -4px color-mix(in oklab, var(--primary) 60%, transparent), inset 0 0 24px -14px color-mix(in oklab, var(--primary) 35%, transparent)",
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
