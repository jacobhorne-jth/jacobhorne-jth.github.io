import pfp from "./assets/pfp.png";
import sensLogo from "./assets/logos/senslogo.jpeg";
import ctcLogo from "./assets/logos/ctclogo.jpeg";
import ctLogo from "./assets/logos/caretechlogo.jpeg";
import bcLogo from "./assets/logos/blockchainlogo.jpeg";
import rfaLogo from "./assets/logos/rfalogo.jpeg";
import swLogo from "./assets/logos/swlogo.jpeg";
import slLogo from "./assets/logos/sllogo.png";
import dLogo from "./assets/logos/dlogo.png"
import hLogo from "./assets/logos/hlogo.jpeg"
import tnLogo from "./assets/logos/tnlogo.png"
import careLogo from "./assets/logos/carelogo.png"
import cosmosLogo from "./assets/logos/cosmoslogo.jpeg"
import cqLogo from "./assets/logos/cqlogo.png"

import ctcImage from "./assets/previews/ctcimage.png"
import caretechImage from "./assets/previews/caretechimage.png"
import blockchainImage from "./assets/previews/blockchainimage.png"
import sensImage from "./assets/previews/sensimage.png"
import cqImage from "./assets/previews/cqimage.png"
import careImage from "./assets/previews/CAREIMAGE.png"

import dlImage from "./assets/previews/dlimage.png"
import handshakeImage from "./assets/previews/handshakeImage.png"
import cosmosImage from "./assets/previews/cosmosimage.png"
import thinkneuroImage from "./assets/previews/thingneuroimage.png"

import rfaImage from "./assets/previews/rfaimage.png"
import slImage from "./assets/previews/slimage.png"
import swImage from "./assets/previews/shimage.png"
import pecsImage from "./assets/previews/pecsimage.png"


import onboardingImg from "./assets/projects/onbaoardingreal.png";
import spamImg from "./assets/projects/sms.png";
import websiteImg from "./assets/projects/website.png";
import aiImg from "./assets/projects/ai-data.png";
import customerImg from "./assets/projects/customer.png";
import crimeImg from "./assets/projects/JacobHorneCrimeMap.png";
import todoImg from "./assets/projects/todo.png";
import encrpyImg from "./assets/projects/ncrypt.png";



