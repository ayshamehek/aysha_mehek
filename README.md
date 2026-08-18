# Aysha's Digital Canvas

Build me a single-page personal portfolio website. The aesthetic and interaction style should be inspired by chanhdai.com — a minimal, modern "developer portfolio" feel: lots of whitespace, subtle borders instead of heavy shadows, small pill-shaped tags for tech stacks, a clean sans-serif font (use "Inter" or "Geist"), tabular/monospace numerals for dates, and a light/dark mode toggle. Do not copy any of that site's actual content — only the layout structure, spacing rhythm, and motion feel. Fill everything with the real content below (do not invent achievements, numbers, or testimonials that aren't provided).

Tech requirements


React + TypeScript + Tailwind CSS + shadcn/ui components
Framer Motion for scroll-reveal and hover micro-interactions
lucide-react for icons
Fully responsive (mobile-first, then tablet/desktop breakpoints)
Light/dark mode toggle in the nav, persisted across reloads, defaulting to system preference
Smooth-scroll single page with a sticky top nav that links to each section (About, Experience, Projects, Skills, Education, Contact)
SEO basics: page title "Aysha Mehek — Data Analyst & Data Scientist", meta description using the summary below


Color & type direction


Neutral base (near-white / near-black backgrounds that flip in dark mode), one accent color: a muted indigo or teal (data/tech feel) used sparingly for links, active nav state, and button fills
Generous section padding (~96–128px vertical on desktop, ~48px on mobile)
Card borders: 1px hairline, subtle radius (rounded-xl), no heavy drop shadows — hover states lift with a soft shadow + 2–4px translate-y


1. Hero section


Large avatar placeholder (circular, with a subtle hover effect — scale or glow ring on hover)
Name: Aysha Mehek
Role line: "Aspiring Data Analyst & Data Scientist"
One-line tagline under the name: "Turning data into decisions."
Location: Karnataka, India
Row of icon links: Email, LinkedIn, GitHub, Phone (use the real values below)
Small "Download Resume" button (link placeholder for now)


2. About / Hello section

Use this as the base copy, lightly adapted into a first-person paragraph (don't just paste verbatim, make it read naturally as "Hi, I'm Aysha…"):


BCA graduate passionate about Data Science, Machine Learning and Analytics. Currently working as a Data Science Intern at MSDC, Manipal, building practical skills in Python, SQL, Data Analysis, Data Visualization and Machine Learning through real-world projects. Seeking opportunities as a Data Analyst or Data Scientist.



3. Skills / Stack section

Group these into labeled columns or rows exactly like this, each item as a small pill/badge:


Languages: Python, JavaScript, HTML, CSS
Frameworks: React.js, Node.js, Express.js
Libraries: Scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, TanStack Query
Databases: MongoDB, SQL
Tools: Git, GitHub, Power BI, Microsoft Excel


4. Experience section (timeline style, like chanhdai's Experience block)

Manipal Skill Development Center (MSDC) — Udupi
Role: Data Science Intern
Period: June 2026 – August 2026


Learning Python, SQL, Machine Learning, Data Analysis and Data Visualization
Working on real-world data science projects and analytics
Building hands-on experience with NumPy, Pandas, Matplotlib, Power BI and Excel


5. Projects section (2 project cards, each with title, description bullets, and a tag row of technologies used; add a GitHub icon link placeholder on each card)

Card 1 — Expensify (MERN Stack Expense Tracker & Analytics Platform)


Engineered a responsive full-stack expense management platform using MongoDB, Express.js, React.js and Node.js with JWT authentication
Optimized performance using TanStack Query and server-side pagination
Built automated monthly/yearly CSV reports with Cloudinary integration and download history
Implemented secure password reset using Nodemailer
Tags: MongoDB, Express.js, React.js, Node.js, JWT, TanStack Query, Cloudinary


Card 2 — Customer Churn Prediction Using Machine Learning


Developed a customer churn prediction model using Logistic Regression and Random Forest to identify customers likely to leave
Performed data preprocessing, feature engineering, and class imbalance handling using Pandas and Imbalanced-learn
Trained and evaluated machine learning models using Scikit-learn, achieving improved prediction performance through hyperparameter tuning
Visualized feature importance and model insights using Seaborn to identify key factors influencing customer churn
Tags: Python, Scikit-learn, Pandas, Imbalanced-learn, Seaborn, Logistic Regression, Random Forest


6. Education section

Beary's College of Education, Kodi, Kundapura — Mangalore University
Bachelor of Computer Applications (BCA)
2023 – 2026

7. Contact / Footer section


Heading: "Let's connect" or "Get in touch"
Show and link: Email, Phone, LinkedIn, GitHub
Real values to use:

Email: ayshamehek020@gmail.com
Phone: +91 9591944942
LinkedIn: https://www.linkedin.com/in/aysha-mehek
GitHub: https://github.com/ayshamehek



Simple footer line: "Designed & built by Aysha Mehek"


Interactions & polish


Sections fade/slide in on scroll (Framer Motion, staggered for lists like skills/projects)
Project and experience cards lift slightly on hover
Nav bar highlights the active section as you scroll (scroll-spy)
Mobile: nav collapses into a simple menu; sections stack full-width with reduced padding
Keep animations subtle and fast (150–300ms) — this should feel clean and fast, not flashy

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ayshamehek.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe383af3-d8b9-422c-96d3-6c2e56890b48).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
