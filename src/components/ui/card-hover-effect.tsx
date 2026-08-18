import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type HoverItem = {
  title: string;
  description: string;
  link: string;
  icon?: React.ReactNode;
};

export function HoverEffect({
  items,
  className,
}: {
  items: HoverItem[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {items.map((item, idx) => (
        <a
          href={item.link}
          key={item.link}
          target={item.link.startsWith("http") ? "_blank" : undefined}
          rel={item.link.startsWith("http") ? "noreferrer" : undefined}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === idx && (
              <motion.span
                className="absolute inset-0 block rounded-2xl bg-primary/10"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.15 } }}
                style={{
                  boxShadow:
                    "0 0 0 1px color-mix(in oklab, var(--primary) 25%, transparent), 0 18px 50px -18px color-mix(in oklab, var(--primary) 60%, transparent)",
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 h-full overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors duration-200 group-hover:border-primary/40">
            {/* soft accent glow inside the card */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/2 h-32 w-40 -translate-x-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 55%, transparent), transparent 70%)",
              }}
            />
            <div className="relative flex items-center gap-3">
              {item.icon ? (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                  {item.icon}
                </span>
              ) : null}
              <h4 className="font-mono-ui text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                {item.title}
              </h4>
            </div>
            <p className="relative mt-3 truncate text-sm text-foreground/85 transition-colors group-hover:text-foreground">
              {item.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}