const NavLink = ({ label, href }: { label: string; href: string }) => (
  <a href={href} className="text-2xl text-neutral-200/80 hover:text-white transition">
    {label}
  </a>
);

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-2">
      {/* was text-5xl */}
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle ? (
        /* was text-lg */
        <p className="text-neutral-200/70 text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}

type Experience = {
  role: string;
  org: string;
  desc: string;
  timeline: string;

  logoText?: string;
  logoSrc?: string;

  imageSrc?: string;
  imageAlt?: string;

  siteUrl?: string;       // NEW: website / project link
  siteLabel?: string;     // NEW: button text (optional)
};


function ExperienceCard({ item }: { item: Experience }) {
  return (
    <div className="rounded-2xl border border-neutral-700 bg-neutral-950/40 p-6
                transition-all duration-200 ease-out
                hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-950/40
                hover:border-neutral-500">
      {/* was gap-10 + larger column ratio */}
      <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_1.25fr]">
        {/* LEFT */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {item.logoSrc ? (
              <img
                src={item.logoSrc}
                alt={`${item.org} logo`}
                className="h-12 w-12 rounded-full object-cover border border-neutral-800"
              />
            ) : (
              <div className="h-12 w-12 rounded-full border border-neutral-800 bg-neutral-900/50 grid place-items-center">
                <span className="text-sm font-semibold text-neutral-100">
                  {item.logoText ?? "◎"}
                </span>
              </div>
            )}
          </div>

          {/* Role + Org */}
          <div className="mt-5 space-y-1.5">
            {/* was text-3xl md:text-4xl */}
            <h3 className="text-3xl font-bold leading-tight">{item.role}</h3>
            {/* was text-lg md:text-xl */}
            <p className="text-lg text-neutral-200/60">{item.org}</p>
          </div>

          {/* Description */}
          {/* was text-base md:text-lg */}
          <p className="mt-4 text-base leading-relaxed text-neutral-200/85">
            {item.desc}
          </p>

          {/* Timeline */}
          {/* was pt-10 text-lg */}
          <p className="mt-auto pt-8 text-base text-neutral-200/40">
            {item.timeline}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30">
            {item.imageSrc ? (
              item.siteUrl ? (
                <a href={item.siteUrl} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt ?? `${item.org} preview`}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </a>

              ) : (
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt ?? `${item.org} preview`}
                  className="aspect-[16/9] w-full object-cover"
                />
              )
            ) : item.siteUrl ? (
              <a
                href={item.siteUrl}
                target="_blank"
                rel="noreferrer"
                className="aspect-[16/9] grid place-items-center hover:bg-neutral-900/50 transition"
              >
                <div className="text-center space-y-2">
                  <div className="text-neutral-200/80 text-lg font-semibold">
                    {item.siteLabel ?? "Visit site"}
                  </div>
                  <div className="text-neutral-200/50 text-sm">{item.siteUrl}</div>
                </div>
              </a>
            ) : (
              <div className="aspect-[16/9] grid place-items-center text-neutral-200/40">
                Add screenshot / photo
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


type Project = {
  name: string;
  desc: string;
  tags: string[];

  imageSrc?: string;
  imageAlt?: string;

  demoUrl?: string;
  repoUrl?: string;

  badge?: string; // e.g., "Featured", "Case Study", "In Progress"
};

function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-neutral-800 bg-neutral-900/40 px-3 py-1 text-sm text-neutral-200/80">
      {label}
    </span>
  );
}

function ProjectCard({ item }: { item: Project }) {
  const primaryUrl = item.repoUrl ?? item.demoUrl;

  const isInternalHash = primaryUrl?.startsWith("#");

  const CardInner = (
    <div
      className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5
                 transition-all duration-200 ease-out
                 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-950/40
                 hover:border-neutral-600"
    >
      {/* IMAGE */}
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.imageAlt ?? `${item.name} preview`}
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <div className="aspect-[16/10] grid place-items-center text-neutral-200/40">
            Add project screenshot
          </div>
        )}
      </div>

      {/* TITLE + BADGE */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold leading-tight">{item.name}</h3>

        {item.badge ? (
          <div className="shrink-0 inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-xs text-neutral-200/70">
            {item.badge}
          </div>
        ) : null}
      </div>

      {/* DESC */}
      <p className="mt-2 text-sm leading-relaxed text-neutral-200/75">
        {item.desc}
      </p>

      {/* TAGS */}
      <div className="mt-3 flex flex-wrap gap-2">
        {item.tags.map((t) => (
          <TagPill key={item.name + t} label={t} />
        ))}
      </div>
    </div>
  );

  // If it has a repo or demo URL, wrap whole card with link
  if (!primaryUrl) return CardInner;

  return (
    <a
      href={primaryUrl}
      className="block cursor-pointer rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-500"
      target={isInternalHash ? undefined : "_blank"}
      rel={isInternalHash ? undefined : "noreferrer"}
    >
      {CardInner}
    </a>
  );
}


// Example data (edit tags/links/images to match your actual repos)
const projects: Project[] = [
  {
    name: "GitHub Onboarding Agent",
    desc: "AI assistant that helps new contributors understand a repository via structured Q&A, codebase retrieval, and onboarding guidance.",
    tags: ["LangChain/LangGraph", "RAG", "FastAPI", "Hugging Face", "Vector DB"],
    imageSrc: onboardingImg,
    // demoUrl: "https://...",
    repoUrl: "https://github.com/jacobhorne-jth/github-onboarding-agent",
  },
  {
    name: "This website",
    desc: "Simple portfolio website design with cards for experiences and projects as well as other information about me.",
    tags: ["Typescript", "React", "Tailwind CSS", "Vite"],
    imageSrc: websiteImg,
    demoUrl: "#top",
  },
  {
    name: "SMS Spam Detector",
    desc: "Classifies SMS messages as spam/ham using classic NLP features and a lightweight classifier pipeline.",
    tags: ["Python", "NLP", "TF-IDF", "scikit-learn", "React"],
    imageSrc: spamImg,
    repoUrl: "https://github.com/jacobhorne-jth/sms-spam-detector",
  },
  {
    name: "SF Crime Mapper",
    desc: "Interactive map + analytics for SF incidents, filtering by time, category, and neighborhood with fast queries.",
    tags: ["Python", "APIs", "MySQL", "Mapbox", "React"],
    imageSrc: crimeImg,
    repoUrl: "https://github.com/jacobhorne-jth/sf-crime-mapper",
  },
  {
    name: "Encrypted Chat App",
    desc: "Real-time WebSocket chat with RSA key exchange + AES message encryption and authenticated sessions.",
    tags: ["FastAPI", "WebSockets", "RSA/AES", "React", "Security"],
    imageSrc: encrpyImg,
    repoUrl: "https://github.com/jacobhorne-jth/encrypted-chat-app",
  },
  {
    name: "Customer LTV + Churn Estimator",
    desc: "End-to-end analytics pipeline + prediction models to estimate churn risk and customer lifetime value.",
    tags: ["SQL", "Python", "Classifiers", "Regression", "Models"],
    imageSrc: customerImg,
    repoUrl: "https://github.com/jacobhorne-jth/customer-ltv-estimator",
  },
  {
    name: "AI Data Cleaning Assistant",
    desc: "Upload any CSV, auto-clean, and visualize before/after differences (with an embedded Tableau Public view).",
    tags: ["Streamlit", "Python", "Pandas", "Tableau", "OpenAI API"],
    imageSrc: aiImg,
    repoUrl: "https://github.com/jacobhorne-jth/ai-data-cleaning-assistant",
  },
  {
    name: "Collaborative Todo App",
    desc: "Multi-user task app with reusable Task entities, permissions, and clean UX for shared productivity.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Auth"],
    imageSrc: todoImg,
    repoUrl: "https://github.com/jacobhorne-jth/todo-technical-task-improvements",
  },
];

