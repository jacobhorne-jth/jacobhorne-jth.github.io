import { useState, useRef, useEffect } from "react";
import pfp from "./assets/pfp.png";
import sensLogo from "./assets/logos/senslogo.jpeg";
import ctcLogo from "./assets/logos/ctclogo.jpeg";
import ctLogo from "./assets/logos/caretechlogo.jpeg";
import bcLogo from "./assets/logos/blockchainlogo.jpeg";
import rfaLogo from "./assets/logos/rfalogo.jpeg";
import swLogo from "./assets/logos/swlogo.jpeg";
import slLogo from "./assets/logos/sllogo.png";
import dLogo from "./assets/logos/dlogo.png";
import hLogo from "./assets/logos/hlogo.jpeg";
import tnLogo from "./assets/logos/tnlogo.png";
import careLogo from "./assets/logos/carelogo.png";
import cosmosLogo from "./assets/logos/cosmoslogo.jpeg";
import cqLogo from "./assets/logos/cqlogo.png";

import ctcImage from "./assets/previews/ctcimage.png";
import caretechImage from "./assets/previews/caretechimage.png";
import blockchainImage from "./assets/previews/blockchainimage.png";
import sensImage from "./assets/previews/sensimage.png";
import cqImage from "./assets/previews/cqimage.png";
import careImage from "./assets/previews/CAREIMAGE.png";

import dlImage from "./assets/previews/dlimage.png";
import handshakeImage from "./assets/previews/handshakeImage.png";
import cosmosImage from "./assets/previews/cosmosimage.png";
import thinkneuroImage from "./assets/previews/thingneuroimage.png";

import rfaImage from "./assets/previews/rfaimage.png";
import slImage from "./assets/previews/slimage.png";
import swImage from "./assets/previews/shimage.png";
import pecsImage from "./assets/previews/pecsimage.png";

import onboardingImg from "./assets/projects/onbaoardingreal.png";
import spamImg from "./assets/projects/sms.png";
import websiteImg from "./assets/projects/website.png";
import aiImg from "./assets/projects/ai-data.png";
import customerImg from "./assets/projects/customer.png";
import crimeImg from "./assets/projects/JacobHorneCrimeMap.png";
import todoImg from "./assets/projects/todo.png";
import encrpyImg from "./assets/projects/ncrypt.png";

// ─── Terminal ────────────────────────────────────────────────────────────────

type TerminalLine =
  | { type: "input"; text: string }
  | { type: "output"; text: string }
  | { type: "blank" };

const HELP_TEXT: TerminalLine[] = [
  { type: "output", text: "" },
  { type: "output", text: "Available commands:" },
  { type: "output", text: "  help / ?        — show this menu" },
  { type: "output", text: "  about           — scroll to about" },
  { type: "output", text: "  experience      — scroll to experience" },
  { type: "output", text: "  research        — scroll to research" },
  { type: "output", text: "  projects        — scroll to projects" },
  { type: "output", text: "  contact         — scroll to contact" },
  { type: "output", text: "  github          — open GitHub profile" },
  { type: "output", text: "  linkedin        — open LinkedIn profile" },
  { type: "output", text: "  resume          — open resume PDF" },
  { type: "output", text: "  email           — show email address" },
  { type: "output", text: "  whoami          — info about Jacob" },
  { type: "output", text: "  ls              — list all sections" },
  { type: "output", text: "  clear           — clear terminal" },
  { type: "output", text: "  exit            — close terminal" },
  { type: "blank" },
];

