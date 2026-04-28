import { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Mail,
  ExternalLink,
  ArrowRight,
  Code2,
  Cpu,
  Users,
  Layers,
  BookOpen,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import pfp from "./assets/pfp.png";

// ─── Terminal infrastructure ──────────────────────────────────────────────────

type TerminalLine =
  | { type: "input"; text: string }
  | { type: "output"; text: string }
  | { type: "blank" };

const HELP_TEXT: TerminalLine[] = [
  { type: "output", text: "" },
  { type: "output", text: "Available commands:" },
  { type: "output", text: "  help / ?        — show this menu" },
  { type: "output", text: "  about           — scroll to about" },
  { type: "output", text: "  education       — scroll to education" },
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
  { type: "output", text: "  flip            — flip the page" },
  { type: "output", text: "  game            — play snake" },
  { type: "output", text: "  clear           — clear terminal" },
  { type: "output", text: "  exit            — close terminal" },
  { type: "blank" },
];

// ─── Snake game ──────────────────────────────────────────────────────────────

function SnakeGame({ onExit }: { onExit: () => void }) {
  const COLS = 30, ROWS = 13;
  type Pt = { x: number; y: number };
  const mkFood = (s: Pt[]): Pt => {
    let p: Pt;
    do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (s.some(b => b.x === p.x && b.y === p.y));
    return p;
  };
  const INIT: Pt[] = [{ x: 8, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 6 }];
  const snakeRef = useRef<Pt[]>(INIT);
  const nextDir = useRef<"U" | "D" | "L" | "R">("R");
  const curDir = useRef<"U" | "D" | "L" | "R">("R");
  const foodRef = useRef<Pt>(mkFood(INIT));
  const scoreRef = useRef(0);
  const phase = useRef<"idle" | "playing" | "dead">("idle");
  const [, tick] = useState(0);
  const redraw = () => tick(n => n + 1);
  const restart = () => {
    snakeRef.current = [...INIT]; nextDir.current = "R"; curDir.current = "R";
    foodRef.current = mkFood(INIT); scoreRef.current = 0; phase.current = "idle"; redraw();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = nextDir.current;
      if (e.key === "ArrowUp" && d !== "D") { nextDir.current = "U"; e.preventDefault(); }
      else if (e.key === "ArrowDown" && d !== "U") { nextDir.current = "D"; e.preventDefault(); }
      else if (e.key === "ArrowLeft" && d !== "R") { nextDir.current = "L"; e.preventDefault(); }
      else if (e.key === "ArrowRight" && d !== "L") { nextDir.current = "R"; e.preventDefault(); }
      else if (e.key === " ") {
        e.preventDefault();
        if (phase.current === "idle") { phase.current = "playing"; redraw(); }
        else if (phase.current === "dead") restart();
      } else if (e.key === "Escape" || e.key === "q") { onExit(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);
  useEffect(() => {
    const id = setInterval(() => {
      if (phase.current !== "playing") return;
      curDir.current = nextDir.current;
      const { x: hx, y: hy } = snakeRef.current[0];
      const nx = hx + (curDir.current === "R" ? 1 : curDir.current === "L" ? -1 : 0);
      const ny = hy + (curDir.current === "D" ? 1 : curDir.current === "U" ? -1 : 0);
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS ||
          snakeRef.current.slice(0, -1).some(s => s.x === nx && s.y === ny)) {
        phase.current = "dead"; redraw(); return;
      }
      const ate = nx === foodRef.current.x && ny === foodRef.current.y;
      const ns = [{ x: nx, y: ny }, ...snakeRef.current];
      if (!ate) ns.pop(); else { scoreRef.current += 10; foodRef.current = mkFood(ns); }
      snakeRef.current = ns; redraw();
    }, 120);
    return () => clearInterval(id);
  }, []);
  const grid = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => {
      if (snakeRef.current[0].x === x && snakeRef.current[0].y === y) return "■";
      if (snakeRef.current.slice(1).some(s => s.x === x && s.y === y)) return "□";
      if (foodRef.current.x === x && foodRef.current.y === y) return "◆";
      return "·";
    }).join("")
  ).join("\n");
  return (
    <div className="flex flex-col h-full p-3 gap-2 select-none font-mono">
      <div className="flex justify-between text-xs text-green-600">
        <span>snake.exe</span><span>score: {scoreRef.current}</span><span>[q] quit</span>
      </div>
      <div className="flex-1 flex items-center justify-center border border-green-900/40 rounded-lg">
        {phase.current === "idle" && (
          <div className="text-center space-y-2">
            <div className="text-green-400 text-base">SNAKE</div>
            <div className="text-green-700 text-xs">arrow keys to move</div>
            <div className="text-green-700 text-xs">[space] to start · [q] quit</div>
          </div>
        )}
        {phase.current === "dead" && (
          <div className="text-center space-y-2">
            <div className="text-red-400">GAME OVER</div>
            <div className="text-green-500 text-xs">score: {scoreRef.current}</div>
            <div className="text-green-700 text-xs">[space] restart · [q] quit</div>
          </div>
        )}
        {phase.current === "playing" && (
          <pre className="text-green-400 text-xs leading-tight">{grid}</pre>
        )}
      </div>
    </div>
  );
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

function Terminal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: "jacob-portfolio v2.0.0" },
    { type: "output", text: 'Type "help" or "?" for a list of commands.' },
    { type: "blank" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [gameActive, setGameActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const scrollTo = (id: string) => {
    onClose();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const processCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: TerminalLine[] = [{ type: "input", text: raw }];
    switch (cmd) {
      case "help": case "?": out.push(...HELP_TEXT); break;
      case "about": scrollTo("about"); return;
      case "education": scrollTo("education"); return;
      case "experience": scrollTo("experience"); return;
      case "research": scrollTo("research"); return;
      case "projects": scrollTo("projects"); return;
      case "contact": scrollTo("education"); return;
      case "github":
        window.open("https://github.com/jacobhorne-jth", "_blank");
        out.push({ type: "output", text: "Opening GitHub..." }, { type: "blank" }); break;
      case "linkedin":
        window.open("https://linkedin.com/in/jacobhornejth", "_blank");
        out.push({ type: "output", text: "Opening LinkedIn..." }, { type: "blank" }); break;
      case "resume":
        window.open("/resume.pdf", "_blank");
        out.push({ type: "output", text: "Opening resume..." }, { type: "blank" }); break;
      case "email":
        out.push({ type: "output", text: "jacobhorne.jth@gmail.com" }, { type: "blank" }); break;
      case "whoami":
        out.push(
          { type: "output", text: "Jacob Horne" },
          { type: "output", text: "Software Engineer · ML Researcher · Instructor" },
          { type: "output", text: "UCI Computer Science — GPA 3.9" },
          { type: "blank" },
        ); break;
      case "ls":
        out.push(
          { type: "output", text: "about/  experience/  projects/  research/  education/  contact/" },
          { type: "blank" },
        ); break;
      case "clear":
        setLines([]); setCmdHistory(prev => raw ? [raw, ...prev] : prev);
        setHistoryIdx(-1); setInput(""); return;
      case "exit": case "quit": case "close": onClose(); return;
      case "flip": {
        const isFlipped = document.body.style.transform === "rotate(180deg)";
        document.body.style.transform = isFlipped ? "" : "rotate(180deg)";
        out.push({ type: "output", text: isFlipped ? "right-side up." : "flipped! type flip again to undo." }, { type: "blank" });
        break;
      }
      case "game": setGameActive(true); return;
      case "sudo":
        out.push({ type: "output", text: "Permission denied. Nice try." }, { type: "blank" }); break;
      case "hire me":
        window.open("https://linkedin.com/in/jacobhornejth", "_blank");
        out.push({ type: "output", text: "Redirecting to LinkedIn..." }, { type: "blank" }); break;
      case "": break;
      default:
        out.push({ type: "output", text: `command not found: ${cmd}` }, { type: "blank" });
    }
    setLines(prev => [...prev, ...out]);
    if (raw.trim()) setCmdHistory(prev => [raw, ...prev]);
    setHistoryIdx(-1); setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { processCommand(input); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next); setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next); setInput(next === -1 ? "" : cmdHistory[next]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl mx-4 rounded-xl overflow-hidden shadow-2xl border border-neutral-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3">
          <button onClick={onClose} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400 transition" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="mx-auto text-xs text-neutral-400 font-mono">visitor@jacob-horne — bash</span>
        </div>
        <div className="bg-[#0d1117] h-96 font-mono text-sm">
          {gameActive ? (
            <SnakeGame onExit={() => setGameActive(false)} />
          ) : (
            <div className="h-full overflow-y-auto p-4 cursor-text" onClick={() => inputRef.current?.focus()}>
              {lines.map((line, i) => {
                if (line.type === "blank") return <div key={i} className="h-3" />;
                if (line.type === "input") return (
                  <div key={i} className="flex gap-2 leading-5">
                    <span className="text-green-500 select-none shrink-0">visitor@jacob-horne:~$</span>
                    <span className="text-green-300">{line.text}</span>
                  </div>
                );
                return <div key={i} className="text-green-300/75 pl-2 leading-5">{line.text}</div>;
              })}
              <div className="flex gap-2 items-center leading-5 mt-0.5">
                <span className="text-green-500 select-none shrink-0">visitor@jacob-horne:~$</span>
                <input
                  ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none flex-1 text-green-300 caret-green-400"
                  spellCheck={false} autoComplete="off" autoCapitalize="off"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type AboutColumn = { Icon: LucideIcon; text: string };
type ExpEntry = { company: string; role: string; period: string; desc: string; tags: string[] };
type ExpSection = {
  Icon: LucideIcon; iconBg: string; iconColor: string; accentColor: string;
  title: string; entries: ExpEntry[];
};
type Project = {
  name: string; monogram: string; desc: string; tech: string[];
  accentLine: string; repoUrl: string; demoUrl?: string;
};
type ResearchCard = {
  badge: string; badgeColor: string;
  title: string; subtitle: string; desc: string; url: string;
};

const aboutColumns: AboutColumn[] = [
  {
    Icon: Code2,
    text: "I'm passionate about building technology that solves real-world problems and creates meaningful impact.",
  },
  {
    Icon: Cpu,
    text: "I enjoy working at the intersection of AI, systems, and product — turning ideas into scalable, data-driven solutions.",
  },
  {
    Icon: Users,
    text: "Whether I'm researching new ML techniques or shipping full-stack products, I thrive where I can learn, build, and grow with others.",
  },
];

const expSections: ExpSection[] = [
  {
    Icon: Layers,
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    accentColor: "border-blue-500",
    title: "Development",
    entries: [
      {
        company: "Capital One",
        role: "Incoming Software Engineering Intern",
        period: "Summer 2025",
        desc: "Joining the technology team as an SWE Intern.",
        tags: ["Java", "AWS"],
      },
      {
        company: "Prop.Intel",
        role: "Full-Stack Engineer",
        period: "2024 – Present",
        desc: "Building and shipping production features for a real estate intelligence platform — APIs, data pipelines, and UI.",
        tags: ["React", "Node.js", "PostgreSQL"],
      },
      {
        company: "Agonus",
        role: "Backend Developer",
        period: "2023 – 2024",
        desc: "Developed REST APIs and data infrastructure for a B2B SaaS platform.",
        tags: ["Python", "FastAPI", "PostgreSQL"],
      },
      {
        company: "Commit the Change",
        role: "Software Engineer",
        period: "2023 – Present",
        desc: "Open-source software for nonprofits, built with a team of UCI engineers.",
        tags: ["React", "TypeScript"],
      },
    ],
  },
  {
    Icon: BookOpen,
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    accentColor: "border-purple-500",
    title: "Research",
    entries: [
      {
        company: "UCI Digital Learning Lab",
        role: "Machine Learning Researcher",
        period: "2024 – Present",
        desc: "Token-level confidence signals for LLM reasoning evaluation. Published ICLR 2026, ACL 2025.",
        tags: ["Python", "PyTorch", "LLMs"],
      },
      {
        company: "Calit2 — Dr. S. Wang",
        role: "Research Assistant",
        period: "2024 – Present",
        desc: "Physics-informed ML for thermal storage system optimization using PINNs.",
        tags: ["Python", "JAX", "PINNs"],
      },
      {
        company: "CareTech",
        role: "Computer Vision Researcher",
        period: "2023 – 2024",
        desc: "Computer vision for medical device interaction detection in assistive technology.",
        tags: ["Python", "OpenCV", "YOLO"],
      },
      {
        company: "BIRD-Interact Benchmark",
        role: "SQL Evaluation Researcher",
        period: "2024 – Present",
        desc: "LLM agent that writes, executes, and self-evaluates SQL queries on complex schemas.",
        tags: ["Python", "LangChain", "SQL"],
      },
    ],
  },
  {
    Icon: Users,
    iconBg: "bg-green-50 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    accentColor: "border-green-500",
    title: "Teaching & Leadership",
    entries: [
      {
        company: "MAISS Program — UCI",
        role: "Peer Mentor",
        period: "2024 – Present",
        desc: "Mentoring underrepresented CS students through the MAISS program at UCI.",
        tags: [],
      },
      {
        company: "Robotics for All",
        role: "Instructor",
        period: "2023 – 2024",
        desc: "Taught programming and robotics fundamentals to K–12 students in underserved communities.",
        tags: ["Python", "Robotics"],
      },
      {
        company: "PECS",
        role: "Cybersecurity Tutor",
        period: "2023",
        desc: "Taught cybersecurity fundamentals — networking, ethical hacking basics, and digital safety.",
        tags: ["Security", "Networking"],
      },
    ],
  },
];

const projects: Project[] = [
  {
    name: "Customer LTV Estimator",
    monogram: "LTV",
    desc: "ML pipeline to predict customer lifetime value using behavioral data.",
    tech: ["Python", "XGBoost", "AWS"],
    accentLine: "bg-blue-500",
    repoUrl: "https://github.com/jacobhorne-jth/customer-ltv-estimator",
  },
  {
    name: "Encrypted Chat App",
    monogram: "ECA",
    desc: "End-to-end encrypted messaging app with real-time communication.",
    tech: ["React", "Node.js", "Socket.io"],
    accentLine: "bg-emerald-500",
    repoUrl: "https://github.com/jacobhorne-jth/encrypted-chat-app",
  },
  {
    name: "AI Data Cleaning Assistant",
    monogram: "ADC",
    desc: "LLM-powered tool to automate and validate dirty data.",
    tech: ["Python", "OpenAI", "Streamlit"],
    accentLine: "bg-purple-500",
    repoUrl: "https://github.com/jacobhorne-jth/ai-data-cleaning-assistant",
  },
  {
    name: "SF Crime Mapper",
    monogram: "SCM",
    desc: "Interactive visualization of crime data with geospatial insights.",
    tech: ["Python", "Folium", "JS"],
    accentLine: "bg-amber-500",
    repoUrl: "https://github.com/jacobhorne-jth/sf-crime-mapper",
  },
  {
    name: "Bioinformatics Pipeline",
    monogram: "BIO",
    desc: "Automated pipeline for genomic data processing and analysis.",
    tech: ["Nextflow", "Python", "Docker"],
    accentLine: "bg-cyan-500",
    repoUrl: "#",
  },
  {
    name: "SQL Evaluation Agent",
    monogram: "SQL",
    desc: "LLM agent that writes, executes, and evaluates SQL queries.",
    tech: ["Python", "LangChain", "SQL"],
    accentLine: "bg-rose-500",
    repoUrl: "#",
  },
];

const researchHighlights: ResearchCard[] = [
  {
    badge: "Published",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    title: "ICLR 2026 Workshop",
    subtitle: "LLM Reasoning Workshop",
    desc: "\"The First Tokens Matter: Early Confidence Signals for Evaluating LLM Reasoning\"",
    url: "https://openreview.net/forum?id=0FOOrwSQ9E",
  },
  {
    badge: "Accepted",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    title: "ACL Student Research",
    subtitle: "ACL 2025",
    desc: "Multi-agent evaluation framework with token-level confidence signals for LLM assessment.",
    url: "#",
  },
  {
    badge: "Active",
    badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    title: "Calit2 PINNs Research",
    subtitle: "Physics-Informed ML",
    desc: "Physics-informed machine learning for thermal storage system optimization under Dr. S. Wang.",
    url: "#",
  },
  {
    badge: "Active",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    title: "SQL Evaluation Agent",
    subtitle: "BIRD-Interact Benchmark",
    desc: "Automated SQL agent that writes, executes, and self-evaluates queries against complex schemas.",
    url: "#",
  },
];

const coursework = [
  "CS 161 — Design & Analysis of Algorithms",
  "CS 178 — Machine Learning & Data Mining",
  "CS 143A — Principles of Operating Systems",
  "CS 171 — Introduction to AI",
  "CS 122A — Introduction to Data Management",
  "ICS 46 — Data Structures & Analysis",
];

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Education", href: "#education" },
  { label: "Now", href: "#explore" },
  { label: "Contact", href: "#education" },
];

// ─── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-14">
      <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">
        {number}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  onOpenTerminal,
  darkMode,
  onToggleDark,
}: {
  onOpenTerminal: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-blue-600 text-white text-sm font-bold grid place-items-center group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors duration-200">
            JH
          </span>
          <span className="font-semibold text-gray-900 dark:text-white text-sm hidden sm:block">Jacob Horne</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-md transition-all duration-150"
            >
              {l.label}
            </a>
          ))}
          {/* Dark/light toggle */}
          <button
            onClick={onToggleDark}
            className="ml-1 p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-150"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {/* Terminal button */}
          <button
            onClick={onOpenTerminal}
            className="ml-1 flex items-center gap-1.5 rounded-lg border border-gray-800 dark:border-green-500/40 bg-gray-900 dark:bg-green-500/10 px-3 py-1.5 text-xs font-mono text-white dark:text-green-400 hover:bg-gray-700 dark:hover:bg-green-500/20 dark:hover:border-green-400/60 transition-all duration-150 shadow-sm"
          >
            <TerminalIcon className="h-3.5 w-3.5" />
            &gt;_
          </button>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="p-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="max-w-[1120px] mx-auto px-6 py-4 space-y-1">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-md"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); onOpenTerminal(); }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-mono text-gray-800 dark:text-green-400 hover:text-blue-600 dark:hover:text-green-300"
            >
              <TerminalIcon className="h-4 w-4" /> &gt;_ Terminal
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function LaptopVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-blue-500/8 rounded-3xl blur-2xl" />
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/50">
        {/* Browser chrome */}
        <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 border-b border-slate-700/50">
          <div className="flex gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 mx-3 bg-slate-700/60 rounded px-3 py-1 text-xs text-slate-400 text-center truncate">
            jacobhorne.dev
          </div>
        </div>
        {/* Content */}
        <div className="bg-slate-900 p-5">
          <div className="grid grid-cols-[1fr_148px] gap-4">
            {/* Code panel */}
            <div className="font-mono text-xs leading-[1.65] text-slate-300 overflow-hidden">
              <div><span className="text-blue-400">import</span> <span className="text-slate-300">{"{ build }"}</span> <span className="text-blue-400">from</span> <span className="text-green-400">'@jacob'</span></div>
              <div className="h-2" />
              <div><span className="text-purple-400">const</span> <span className="text-blue-300">me</span> = {"{"}</div>
              <div className="pl-4"><span className="text-slate-400">name:</span>  <span className="text-amber-300">"Jacob Horne"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">role:</span>  <span className="text-amber-300">"SWE + Researcher"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">gpa:</span>   <span className="text-cyan-400">3.9</span>,</div>
              <div className="pl-4"><span className="text-slate-400">papers:</span> <span className="text-cyan-400">2</span>,</div>
              <div>{"}"}</div>
              <div className="h-2" />
              <div><span className="text-purple-400">async function</span> <span className="text-yellow-300">build</span>{"() {"}</div>
              <div className="pl-4 text-slate-500">{"// turning ideas into impact"}</div>
              <div className="pl-4"><span className="text-blue-400">return</span> me.create();</div>
              <div>{"}"}</div>
            </div>
            {/* Stats panel */}
            <div className="space-y-2">
              {([
                { label: "Projects", value: "12+", pct: 75, color: "bg-blue-500" },
                { label: "Papers", value: "2", pct: 35, color: "bg-purple-500" },
                { label: "Mentored", value: "50+", pct: 85, color: "bg-green-500" },
              ] as const).map(s => (
                <div key={s.label} className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/30">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[10px] text-slate-400">{s.label}</span>
                    <span className="text-sm font-bold text-white">{s.value}</span>
                  </div>
                  <div className="h-0.5 rounded-full bg-slate-700">
                    <div className={`h-0.5 rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Terminal line */}
          <div className="mt-4 bg-slate-800/60 rounded-lg px-3 py-2 font-mono text-[11px] flex items-center gap-2 border border-slate-700/30">
            <span className="text-green-400">❯</span>
            <span className="text-slate-400">npm run build</span>
            <span className="text-slate-600 mx-1">·</span>
            <span className="text-green-400">✓ built in 618ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  return (
    <section id="top" className="bg-slate-950 text-white">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8 py-28 md:py-36">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-6">
            <p className="font-mono text-sm text-blue-400 tracking-wide">&gt; Hello, I'm</p>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none text-white">
                Jacob Horne.
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 font-medium">
                Software Engineer. ML Researcher. Builder.
              </p>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              I build production-focused software systems across machine learning, full-stack development,
              and AI research. Currently studying CS at UCI and incoming SWE Intern at Capital One.
            </p>
            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-sm font-medium transition-colors duration-150"
              >
                View Resume
              </a>
              <a
                href="https://github.com/jacobhorne-jth"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 px-5 py-2.5 text-sm text-slate-300 transition-all duration-150"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/jacobhornejth"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 px-5 py-2.5 text-sm text-slate-300 transition-all duration-150"
              >
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="mailto:jacobhorne.jth@gmail.com"
                className="flex items-center gap-2 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 px-5 py-2.5 text-sm text-slate-300 transition-all duration-150"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
            {/* Terminal button — prominent */}
            <button
              onClick={onOpenTerminal}
              className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/8 px-4 py-2 font-mono text-sm text-green-400 hover:border-green-500/60 hover:bg-green-500/15 transition-all duration-150"
            >
              <TerminalIcon className="h-4 w-4" />
              &gt;_ open terminal
            </button>
          </div>

          {/* Right: visual */}
          <div className="hidden md:block">
            <LaptopVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About Me ─────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="bg-white dark:bg-slate-900 py-24 scroll-mt-20">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8">
        <SectionHeader number="01" title="About Me" />
        <div className="grid md:grid-cols-[280px_1fr] gap-14 items-start">
          {/* Photo */}
          <div className="relative shrink-0">
            <div className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 aspect-[4/5]">
              <img src={pfp} alt="Jacob Horne" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 dark:text-slate-500">Incoming</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">@ Capital One</p>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              Builder. Problem Solver.<br className="hidden sm:block" /> Lifelong Learner.
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {aboutColumns.map((col, i) => (
                <div key={i}>
                  <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                    <col.Icon className="h-4.5 w-4.5 text-blue-600" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{col.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection() {
  return (
    <section id="experience" className="bg-gray-50 dark:bg-slate-950 py-24 scroll-mt-20">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8">
        <SectionHeader number="02" title="Experience" />
        <div className="grid md:grid-cols-3 gap-6">
          {expSections.map(sec => (
            <div
              key={sec.title}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-7 flex flex-col"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100 dark:border-slate-800">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${sec.iconBg}`}>
                  <sec.Icon className={`h-4.5 w-4.5 ${sec.iconColor}`} strokeWidth={1.75} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">{sec.title}</h3>
              </div>

              {/* Entries */}
              <div className="space-y-5">
                {sec.entries.map(e => (
                  <div key={e.company} className={`pl-3 border-l-2 ${sec.accentColor}`}>
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                        {e.company}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 dark:text-slate-500 shrink-0">
                        {e.period}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 mb-1.5">{e.role}</p>
                    <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{e.desc}</p>
                    {e.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {e.tags.map(t => (
                          <span
                            key={t}
                            className="text-[10px] rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 text-gray-500 dark:text-slate-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" className="bg-white dark:bg-slate-900 py-24 scroll-mt-20">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8">
        {/* Header row */}
        <div className="flex items-baseline justify-between mb-14">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">03</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
          </div>
          <a
            href="https://github.com/jacobhorne-jth"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-150"
          >
            View all projects <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => (
            <div
              key={p.name}
              className="group rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Header area */}
              <div className="relative bg-slate-900 aspect-[16/9] flex items-center justify-center overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${p.accentLine}`} />
                <span className="text-5xl font-black font-mono text-slate-700/60 select-none tracking-tighter">
                  {p.monogram}
                </span>
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />
              </div>
              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white leading-tight">{p.name}</h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-slate-300 leading-relaxed flex-1">{p.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.map(t => (
                    <span
                      key={t}
                      className="rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 px-2.5 py-0.5 text-xs text-gray-600 dark:text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {/* Footer links */}
              <div className="px-5 pb-4 flex gap-3">
                {p.repoUrl !== "#" && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
                  >
                    <GithubIcon className="h-3.5 w-3.5" /> Code
                  </a>
                )}
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="sm:hidden mt-8 text-center">
          <a
            href="https://github.com/jacobhorne-jth"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            View all projects <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Research ─────────────────────────────────────────────────────────────────

function ResearchSection() {
  return (
    <section id="research" className="bg-gray-50 dark:bg-slate-950 py-24 scroll-mt-20">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8">
        <SectionHeader number="04" title="Research Highlights" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {researchHighlights.map(r => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className={`group bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 ${r.url === "#" ? "pointer-events-none" : ""}`}
            >
              <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium mb-4 ${r.badgeColor}`}>
                {r.badge}
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{r.title}</h3>
              <p className="text-xs text-blue-600 mt-1 mb-3">{r.subtitle}</p>
              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed flex-1">{r.desc}</p>
              {r.url !== "#" && (
                <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-150">
                  <span>Read paper</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Education + Contact ──────────────────────────────────────────────────────

function EducationContact() {
  return (
    <section id="education" className="bg-white dark:bg-slate-900 py-24 scroll-mt-20">
      <div className="max-w-[1120px] mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Education */}
          <div>
            <div className="flex items-baseline gap-3 mb-10">
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">05</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h2>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
              <div className="text-6xl font-black text-gray-100 dark:text-slate-800 leading-none mb-5 select-none tracking-tight">
                UCI
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">University of California, Irvine</p>
                <p className="text-sm text-gray-600 dark:text-slate-300">B.S. Computer Science</p>
                <p className="text-sm text-gray-600 dark:text-slate-300">Business Information Management</p>
                <p className="text-sm text-blue-600">Campuswide Honors Collegium</p>
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100 pt-1">GPA: 3.9</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-mono">Expected Graduation: June 2027</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Relevant Coursework
                </p>
                <ul className="space-y-1.5">
                  {coursework.map(c => (
                    <li key={c} className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
                      <span className="h-1 w-1 rounded-full bg-blue-400 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-baseline gap-3 mb-10">
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">06</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Let's Connect</h2>
            </div>
            <div className="space-y-5">
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                I'm always open to new opportunities, research collaborations, and interesting conversations.
                Reach out anytime.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  {
                    Icon: Mail, label: "jacobhorne.jth@gmail.com",
                    href: "mailto:jacobhorne.jth@gmail.com",
                  },
                  {
                    Icon: LinkedinIcon, label: "linkedin.com/in/jacobhornejth",
                    href: "https://linkedin.com/in/jacobhornejth",
                  },
                  {
                    Icon: GithubIcon, label: "github.com/jacobhorne-jth",
                    href: "https://github.com/jacobhorne-jth",
                  },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                  >
                    <span className="h-9 w-9 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      <link.Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="pt-4">
                <a
                  href="mailto:jacobhorne.jth@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-sm font-medium transition-colors duration-150"
                >
                  Let's Build Something
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Explore Bar ──────────────────────────────────────────────────────────────

function ExploreBar({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const items = [
    {
      Icon: TerminalIcon,
      iconClass: "text-green-400 group-hover:text-green-300",
      borderClass: "border-green-500/30 group-hover:border-green-500/60 group-hover:shadow-sm group-hover:shadow-green-500/10",
      arrowClass: "text-slate-600 group-hover:text-green-400",
      label: ">_ Terminal Mode",
      sub: "Interactive CLI experience",
      action: onOpenTerminal,
      href: null as string | null,
    },
    {
      Icon: Zap,
      iconClass: "text-slate-400 group-hover:text-blue-400",
      borderClass: "border-slate-700 group-hover:border-blue-500/50",
      arrowClass: "text-slate-600 group-hover:text-blue-400",
      label: "Now",
      sub: "What I'm building & learning",
      action: null as (() => void) | null,
      href: "#explore",
    },
    {
      Icon: BookOpen,
      iconClass: "text-slate-400 group-hover:text-blue-400",
      borderClass: "border-slate-700 group-hover:border-blue-500/50",
      arrowClass: "text-slate-600 group-hover:text-blue-400",
      label: "Deep Dives",
      sub: "In-depth project case studies",
      action: null,
      href: "#projects",
    },
  ];

  return (
    <section id="explore" className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {items.map(item => {
            const inner = (
              <div className="group flex items-center justify-between px-8 py-10 hover:bg-slate-900/60 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-200 ${item.borderClass}`}>
                    <item.Icon className={`h-4.5 w-4.5 transition-colors duration-200 ${item.iconClass}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-base">{item.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 group-hover:translate-x-1 transition-all duration-200 shrink-0 ${item.arrowClass}`} />
              </div>
            );
            if (item.action) {
              return <button key={item.label} onClick={item.action} className="text-left w-full">{inner}</button>;
            }
            return <a key={item.label} href={item.href ?? "#"}>{inner}</a>;
          })}
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const openTerminal = () => setTerminalOpen(true);
  const closeTerminal = () => setTerminalOpen(false);

  return (
    <div className={`min-h-screen${darkMode ? " dark" : ""}`}>
      {terminalOpen && <Terminal onClose={closeTerminal} />}
      <Navbar onOpenTerminal={openTerminal} darkMode={darkMode} onToggleDark={() => setDarkMode(v => !v)} />
      <Hero onOpenTerminal={openTerminal} />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ResearchSection />
      <EducationContact />
      <ExploreBar onOpenTerminal={openTerminal} />
    </div>
  );
}