const building: Experience[] = [
  {
    role: "Software Development Intern",
    org: "SENS Psychology",
    desc: "Engineering a full-stack Next.js/Node.js workflow automation platform with Prisma and PostgreSQL to streamline patient intake, call routing, and task management for a 30+ member front-desk team, while automating Azure-based notifications that cut manual email workload by 60%.",
    timeline: "September 2025 — Present",
    siteUrl: "https://modernsens.com/",
    imageSrc: sensImage,
    logoSrc: sensLogo,
  },
  {
    role: "Software Developer",
    org: "CareTech at UCI",
    desc: "Building a full-stack nutrition app that uses YOLO-based real-time meal scanning with a Next.js and FastAPI/Supabase stack to log foods, compute a dynamic health score, and deliver personalized dietary and cognitive-health recommendations with weekly insights for Alzheimer's prevention.",
    timeline: "October 2025 — Present",
    logoSrc: ctLogo,
    siteUrl: "https://caretechuci.vercel.app/",
    imageSrc: caretechImage,
  },
  {
    role: "Full-Stack Developer",
    org: "Commit the Change",
    desc: "Building a full-stack appointment-management platform for Celebrating Life Community Health Center, centralizing daily provider quotas, real-time progress tracking, role-based permissions, and version-logged updates to replace their manual scheduling workflow and improve call-center efficiency.",
    timeline: "October 2025 — Present",
    logoSrc: ctcLogo,
    siteUrl: "https://ctc-uci.com/",
    imageSrc: ctcImage,
  },
  {
    role: "Technical Developer",
    org: "Blockchain @ UCI",
    desc: "Building Agonus, an AI-powered crypto trading tournament platform, developing the backend agent system and full-stack infrastructure that enables autonomous trading agents to execute strategies, post updates, and compete on-chain in real-time.",
    timeline: "October 2025 — Present",
    logoSrc: bcLogo,
    siteUrl: "https://www.blockchainuci.org/",
    imageSrc: blockchainImage,
  },
  {
    role: "Software Engineer Intern",
    org: "CrowdQuant",
    desc: "Worked on developing a full-stack crowdsourced quantitative-trading platform that enables users to train, deploy, and ensemble custom machine-learning models, producing high-precision and multi-asset market forecasts.",
    timeline: "June 2025 — August 2025",
    logoSrc: cqLogo,
    imageSrc: cqImage,
  },
  {
    role: "Software Lead",
    org: "CARE Initiative",
    desc: "Led development of a wrist-worn embedded systems device alongside a React Native companion app that provides bilateral stimulation therapy, improving user support during panic attacks.",
    timeline: "September 2021 — August 2024",
    logoSrc: careLogo,
    imageSrc: careImage,
  },
];

