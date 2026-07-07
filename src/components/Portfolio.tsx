import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  MapPin,
  Download,
  Moon,
  Sun,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import avatarAsset from "@/assets/avatar.jpg.asset.json";

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
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
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

export default function Portfolio() {
  const { theme, toggle } = useTheme();
  const active = useScrollSpy(NAV.map((n) => n.id));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active === n.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1">
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
        <section className="pt-14 pb-8 sm:pt-24 sm:pb-12">
          <Reveal>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="group relative shrink-0"
              >
                <div className="absolute -inset-1 rounded-full bg-primary/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-border ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/40 sm:h-28 sm:w-28">
                  <img
                    src={avatarAsset.url}
                    alt="Aysha Mehek"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Aysha Mehek
                </h1>
                <p className="mt-1 text-base text-muted-foreground sm:text-lg">
                  Aspiring Data Analyst & Data Scientist
                </p>
                <p className="mt-2 text-sm text-foreground/80">
                  Turning data into decisions.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Karnataka, India
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <IconLink
                href="mailto:ayshamehek020@gmail.com"
                label="Email"
                icon={<Mail className="h-4 w-4" />}
              />
              <IconLink
                href="https://www.linkedin.com/in/aysha-mehek"
                label="LinkedIn"
                icon={<Linkedin className="h-4 w-4" />}
              />
              <IconLink
                href="https://github.com/ayshamehek"
                label="GitHub"
                icon={<Github className="h-4 w-4" />}
              />
              <IconLink
                href="tel:+919591944942"
                label="Phone"
                icon={<Phone className="h-4 w-4" />}
              />
              <Button asChild size="sm" className="ml-1 gap-1.5">
                <a href="#" aria-label="Download Resume">
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </Button>
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
          <div className="grid gap-4 sm:grid-cols-2">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <ProjectCard project={p} />
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
        <Section id="education" eyebrow="05 / Education" title="Education">
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
        <Section id="contact" eyebrow="06 / Contact" title="Let's connect">
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
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value="+91 95919 44942"
                href="tel:+919591944942"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ContactRow
                icon={<Linkedin className="h-4 w-4" />}
                label="LinkedIn"
                value="linkedin.com/in/aysha-mehek"
                href="https://www.linkedin.com/in/aysha-mehek"
              />
            </Reveal>
            <Reveal delay={0.15}>
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