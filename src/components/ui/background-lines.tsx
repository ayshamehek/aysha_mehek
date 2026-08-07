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
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 800 200"
        fill="none"
      >
        <defs>
          <linearGradient id="line-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="15%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="85%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wave path 1 */}
        <path
          d="M-50 140 C 120 80, 280 200, 450 120 S 750 60, 900 130"
          stroke="url(#line-fade)"
          strokeWidth="2"
          strokeLinecap="round"
          className="wave-line wave-line-1"
        />

        {/* Wave path 2 */}
        <path
          d="M-50 110 C 150 180, 320 60, 500 130 S 720 190, 900 100"
          stroke="url(#line-fade)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="wave-line wave-line-2"
        />

        {/* Wave path 3 */}
        <path
          d="M-50 170 C 180 120, 340 210, 520 150 S 740 70, 900 160"
          stroke="url(#line-fade)"
          strokeWidth="1"
          strokeLinecap="round"
          className="wave-line wave-line-3"
        />

        {/* Dotted accent line */}
        <path
          d="M-50 150 C 200 70, 400 210, 650 110 S 850 140, 900 120"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="8 18"
          className="wave-line wave-line-4"
          opacity="0.25"
        />
      </svg>

      {/* Accent glow blob behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-20 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)",
        }}
      />

      {children}
    </div>
  );
}