const researching: Experience[] = [
  {
    role: "Research Assistant",
    org: "UCI Digital Learning Lab",
    desc: "Developing multi-agent LLM systems and conducting NLP/ML research on PapyrusAI data through data-driven evaluation, model improvements, and core infrastructure.",
    timeline: "December 2025 — Present",
    logoSrc: dLogo,
    siteUrl: "https://www.genaied.org/",
    imageSrc: dlImage,
  },
  {
    role: "AI Research Intern",
    org: "Think Neuro",
    desc: "Analyzed AI/ML applications in brain–computer interfaces by conducting large-scale bibliometric reviews, building R-based visualizations, and uncovering trends in neuroimaging and neural-decoding research.",
    timeline: "September 2024 — Janurary 2025",
    logoSrc: tnLogo,
    siteUrl: "https://thinkneuro.org/",
    imageSrc: thinkneuroImage,
  },
  {
    role: "AI Model Validation Expert",
    org: "Handshake",
    desc: "Validating large language model outputs and optimized data-labeling workflows to ensure model reliability, accuracy, and safety in production-ready AI systems.",
    timeline: "September 2025 — Present",
    logoSrc: hLogo,
    siteUrl: "https://joinhandshake.com/fellowship-program",
    imageSrc: handshakeImage,
  },
  {
    role: "Student Researcher",
    org: "UCSD COSMOS Cluster 13: Video Game Programming and Game AI Design",
    desc: "Researched AI-driven game design and computational modeling, implementing C# simulations and AI-state machines in Unity to create video games.",
    timeline: "July 2023 — August 2023",
    logoSrc: cosmosLogo,
    siteUrl: "https://jacobsschool.ucsd.edu/cosmos",
    imageSrc: cosmosImage,
  },
];

