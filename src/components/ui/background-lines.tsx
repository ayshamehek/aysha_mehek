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
      {/* Animated wave lines behind the text */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 overflow-visible"
        style={{
          top: "-40px",
          bottom: "-40px",
          left: "-48px",
          right: "-48px",
          width: "calc(100% + 96px)",
          height: "calc(100% + 80px)",
        }}
        preserveAspectRatio="none"
        viewBox="0 0 900 200"
        fill="none"
      >
        <defs>
          <linearGradient id="line-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="12%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.55" />
            <stop offset="88%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>

          <filter id="line-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
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
          d="M-50 145 C 120 80, 280 205, 450 125 S 750 55, 950 135"
          stroke="url(#line-fade)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#line-glow)"
          className="wave-line wave-line-1"
        />

        {/* Wave path 2 */}
        <path
          d="M-50 115 C 150 185, 320 55, 500 130 S 720 195, 950 95"
          stroke="url(#line-fade)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#line-glow)"
          className="wave-line wave-line-2"
        />

        {/* Wave path 3 */}
        <path
          d="M-50 175 C 180 120, 340 215, 520 155 S 740 65, 950 165"
          stroke="url(#line-fade)"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#line-glow)"
          className="wave-line wave-line-3"
        />

        {/* Dotted accent line */}
        <path
          d="M-50 155 C 200 70, 400 215, 650 110 S 850 145, 950 125"
          stroke="var(--primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="10 22"
          className="wave-line wave-line-4"
          opacity="0.35"
          filter="url(#line-glow)"
        />
      </svg>

      {/* Soft accent glow blob behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-20 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 28%, transparent), transparent 70%)",
        }}
      />

      {children}
    </div>
  );
}