function Terminal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: "jacob-portfolio v1.0.0" },
    { type: "output", text: 'Type "help" or "?" for a list of commands.' },
    { type: "blank" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollTo = (id: string) => {
    onClose();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const processCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: TerminalLine[] = [{ type: "input", text: raw }];

    switch (cmd) {
      case "help":
      case "?":
        out.push(...HELP_TEXT);
        break;
      case "about":
        scrollTo("info"); return;
      case "experience":
        scrollTo("building"); return;
      case "research":
        scrollTo("researching"); return;
      case "projects":
        scrollTo("projects"); return;
      case "contact":
        scrollTo("contact"); return;
      case "github":
        window.open("https://github.com/jacobhorne-jth", "_blank");
        out.push({ type: "output", text: "Opening GitHub..." }, { type: "blank" });
        break;
      case "linkedin":
        window.open("https://linkedin.com/in/jacobhornejth", "_blank");
        out.push({ type: "output", text: "Opening LinkedIn..." }, { type: "blank" });
        break;
      case "resume":
        window.open("/resume.pdf", "_blank");
        out.push({ type: "output", text: "Opening resume..." }, { type: "blank" });
        break;
      case "email":
        out.push({ type: "output", text: "jacobhorne.jth@gmail.com" }, { type: "blank" });
        break;
      case "whoami":
        out.push(
          { type: "output", text: "Jacob Horne" },
          { type: "output", text: "Software Engineer · Researcher · Instructor" },
          { type: "output", text: "UCI Computer Science" },
          { type: "blank" },
        );
        break;
      case "ls":
        out.push(
          { type: "output", text: "about/  experience/  research/  teaching/  projects/  hobbies/  contact/" },
          { type: "blank" },
        );
        break;
      case "clear":
        setLines([]);
        setCmdHistory(prev => raw ? [raw, ...prev] : prev);
        setHistoryIdx(-1);
        setInput("");
        return;
      case "exit":
      case "quit":
      case "close":
        onClose();
        return;
      case "sudo":
        out.push({ type: "output", text: "Permission denied. Nice try." }, { type: "blank" });
        break;
      case "hire me":
        window.open("https://linkedin.com/in/jacobhornejth", "_blank");
        out.push({ type: "output", text: "Redirecting to LinkedIn... 👀" }, { type: "blank" });
        break;
      case "":
        break;
      default:
        out.push({ type: "output", text: `command not found: ${cmd}` }, { type: "blank" });
    }

    setLines(prev => [...prev, ...out]);
    if (raw.trim()) setCmdHistory(prev => [raw, ...prev]);
    setHistoryIdx(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 rounded-xl overflow-hidden shadow-2xl border border-neutral-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3">
          <button
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400 transition"
          />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="mx-auto text-xs text-neutral-400 font-mono">
            visitor@jacob-horne — bash
          </span>
        </div>
        <div
          className="bg-[#0d1117] h-96 overflow-y-auto p-4 font-mono text-sm cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => {
            if (line.type === "blank") return <div key={i} className="h-3" />;
            if (line.type === "input")
              return (
                <div key={i} className="flex gap-2 leading-5">
                  <span className="text-green-500 select-none shrink-0">visitor@jacob-horne:~$</span>
                  <span className="text-green-300">{line.text}</span>
                </div>
              );
            return (
              <div key={i} className="text-green-300/75 pl-2 leading-5">
                {line.text}
              </div>
            );
          })}
          <div className="flex gap-2 items-center leading-5 mt-0.5">
            <span className="text-green-500 select-none shrink-0">visitor@jacob-horne:~$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none flex-1 text-green-300 caret-green-400"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

// ─── UI primitives ───────────────────────────────────────────────────────────

const NavLink = ({ label, href }: { label: string; href: string }) => (
  <a
    href={href}
    className="relative text-sm text-neutral-400 hover:text-white transition-colors duration-200 group"
  >
    {label}
    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
  </a>
);

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 rounded-full bg-violet-500 shrink-0" />
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-neutral-500 text-sm pl-4">{subtitle}</p>
      )}
    </div>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-2.5 py-0.5 text-xs text-neutral-400">
      {label}
    </span>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Experience = {
  role: string;
  org: string;
  desc: string;
  timeline: string;
  logoText?: string;
  logoSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
  siteUrl?: string;
  siteLabel?: string;
};

type Project = {
  name: string;
  desc: string;
  tags: string[];
  imageSrc?: string;
  imageAlt?: string;
  demoUrl?: string;
  repoUrl?: string;
  badge?: string;
};

// ─── Cards ───────────────────────────────────────────────────────────────────