const teaching: Experience[] = [
  {
    role: "Lead Instructor",
    org: "Robotics for All",
    desc: "Led robotics and coding instruction for classes of 30+ middle school students, designing hands-on curriculum in Python and Java to grow technical confidence and STEM accessibility.",
    timeline: "January 2023 — December 2024",
    logoSrc: rfaLogo,
    siteUrl: "https://www.roboticsforall.net/",
    imageSrc: rfaImage,
  },
  {
    role: "Cybersecurity Instructor",
    org: "PECS",
    desc: "Hosted bi-monthly workshops at local senior centers, covering topics such as password management, phishing and scam detection, safe browsing, device updates, and privacy settings.",
    timeline: "September 2023 — June 2024",
    logoText: "PECS",
    imageSrc: pecsImage,
  },
  {
    role: "Tutor",
    org: "Schoolhouse.world",
    desc: "Led SAT bootcamps and delivered one-on-one instruction in computer science fundamentals (Python, Java, data structures & algorithms), mathematics (Algebra–Calculus), and physics, adapting lessons to individual learning styles.",
    timeline: "August 2022 — June 2023",
    logoSrc: swLogo,
    siteUrl: "https://schoolhouse.world/?utm_source=adwords&utm_medium=cpc&utm_campaign=Schoolhouse_Google_Grants_Search_Acquisition_Brand_US&ref=Schoolhouse_Google_Grants_Search_Brand_Acquisition_US&gad_source=1&gad_campaignid=14184123074&gbraid=0AAAAABOGcl0Ocwi1qWMGlYeeqktvbUoWS&gclid=CjwKCAiAjc7KBhBvEiwAE2BDOad63uNrMt6_dYBQ3WLo8S24i5pj-MIDgDzPoMjW3RYVOa64vtQn7hoC_2IQAvD_BwE",
    imageSrc: swImage,
  },
  {
    role: "Java & Python Mentor",
    org: "STEM League",
    desc: "Mentored students in Python and Java fundamentals through personalized instruction, helping them build strong problem-solving and programming foundations.",
    timeline: "June 2022 — August 2022",
    logoSrc: slLogo,
    siteUrl: "https://www.stemleagueacademy.com/",
    imageSrc: slImage,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Top nav (sticky) */}
      <div className="sticky top-0 z-50 bg-neutral-950/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-10 py-6">
          {/* was py-8 */}
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            <NavLink label="about" href="#info" />
            <NavLink label="experience" href="#building" />
            <NavLink label="research" href="#researching" />
            <NavLink label="teaching" href="#teaching" />
            <NavLink label="projects" href="#projects" />
            <NavLink label="hobbies" href="#hobbies" />
            <NavLink label="contact" href="#contact" />
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="text-2xl text-neutral-200/80 hover:text-white transition">
              resume
            </a>
          </nav>
        </div>
      </div>

      {/* HERO */}
      <main className="mx-auto max-w-7xl px-10">
        <section id = "top" className="min-h-[calc(100vh-140px)] flex items-center justify-center">
          <div className="w-full max-w-5xl grid items-center gap-10 md:grid-cols-2">

            <div className="space-y-4">
              <p className="text-2xl text-white">Hello! I am</p>
              <h1 className="text-7xl font-bold tracking-tight leading-none">Jacob Horne.</h1>
              <p className="max-w-md text-sm md:text-base text-neutral-200/80 leading-relaxed">
                I build, research, and teach technology and systems to solve problems and help people.
              </p>
            </div>

            <div className="flex justify-center md:justify-center">
              <div className="relative">
                <img
                  src={pfp}
                  alt="Jacob Horne"
                  className="h-72 w-72 md:h-88 md:w-88 rounded-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-neutral-200/20" />
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="info" className="py-20 scroll-mt-0">
          {/* was py-28 */}
          <div className="mx-auto max-w-6xl space-y-8">
            <SectionTitle
              title="About Me"
            />
            {/* was text-lg */}
            <p className="text-base md:text-lg text-neutral-200/80 leading-relaxed">
              I was first introduced to computer science in 8th grade when I signed up for an elective
              called Computer Science Discoveries simply because I didn’t want to take the other option,
              Music Appreciation. What started as a convenient choice quickly turned into fascination —
              seeing single lines of code, meaningless on their own, come together to form complex projects
              and systems made me realize how powerful software could be. Throughout high school, that
              fascination evolved into a desire to use this ability to create something out of nothing to
              help others and solve real problems. Today, I’m focused on building systems, exploring applied
              AI, and teaching and mentoring others, and I’m looking for roles where I can make meaningful,
              real-world impact through technology.
            </p>
          </div>
        </section>

        {/* BUILDING */}
        <section id="building" className="py-20 scroll-mt-0">
          <div className="mx-auto max-w-6xl space-y-8">
            <SectionTitle
              title="Experience"
              subtitle="Software roles where I shipped products and systems."
            />
            {/* was gap-10 */}
            <div className="grid gap-8">
              {building.map((item) => (
                <ExperienceCard key={item.role + item.org} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* RESEARCHING */}
        <section id="researching" className="py-20 scroll-mt-0">
          <div className="mx-auto max-w-6xl space-y-8">
            <SectionTitle
              title="Research"
              subtitle="Research and evaluation work in AI + learning."
            />
            <div className="grid gap-8">
              {researching.map((item) => (
                <ExperienceCard key={item.role + item.org} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* TEACHING */}
        <section id="teaching" className="py-20 scroll-mt-0">
          <div className="mx-auto max-w-6xl space-y-8">
            <SectionTitle
              title="Teaching"
              subtitle="Mentoring + instruction in robotics and cybersecurity."
            />
            <div className="grid gap-8">
              {teaching.map((item) => (
                <ExperienceCard key={item.role + item.org} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-20 scroll-mt-0">
          <div className="mx-auto max-w-6xl space-y-8">
            <SectionTitle title="Projects" subtitle="Featured personal projects." />
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.name} item={p} />
              ))}
            </div>
          </div>
        </section>

        

        {/* HOBBIES */}
        <section id="hobbies" className="py-20 scroll-mt-0">
          <div className="mx-auto max-w-6xl space-y-8">
            <SectionTitle title="Hobbies" subtitle="Things I enjoy doing outside of coding and building." />
            <p className="text-base md:text-lg text-neutral-200/80 leading-relaxed">
              Outside of programming, building, and developing, I enjoy reading, cooking 
              and being active. I enjoy playing basketball, playing baseball, and going to the gym.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 scroll-mt-0">
          <div className="mx-auto max-w-6xl space-y-8">
            <SectionTitle title="Contact Me" subtitle="Let’s connect." />
            <div className="flex flex-wrap gap-6 text-lg">
              <a className="underline text-neutral-200/80 hover:text-white" href="mailto:jacobhorne.jth@gmail.com">
                email
              </a>
              <a className="underline text-neutral-200/80 hover:text-white" href="https://github.com/jacobhorne-jth">
                github
              </a>
              <a className="underline text-neutral-200/80 hover:text-white" href="https://linkedin.com/in/jacobhornejth">
                linkedin
              </a>
            </div>
          </div>
        </section>

        <div className="h-24" />
      </main>
    </div>
  );
}
