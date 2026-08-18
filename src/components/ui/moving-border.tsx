"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MovingBorder({
  children,
  className,
  containerClassName,
  borderClassName,
  as: Tag = "div",
  duration = 3500,
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
  return (
    <Tag
      className={cn(
        "group relative overflow-hidden p-[1px]",
        containerClassName,
      )}
      style={{ borderRadius: radius }}
    >
      {/* animated rotating conic gradient ring */}
      <motion.div
        className={cn(
          "pointer-events-none absolute -inset-[200%] z-0 opacity-100",
          borderClassName,
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: duration / 1000, repeat: Infinity, ease: "linear" }}
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0deg,
            color-mix(in oklab, var(--primary) 90%, transparent) 45deg,
            color-mix(in oklab, var(--primary) 100%, transparent) 70deg,
            color-mix(in oklab, var(--primary) 50%, transparent) 110deg,
            transparent 180deg,
            transparent 360deg
          )`,
        }}
      />

      {/* subtle secondary glow ring that spins slightly slower, adds sparkle depth */}
      {showSparkle && (
        <motion.div
          className="pointer-events-none absolute -inset-[200%] z-0 opacity-60 mix-blend-screen"
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
              color-mix(in oklab, var(--primary) 60%, transparent) 20deg,
              transparent 60deg,
              transparent 160deg,
              color-mix(in oklab, var(--primary) 80%, transparent) 200deg,
              transparent 260deg,
              transparent 360deg
            )`,
            filter: "blur(1px)",
          }}
        />
      )}

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

      {/* soft outer glow, accent-aware */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          borderRadius: radius,
          boxShadow:
            "0 0 28px -6px color-mix(in oklab, var(--primary) 55%, transparent), inset 0 0 20px -12px color-mix(in oklab, var(--primary) 30%, transparent)",
        }}
      />
    </Tag>
  );
}
