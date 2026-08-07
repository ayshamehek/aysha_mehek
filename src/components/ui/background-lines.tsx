import React from "react";

export function BackgroundLines({
  className = "",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Frosted glass backdrop panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-30 rounded-2xl border border-primary/10 bg-background/40 backdrop-blur-sm sm:-inset-8"
        style={{
          boxShadow:
            "inset 0 1px 0 0 color-mix(in oklab, var(--primary) 12%, transparent), 0 20px 50px -20px color-mix(in oklab, var(--primary) 25%, transparent)",
        }}
      />

      {/* Animated wave lines behind the text */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 overflow-visible"
        style={{
          top: "-28px",
          bottom: "-28px",
          left: "-32px",
          right: "-32px",
          width: "calc(100% + 64px)",
          height: "calc(100% + 56px)",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 900 200"
        fill="none"
      >
        <defs>
          <linearGradient id="line-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.05" />
            <stop offset="15%" stopColor="var(--primary)" stopOpacity="0.45" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.85" />
            <stop offset="85%" stopColor="var(--primary)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
          </linearGradient>

          <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.7 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wave path 1 - prominent */}
        <path
          d="M-50 150 C 120 80, 280 195, 450 120 S 750 55, 950 145"
          stroke="url(#line-fade)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="140 70"
          filter="url(#line-glow)"
          className="wave-line wave-line-1"
        />

        {/* Wave path 2 */}
        <path
          d="M-50 120 C 150 190, 320 60, 500 130 S 720 205, 950 95"
          stroke="url(#line-fade)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="100 60"
          filter="url(#line-glow)"
          className="wave-line wave-line-2"
        />

        {/* Wave path 3 */}
        <path
          d="M-50 180 C 180 120, 340 210, 520 150 S 740 65, 950 170"
          stroke="url(#line-fade)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="80 50"
          filter="url(#line-glow)"
          className="wave-line wave-line-3"
        />

        {/* Dotted accent line */}
        <path
          d="M-50 165 C 200 70, 400 215, 650 110 S 850 150, 950 125"
          stroke="var(--primary)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="10 22"
          className="wave-line wave-line-4"
          opacity="0.55"
          filter="url(#line-glow)"
        />
      </svg>

      {/* Soft accent glow blob behind the panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-40 rounded-[2.5rem] opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 35%, transparent), transparent 70%)",
        }}
      />

      {children}
    </div>
  );
}
