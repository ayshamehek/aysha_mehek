import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  type PanInfo,
} from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Download,
  Moon,
  Sun,
  ArrowUpRight,
  Menu,
  X,
  Palette,
  GripVertical,
  Sparkles,
  ImagePlus,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import profileAsset from "@/assets/profile.png.asset.json";
import watermelonCursor from "@/assets/watermelon-cursor.png.asset.json";
import kittyCursor from "@/assets/kitty-cursor.png.asset.json";

const TITLES = [
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Enthusiast",
  "Python & SQL Developer",
];

function Typewriter({ words = TITLES }: { words?: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) {
      setText(words[0]);
      return;
    }
    const word = words[i % words.length];
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), 1400);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((p) => (p + 1) % words.length);
      return;
    }
    const t = setTimeout(
      () =>
        setText((p) => (deleting ? word.slice(0, p.length - 1) : word.slice(0, p.length + 1))),
      deleting ? 45 : 90,
    );
    return () => clearTimeout(t);
  }, [text, deleting, i, words, reduce]);

  return (
    <span className="text-primary">
      {text}
      <span className="caret" aria-hidden />
    </span>
  );
}

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "activity", label: "Activity" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const SKILLS: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "JavaScript", "HTML", "CSS"] },
  { label: "Frameworks", items: ["React.js", "Node.js", "Express.js"] },
  {
    label: "Libraries",
    items: [
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "TanStack Query",
    ],
  },
  { label: "Databases", items: ["MongoDB", "SQL"] },
  { label: "Tools", items: ["Git", "GitHub", "Power BI", "Microsoft Excel"] },
];

const PROJECTS = [
  {
    title: "Expensify",
    subtitle: "MERN Stack Expense Tracker & Analytics Platform",
    bullets: [
      "Engineered a responsive full-stack expense management platform using MongoDB, Express.js, React.js and Node.js with JWT authentication.",
      "Optimized performance using TanStack Query and server-side pagination.",
      "Built automated monthly/yearly CSV reports with Cloudinary integration and download history.",
      "Implemented secure password reset using Nodemailer.",
    ],
    tags: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "TanStack Query",
      "Cloudinary",
    ],
    href: "https://github.com/ayshamehek",
  },
  {
    title: "Customer Churn Prediction",
    subtitle: "Using Machine Learning",
    bullets: [
      "Developed a customer churn prediction model using Logistic Regression and Random Forest to identify customers likely to leave.",
      "Performed data preprocessing, feature engineering, and class imbalance handling using Pandas and Imbalanced-learn.",
      "Trained and evaluated ML models with Scikit-learn, improving prediction performance through hyperparameter tuning.",
      "Visualized feature importance and model insights with Seaborn to identify key factors influencing churn.",
    ],
    tags: [
      "Python",
      "Scikit-learn",
      "Pandas",
      "Imbalanced-learn",
      "Seaborn",
      "Logistic Regression",
      "Random Forest",
    ],
    href: "https://github.com/ayshamehek",
  },
];

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return { theme, toggle };
}

/* ---------- Accent color picker ---------- */
const ACCENTS = [
  { name: "Indigo", light: "oklch(0.55 0.13 255)", dark: "oklch(0.7 0.14 255)", swatch: "#4f46e5" },
  { name: "Emerald", light: "oklch(0.58 0.14 160)", dark: "oklch(0.72 0.15 160)", swatch: "#10b981" },
  { name: "Rose", light: "oklch(0.6 0.18 15)", dark: "oklch(0.72 0.17 15)", swatch: "#f43f5e" },
  { name: "Amber", light: "oklch(0.68 0.16 65)", dark: "oklch(0.78 0.15 70)", swatch: "#f59e0b" },
  { name: "Violet", light: "oklch(0.55 0.2 300)", dark: "oklch(0.72 0.18 300)", swatch: "#8b5cf6" },
  { name: "Cyan", light: "oklch(0.6 0.13 210)", dark: "oklch(0.75 0.13 210)", swatch: "#06b6d4" },
];

/* ---------- Dot grid background ---------- */
function DotGridBackground({ theme }: { theme: "light" | "dark" }) {
  const dotAlpha = theme === "dark" ? 0.45 : 0.38;
  const gridAlpha = theme === "dark" ? 0.12 : 0.1;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* dot grid — tinted with the current accent */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(color-mix(in oklab, var(--primary) ${dotAlpha * 100}%, transparent) 1px, transparent 1.2px)`,
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)",
        }}
      />
      {/* faint grid lines for depth */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, color-mix(in oklab, var(--primary) ${gridAlpha * 100}%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--primary) ${gridAlpha * 100}%, transparent) 1px, transparent 1px)`,
          backgroundSize: "88px 88px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 55%, transparent 100%)",
        }}
      />
      {/* accent glow blob top */}
      <div
        className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, var(--primary) ${theme === "dark" ? 22 : 14}%, transparent), transparent 70%)`,
        }}
      />
      {/* accent glow blob bottom */}
      <div
        className="absolute bottom-[-200px] right-[-120px] h-[420px] w-[520px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, var(--primary) ${theme === "dark" ? 18 : 10}%, transparent), transparent 70%)`,
        }}
      />
    </div>
  );
}