function ExperienceCard({ item }: { item: Experience }) {
  const imageEl = item.imageSrc ? (
    <img
      src={item.imageSrc}
      alt={item.imageAlt ?? `${item.org} preview`}
      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  ) : (
    <div className="aspect-[16/9] grid place-items-center text-neutral-600 text-sm">
      No preview
    </div>
  );

  return (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900/20 p-6
                    hover:border-violet-500/25 hover:bg-neutral-900/40
                    transition-all duration-300">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] items-start">
        {/* LEFT */}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3">
            {item.logoSrc ? (
              <img
                src={item.logoSrc}
                alt={`${item.org} logo`}
                className="h-10 w-10 rounded-xl object-cover border border-neutral-800 shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl border border-neutral-800 bg-neutral-900 grid place-items-center shrink-0">
                <span className="text-xs font-semibold text-neutral-300">
                  {item.logoText ?? "◎"}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white leading-tight">{item.role}</h3>
              <p className="text-sm text-neutral-500">{item.org}</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-neutral-300/80 flex-1">
            {item.desc}
          </p>

          <p className="mt-5 text-xs font-mono text-neutral-600">
            {item.timeline}
          </p>
        </div>

        {/* RIGHT */}
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40">
          {item.siteUrl ? (
            <a href={item.siteUrl} target="_blank" rel="noreferrer" className="block overflow-hidden">
              {imageEl}
            </a>
          ) : imageEl}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ item }: { item: Project }) {
  const primaryUrl = item.repoUrl ?? item.demoUrl;
  const isInternalHash = primaryUrl?.startsWith("#");

  const inner = (
    <div className="group rounded-2xl border border-neutral-800 bg-neutral-900/20 overflow-hidden
                    hover:border-violet-500/25 hover:bg-neutral-900/40
                    transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.imageAlt ?? `${item.name} preview`}
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-[16/10] grid place-items-center text-neutral-600 text-sm bg-neutral-900/50">
            No preview
          </div>
        )}
        {item.badge && (
          <div className="absolute top-3 right-3 rounded-full border border-violet-500/40 bg-violet-950/70 px-2.5 py-1 text-xs text-violet-300 backdrop-blur-sm">
            {item.badge}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-white leading-tight">{item.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-400 flex-1">
          {item.desc}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map(t => <TagPill key={item.name + t} label={t} />)}
        </div>
      </div>
    </div>
  );

  if (!primaryUrl) return inner;

  return (
    <a
      href={primaryUrl}
      className="block focus:outline-none focus:ring-2 focus:ring-violet-500/50 rounded-2xl h-full"
      target={isInternalHash ? undefined : "_blank"}
      rel={isInternalHash ? undefined : "noreferrer"}
    >
      {inner}
    </a>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    name: "GitHub Onboarding Agent",
    desc: "AI assistant that helps new contributors understand a repository via structured Q&A, codebase retrieval, and onboarding guidance.",
    tags: ["LangChain/LangGraph", "RAG", "FastAPI", "Hugging Face", "Vector DB"],
    imageSrc: onboardingImg,
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
    timeline: "September 2024 — January 2025",
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
    siteUrl: "https://schoolhouse.world/",
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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}

      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-60 -right-60 h-[500px] w-[500px] rounded-full bg-violet-950/40 blur-3xl" />
        <div className="absolute top-1/2 -left-60 h-[400px] w-[400px] rounded-full bg-indigo-950/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-950/20 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-8 py-4 flex items-center justify-between">
          <a href="#top" className="font-bold text-base tracking-tight text-white hover:text-violet-300 transition-colors">
            JH
          </a>
          <nav className="flex items-center gap-7">
            <NavLink label="about" href="#info" />
            <NavLink label="experience" href="#building" />
            <NavLink label="research" href="#researching" />
            <NavLink label="teaching" href="#teaching" />
            <NavLink label="projects" href="#projects" />
            <NavLink label="hobbies" href="#hobbies" />
            <NavLink label="contact" href="#contact" />
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 relative group"
            >
              resume
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
            </a>
            <button
              onClick={() => setTerminalOpen(true)}
              className="rounded-full border border-neutral-700 bg-neutral-900/50 px-3 py-1 text-xs font-mono text-green-400 hover:border-green-500/50 hover:text-green-300 transition-all duration-200"
            >
              &gt;_
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8">

        {/* Hero */}
        <section id="top" className="min-h-[calc(100vh-65px)] flex items-center">
          <div className="w-full max-w-5xl mx-auto grid items-center gap-12 md:grid-cols-2 py-20">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                Open to opportunities
              </div>
              <div className="space-y-2">
                <p className="text-neutral-400 text-base">Hello, I'm</p>
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-white via-neutral-100 to-violet-300 bg-clip-text text-transparent">
                    Jacob Horne.
                  </span>
                </h1>
              </div>
              <p className="max-w-md text-neutral-400 leading-relaxed text-sm md:text-base">
                I build, research, and teach technology and systems to solve problems and help people.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-violet-600 hover:bg-violet-500 px-6 py-2.5 text-sm font-medium transition-colors duration-200"
                >
                  View Resume
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-neutral-700 hover:border-neutral-500 hover:text-white text-neutral-300 px-6 py-2.5 text-sm font-medium transition-all duration-200"
                >
                  Contact Me
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-violet-500/15 blur-3xl scale-125" />
                <img
                  src={pfp}
                  alt="Jacob Horne"
                  className="relative h-72 w-72 md:h-80 md:w-80 rounded-full object-cover ring-1 ring-neutral-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="info" className="py-20 scroll-mt-20">
          <div className="max-w-3xl space-y-6">
            <SectionTitle title="About Me" />
            <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
              I was first introduced to computer science in 8th grade when I signed up for an elective
              called Computer Science Discoveries simply because I didn't want to take the other option,
              Music Appreciation. What started as a convenient choice quickly turned into fascination —
              seeing single lines of code, meaningless on their own, come together to form complex projects
              and systems made me realize how powerful software could be. Throughout high school, that
              fascination evolved into a desire to use this ability to create something out of nothing to
              help others and solve real problems. Today, I'm focused on building systems, exploring applied
              AI, and teaching and mentoring others, and I'm looking for roles where I can make meaningful,
              real-world impact through technology.
            </p>
          </div>
        </section>

        {/* Experience */}
        <section id="building" className="py-20 scroll-mt-20">
          <div className="space-y-8">
            <SectionTitle title="Experience" subtitle="Software roles where I shipped products and systems." />
            <div className="grid gap-5">
              {building.map(item => (
                <ExperienceCard key={item.role + item.org} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Research */}
        <section id="researching" className="py-20 scroll-mt-20">
          <div className="space-y-8">
            <SectionTitle title="Research" subtitle="Research and evaluation work in AI + learning." />
            <div className="grid gap-5">
              {researching.map(item => (
                <ExperienceCard key={item.role + item.org} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Teaching */}
        <section id="teaching" className="py-20 scroll-mt-20">
          <div className="space-y-8">
            <SectionTitle title="Teaching" subtitle="Mentoring + instruction in robotics and cybersecurity." />
            <div className="grid gap-5">
              {teaching.map(item => (
                <ExperienceCard key={item.role + item.org} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-20 scroll-mt-20">
          <div className="space-y-8">
            <SectionTitle title="Projects" subtitle="Featured personal projects." />
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map(p => (
                <ProjectCard key={p.name} item={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Hobbies */}
        <section id="hobbies" className="py-20 scroll-mt-20">
          <div className="max-w-3xl space-y-6">
            <SectionTitle title="Hobbies" subtitle="Things I enjoy outside of coding and building." />
            <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
              Outside of programming, building, and developing, I enjoy reading, cooking,
              and being active. I enjoy playing basketball, playing baseball, and going to the gym.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 scroll-mt-20">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/20 p-10 md:p-14 text-center space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Get in touch</h2>
              <p className="text-neutral-500 text-sm">I'm always open to new opportunities and collaborations.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="mailto:jacobhorne.jth@gmail.com"
                className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm text-neutral-300 hover:border-violet-500/50 hover:text-violet-300 transition-all duration-200"
              >
                Email
              </a>
              <a
                href="https://github.com/jacobhorne-jth"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm text-neutral-300 hover:border-violet-500/50 hover:text-violet-300 transition-all duration-200"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/jacobhornejth"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-neutral-700 px-5 py-2.5 text-sm text-neutral-300 hover:border-violet-500/50 hover:text-violet-300 transition-all duration-200"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        <div className="h-20" />
      </main>
    </div>
  );
}
