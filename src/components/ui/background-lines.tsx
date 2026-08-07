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
      {/* Soft accent glow behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-30 rounded-[2.5rem] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)",
        }}
      />

      {/* Animated wave lines behind the text */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -z-20 overflow-visible"
        style={{
          top: "-24px",
          bottom: "-24px",
          left: "-24px",
          right: "-24px",
          width: "calc(100% + 48px)",
          height: "calc(100% + 48px)",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 900 200"
        fill="none"
      >
        <defs>
          <linearGradient id="line-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="20%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="80%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
          </linearGradient>

          <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.65 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wave path 1 - thick */}
        <path
          d="M-50 145 C 120 80, 280 200, 450 120 S 750 55, 950 140"
          stroke="url(#line-fade)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="160 80"
          filter="url(#line-glow)"
          className="wave-line wave-line-1"
        />

        {/* Wave path 2 */}
        <path
          d="M-50 115 C 150 185, 320 60, 500 130 S 720 195, 950 90"
          stroke="url(#line-fade)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="110 70"
          filter="url(#line-glow)"
          className="wave-line wave-line-2"
        />

        {/* Wave path 3 */}
        <path
          d="M-50 175 C 180 120, 340 210, 520 150 S 740 70, 950 165"
          stroke="url(#line-fade)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="90 55"
          filter="url(#line-glow)"
          className="wave-line wave-line-3"
        />

        {/* Dotted accent line */}
        <path
          d="M-50 160 C 200 70, 400 215, 650 110 S 850 150, 950 125"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="12 26"
          className="wave-line wave-line-4"
          opacity="0.65"
          filter="url(#line-glow)"
        />
      </svg>

      {children}
    </div>
  );
}