function useAccent(theme: "light" | "dark") {
  const [accent, setAccent] = useState<string>("Indigo");

  useEffect(() => {
    const stored = localStorage.getItem("accent") ?? "Indigo";
    setAccent(stored);
  }, []);

  useEffect(() => {
    const found = ACCENTS.find((a) => a.name === accent) ?? ACCENTS[0];
    const value = theme === "dark" ? found.dark : found.light;
    const root = document.documentElement;
    root.style.setProperty("--primary", value);
    root.style.setProperty("--accent", value);
    root.style.setProperty("--ring", value);
  }, [accent, theme]);

  const change = (name: string) => {
    setAccent(name);
    localStorage.setItem("accent", name);
  };

  return { accent, change };
}

function KawaiiCursors() {
  useEffect(() => {
    const arrow = `url("${watermelonCursor.url}") 4 4, auto`;
    const pointer = `url("${kittyCursor.url}") 14 14, pointer`;
    const id = "kawaii-cursor-style";
    let styleEl = document.getElementById(id) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = id;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      html, body { cursor: ${arrow}; }
      * { cursor: inherit; }
      a, button, [role="button"], label, summary, select, [data-cursor="pointer"] { cursor: ${pointer} !important; }
      input, textarea, [contenteditable="true"] { cursor: text !important; }
    `;
  }, []);
  return null;
}

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
      {children}
    </span>
  );
}

/* ---------- Magnetic tilt card wrapper ---------- */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-40, 40], [6, -6]), { stiffness: 200, damping: 15 });
  const ry = useSpring(useTransform(x, [-40, 40], [-6, 6]), { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Draggable project card stack ---------- */
function ProjectCardStack({ projects }: { projects: typeof PROJECTS }) {
  const [order, setOrder] = useState(projects.map((_, i) => i));

  const sendToBack = () => {
    setOrder((o) => {
      const [first, ...rest] = o;
      return [...rest, first];
    });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500) {
      sendToBack();
    }
  };

  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md select-none sm:h-[420px]">
      {order.map((idx, stackIdx) => {
        const project = projects[idx];
        const isTop = stackIdx === 0;
        return (
          <motion.div
            key={project.title}
            className="absolute inset-0"
            style={{ zIndex: projects.length - stackIdx }}
            initial={false}
            animate={{
              scale: 1 - stackIdx * 0.05,
              y: stackIdx * 14,
              opacity: stackIdx > 2 ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={isTop ? onDragEnd : undefined}
            whileDrag={{ scale: 1.02, cursor: "grabbing" }}
          >
            <StackedProjectCard project={project} isTop={isTop} />
          </motion.div>
        );
      })}
      <div className="pointer-events-none absolute -bottom-8 left-0 right-0 text-center text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <GripVertical className="h-3 w-3" /> Drag to shuffle · {order.length} projects
        </span>
      </div>
    </div>
  );
}

function StackedProjectCard({
  project,
  isTop,
}: {
  project: (typeof PROJECTS)[number];
  isTop: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.25)] transition-colors ${
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Featured
          </div>
          <h3 className="font-display text-2xl leading-tight sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>
        </div>
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border p-2 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          aria-label={`Open ${project.title} on GitHub`}
        >
          <Github className="h-4 w-4" />
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
      <ul className="mt-4 flex-1 space-y-2 text-[14px] leading-relaxed text-foreground/80">
        {project.bullets.slice(0, 3).map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-primary/70" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
    </div>
  );
}

/* ---------- Color picker popover ---------- */
function useProfilePhoto() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    try {
      setPhoto(localStorage.getItem("profile-photo"));
    } catch {
      /* ignore */
    }
  }, []);

  const accept = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setPhoto(url);
      try {
        localStorage.setItem("profile-photo", url);
      } catch {
        /* quota */
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setPhoto(null);
    try {
      localStorage.removeItem("profile-photo");
    } catch {
      /* ignore */
    }
  };

  return { photo, dragOver, setDragOver, accept, reset };
}

function ColorPicker({
  accent,
  onChange,
}: {
  accent: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = ACCENTS.find((a) => a.name === accent) ?? ACCENTS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change accent color"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
      >
        <Palette className="h-4 w-4" style={{ color: current.swatch }} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-border bg-popover p-3 shadow-lg"
            >
              <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Accent · {current.name}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.name}
                    onClick={() => {
                      onChange(a.name);
                    }}
                    aria-label={a.name}
                    title={a.name}
                    className={`h-7 w-7 rounded-full border transition-transform hover:scale-110 ${
                      accent === a.name
                        ? "ring-2 ring-offset-2 ring-offset-background"
                        : "border-border"
                    }`}
                    style={{
                      backgroundColor: a.swatch,
                      borderColor: a.swatch,
                      // @ts-expect-error CSS var
                      "--tw-ring-color": a.swatch,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-24 lg:py-32">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="tabular text-xs font-medium uppercase tracking-widest text-primary">
              {eyebrow}
            </div>
            <h2 className="font-display mt-2 text-4xl leading-[1.05] sm:text-5xl">
              {title}
            </h2>
          </div>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function ActivityGraph({
  theme,
  accentHex,
}: {
  theme: "light" | "dark";
  accentHex: string;
}) {
  const c = accentHex.replace("#", "");
  const text = theme === "dark" ? "e5e7eb" : "1f2937";
  const src =
    `https://github-readme-activity-graph.vercel.app/graph` +
    `?username=ayshamehek&bg_color=00000000&hide_border=true&area=true` +
    `&color=${text}&title_color=${c}&line=${c}&point=${c}&custom_title=Contribution%20Graph`;

  return (
    <Reveal>
      <div className="overflow-hidden rounded-xl border border-border bg-card/60 p-3 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)] sm:p-5">
        <img
          key={src}
          src={src}
          alt="Aysha Mehek's GitHub contribution graph over the last month"
          loading="lazy"
          className="w-full"
        />
      </div>
    </Reveal>
  );
}

export default function Portfolio() {
  const { theme, toggle } = useTheme();
  const { accent, change: changeAccent } = useAccent(theme);
  const active = useScrollSpy(NAV.map((n) => n.id));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-foreground">
      <DotGridBackground theme={theme} />
      <KawaiiCursors />
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <a
            href="#top"
            className="text-sm font-semibold tracking-tight"
          >
            aysha<span className="text-primary">.</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active === n.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
                {active === n.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-md bg-primary/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <ColorPicker accent={accent} onChange={changeAccent} />
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-border md:hidden">
            <nav className="mx-auto flex max-w-4xl flex-col px-4 py-2 sm:px-6">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    active === n.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="top" className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Hero */}
        <section className="relative pt-14 pb-10 sm:pt-24 sm:pb-16">
          {/* ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] max-w-[130%] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 38%, transparent), transparent)",
            }}
          />
          <Reveal>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <motion.div
                drag
                dragConstraints={{ left: -40, right: 40, top: -20, bottom: 20 }}
                dragElastic={0.4}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98, cursor: "grabbing" }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="group relative shrink-0 cursor-grab animate-float"
                title="Drag me"
              >
                <div
                  aria-hidden
                  className="absolute -inset-6 rounded-full opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 55%, transparent), transparent)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute -inset-[3px] rounded-full opacity-80 animate-gradient"
                  style={{
                    background:
                      "conic-gradient(from 0deg, color-mix(in oklab, var(--primary) 90%, transparent), transparent 35%, color-mix(in oklab, var(--primary) 70%, transparent) 70%, transparent)",
                  }}
                />
                <div className="relative h-28 w-28 overflow-hidden rounded-full border border-border bg-background ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/60 sm:h-32 sm:w-32">
                  <img
                    src={profileAsset.url}
                    alt="Aysha Mehek at a waterfall"
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
              </motion.div>
              <div className="min-w-0">
                <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">
                  Aysha <em className="text-primary">Mehek</em>
                </h1>
                <p className="mt-3 min-h-[1.75rem] font-mono-ui text-base text-muted-foreground sm:text-lg">
                  Aspiring <Typewriter />
                </p>
                <p className="mt-2 text-xs text-foreground/70">
                  Turning data into decisions
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Karnataka, India
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {[
                { href: "mailto:ayshamehek020@gmail.com", label: "Email", icon: <Mail className="h-4 w-4" /> },
                { href: "https://www.linkedin.com/in/aysha-mehek", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
                { href: "https://github.com/ayshamehek", label: "GitHub", icon: <Github className="h-4 w-4" /> },
              ].map((s, idx) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.35,
                  }}
                  whileHover={{ scale: 1.12, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary hover:shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                >
                  {s.icon}
                </motion.a>
              ))}

              <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Button
                  asChild
                  size="sm"
                  className="gap-1.5 shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--primary)_80%,transparent)]"
                >
                  <a
                    href="https://drive.google.com/uc?export=download&id=1mN0GdtJ8pMcXIBcajXt2ME5AJuf4Fld6"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Download Resume"
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="sm" variant="outline" className="gap-1.5">
                  <a href="#contact">
                    <Sparkles className="h-4 w-4" />
                    Get in touch
                  </a>
                </Button>
              </motion.div>
            </div>
          </Reveal>
        </section>

        {/* About */}
        <Section id="about" eyebrow="01 / About" title="Hello">
          <Reveal>
            <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
              <p>
                Hi, I'm Aysha — a BCA graduate with a real passion for data
                science, machine learning, and analytics. I'm currently a Data
                Science Intern at MSDC, Manipal, where I'm sharpening my skills
                in Python, SQL, data analysis, data visualization, and machine
                learning through hands-on, real-world projects.
              </p>
              <p>
                I love the moment when a messy dataset starts making sense — when
                a chart or a model quietly answers a question the business
                didn't know how to ask. I'm actively looking for opportunities
                as a <span className="text-foreground">Data Analyst</span> or{" "}
                <span className="text-foreground">Data Scientist</span>.
              </p>
            </div>
          </Reveal>
        </Section>

        {/* Experience */}
        <Section id="experience" eyebrow="02 / Experience" title="Where I've worked">
          <div className="space-y-4">
            <Reveal>
              <ExperienceCard
                role="Data Science Intern"
                company="Manipal Skill Development Center (MSDC)"
                location="Udupi"
                period="Jun 2026 — Aug 2026"
                bullets={[
                  "Learning Python, SQL, Machine Learning, Data Analysis and Data Visualization.",
                  "Working on real-world data science projects and analytics.",
                  "Building hands-on experience with NumPy, Pandas, Matplotlib, Power BI and Excel.",
                ]}
              />
            </Reveal>
          </div>
        </Section>

        {/* Projects */}
        <Section id="projects" eyebrow="03 / Projects" title="Selected work">
          <Reveal>
            <ProjectCardStack projects={PROJECTS} />
          </Reveal>
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <TiltCard>
                  <ProjectCard project={p} />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Skills */}
        <Section id="skills" eyebrow="04 / Skills" title="Stack">
          <div className="divide-y divide-border rounded-xl border border-border">
            {SKILLS.map((group, i) => (
              <Reveal key={group.label} delay={i * 0.05}>
                <div className="grid grid-cols-[minmax(0,1fr)] gap-3 px-4 py-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:px-5">
                  <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((it) => (
                      <Pill key={it}>{it}</Pill>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section
          id="activity"
          eyebrow="05 / Activity"
          title="Contribution graph"
        >
          <ActivityGraph
            theme={theme}
            accentHex={
              (ACCENTS.find((a) => a.name === accent) ?? ACCENTS[0]).swatch
            }
          />
        </Section>

        {/* Education */}
        <Section id="education" eyebrow="06 / Education" title="Education">
          <Reveal>
            <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    Beary's College of Education, Kodi, Kundapura
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mangalore University · Bachelor of Computer Applications
                    (BCA)
                  </p>
                </div>
                <span className="tabular text-xs text-muted-foreground">
                  2023 — 2026
                </span>
              </div>
            </div>
          </Reveal>
        </Section>

        {/* Contact */}
        <Section id="contact" eyebrow="07 / Contact" title="Let's connect">
          <Reveal>
            <p className="mb-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              I'm open to Data Analyst and Data Scientist roles, internships,
              and interesting collaborations. The fastest way to reach me is
              email.
            </p>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            <Reveal>
              <ContactRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value="ayshamehek020@gmail.com"
                href="mailto:ayshamehek020@gmail.com"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <ContactRow
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                value="linkedin.com/in/aysha-mehek"
                href="https://www.linkedin.com/in/aysha-mehek"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ContactRow
                icon={<Github className="h-4 w-4" />}
                label="GitHub"
                value="github.com/ayshamehek"
                href="https://github.com/ayshamehek"
              />
            </Reveal>
          </div>
        </Section>

        <footer className="border-t border-border py-8 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Designed & built by Aysha Mehek</span>
            <span className="tabular">© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function IconLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
    >
      {icon}
    </a>
  );
}

function ExperienceCard({
  role,
  company,
  location,
  period,
  bullets,
}: {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">{role}</h3>
          <p className="text-sm text-muted-foreground">
            {company} · <span className="text-foreground/70">{location}</span>
          </p>
        </div>
        <span className="tabular shrink-0 text-xs text-muted-foreground">
          {period}
        </span>
      </div>
      <ul className="mt-4 space-y-2 text-[14.5px] leading-relaxed text-foreground/80">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-primary/60" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof PROJECTS)[number];
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_30px_-12px_rgb(0_0_0/0.15)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground">{project.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground transition-colors group-hover:text-primary">
          <Github className="h-4 w-4" />
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
      <ul className="mt-4 flex-1 space-y-2 text-[14px] leading-relaxed text-foreground/80">
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-primary/60" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
    </a>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border text-muted-foreground group-hover:text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </div>
          <div className="truncate text-sm text-foreground">{value}</div>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </a>
  );
}