import { memo, useCallback, useState, useRef, useEffect } from "react";
import {
  Mail,
  ExternalLink,
  ArrowRight,
  Code2,
  Cpu,
  Users,
  Menu,
  X,
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
import pfp from "./assets/pfp.jpg";
import projAgonus from "./assets/projects/agonus.png";
import projPropIntel from "./assets/projects/propintel.png";
import projCrimeMap from "./assets/projects/JacobHorneCrimeMap.png";
import projOnboarding from "./assets/projects/onbaoardingreal.png";
import projSMS from "./assets/projects/realsms.png";
import projWebsite from "./assets/projects/port.png";
import projChromeOrg from "./assets/projects/chrome-org.png";
import projPyTorch from "./assets/projects/pytorch.png";
import logoC1 from "./assets/logos/c1-logo.png";
import logoSandia from "./assets/logos/sandia.jpg";
import logoURP from "./assets/logos/urp.jpeg";
import logoTCS from "./assets/logos/tcs-logo.jpg";
import logoCaretech from "./assets/logos/caretechlogo.jpeg";
import logoCTC from "./assets/logos/ctclogo.jpeg";
import logoBlockchain from "./assets/logos/blockchainlogo.jpeg";
import logoSENS from "./assets/logos/senslogo.jpeg";
import logoRFA from "./assets/logos/rfalogo.jpeg";
import logoCalit2 from "./assets/logos/calit2.png";
import MeshBackground from "./MeshBackground";
import logoUCI from "./assets/logos/uci.jpeg";
import logoDLL from "./assets/logos/dllreal.png";

// ─── Terminal infrastructure ──────────────────────────────────────────────────

type TerminalLine =
  | { type: "input"; text: string }
  | { type: "output"; text: string }
  | { type: "cols"; left: string; right: string }
  | { type: "blank" };

const HELP_TEXT: TerminalLine[] = [
  { type: "output", text: "" },
  { type: "output", text: "Available commands:" },
  { type: "blank" },
  { type: "cols", left: "  help / ?   — show this menu",   right: "  github     — open GitHub profile" },
  { type: "cols", left: "  clear      — clear terminal",   right: "  linkedin   — open LinkedIn profile" },
  { type: "cols", left: "  about      — scroll to about",  right: "  resume     — open resume PDF" },
  { type: "cols", left: "  experience — view experience",  right: "  email      — show email address" },
  { type: "cols", left: "  research   — view research",    right: "  skills     — show tech stack" },
  { type: "cols", left: "  projects   — view projects",    right: "  game       — play snake" },
  { type: "cols", left: "  education  — view education",   right: "  hack       — initiate hack" },
  { type: "cols", left: "  contact    — scroll to contact", right: "  exit       — close terminal" },
  { type: "blank" },
];

// ─── Snake game ──────────────────────────────────────────────────────────────

const SNAKE_COLS = 30;
const SNAKE_ROWS = 13;
const SNAKE_INIT = [{ x: 8, y: 6 }, { x: 7, y: 6 }, { x: 6, y: 6 }];
const SNAKE_START_FOOD = { x: 18, y: 6 };

function SnakeGame({ onExit }: { onExit: () => void }) {
  type Pt = { x: number; y: number };
  type Phase = "idle" | "playing" | "dead";
  const mkFood = useCallback((s: Pt[]): Pt => {
    let p: Pt;
    do { p = { x: Math.floor(Math.random() * SNAKE_COLS), y: Math.floor(Math.random() * SNAKE_ROWS) }; }
    while (s.some(b => b.x === p.x && b.y === p.y));
    return p;
  }, []);
  const snakeRef = useRef<Pt[]>(SNAKE_INIT);
  const nextDir = useRef<"U" | "D" | "L" | "R">("R");
  const curDir = useRef<"U" | "D" | "L" | "R">("R");
  const foodRef = useRef<Pt>(SNAKE_START_FOOD);
  const scoreRef = useRef(0);
  const phase = useRef<Phase>("idle");
  const [view, setView] = useState({
    snake: SNAKE_INIT,
    food: SNAKE_START_FOOD,
    score: 0,
    phase: "idle" as Phase,
  });
  const redraw = useCallback(() => {
    setView({
      snake: [...snakeRef.current],
      food: { ...foodRef.current },
      score: scoreRef.current,
      phase: phase.current,
    });
  }, []);
  const restart = useCallback(() => {
    snakeRef.current = [...SNAKE_INIT]; nextDir.current = "R"; curDir.current = "R";
    foodRef.current = mkFood(SNAKE_INIT); scoreRef.current = 0; phase.current = "idle"; redraw();
  }, [mkFood, redraw]);
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
  }, [onExit, redraw, restart]);
  useEffect(() => {
    const id = setInterval(() => {
      if (phase.current !== "playing") return;
      curDir.current = nextDir.current;
      const { x: hx, y: hy } = snakeRef.current[0];
      const nx = hx + (curDir.current === "R" ? 1 : curDir.current === "L" ? -1 : 0);
      const ny = hy + (curDir.current === "D" ? 1 : curDir.current === "U" ? -1 : 0);
      if (nx < 0 || nx >= SNAKE_COLS || ny < 0 || ny >= SNAKE_ROWS ||
          snakeRef.current.slice(0, -1).some(s => s.x === nx && s.y === ny)) {
        phase.current = "dead"; redraw(); return;
      }
      const ate = nx === foodRef.current.x && ny === foodRef.current.y;
      const ns = [{ x: nx, y: ny }, ...snakeRef.current];
      if (!ate) ns.pop(); else { scoreRef.current += 10; foodRef.current = mkFood(ns); }
      snakeRef.current = ns; redraw();
    }, 120);
    return () => clearInterval(id);
  }, [mkFood, redraw]);
  const grid = Array.from({ length: SNAKE_ROWS }, (_, y) =>
    Array.from({ length: SNAKE_COLS }, (_, x) => {
      if (view.snake[0].x === x && view.snake[0].y === y) return "■";
      if (view.snake.slice(1).some(s => s.x === x && s.y === y)) return "□";
      if (view.food.x === x && view.food.y === y) return "◆";
      return "·";
    }).join("")
  ).join("\n");
  return (
    <div className="flex flex-col h-full p-3 gap-2 select-none font-mono">
      <div className="flex justify-between text-xs text-green-600">
        <span>snake.exe</span><span>score: {view.score}</span><span>[q] quit</span>
      </div>
      <div className="flex-1 flex items-center justify-center border border-green-900/40 rounded-lg">
        {view.phase === "idle" && (
          <div className="text-center space-y-2">
            <div className="text-green-400 text-base">SNAKE</div>
            <div className="text-green-700 text-xs">arrow keys to move</div>
            <div className="text-green-700 text-xs">[space] to start · [q] quit</div>
          </div>
        )}
        {view.phase === "dead" && (
          <div className="text-center space-y-2">
            <div className="text-red-400">GAME OVER</div>
            <div className="text-green-500 text-xs">score: {view.score}</div>
            <div className="text-green-700 text-xs">[space] restart · [q] quit</div>
          </div>
        )}
        {view.phase === "playing" && (
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
  const [activeGame, setActiveGame] = useState<"snake" | null>(null);
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
      case "contact": scrollTo("contact"); return;
      case "papers": scrollTo("research"); return;
      case "github":
        window.open("https://github.com/jacobhorne-jth", "_blank");
        out.push({ type: "output", text: "Opening GitHub..." }, { type: "blank" }); break;
      case "linkedin":
        window.open("https://linkedin.com/in/jacobhornejth", "_blank");
        out.push({ type: "output", text: "Opening LinkedIn..." }, { type: "blank" }); break;
      case "resume":
        window.open("/JacobHorneResume.pdf", "_blank");
        out.push({ type: "output", text: "Opening resume..." }, { type: "blank" }); break;
      case "email":
        out.push({ type: "output", text: "jacobhorne.jth@gmail.com" }, { type: "blank" }); break;
      case "whoami":
        out.push(
          { type: "output", text: "Jacob Horne" },
          { type: "output", text: "Software Engineer · ML Researcher · Instructor" },
          { type: "output", text: "UCI Computer Science — GPA 3.92" },
          { type: "blank" },
        ); break;
      case "ls":
        out.push(
          { type: "output", text: "about/  experience/  research/  projects/  education/  now/  contact/" },
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
      case "game": setActiveGame("snake"); return;
      case "hack":
        out.push(
          { type: "output", text: "Initializing hack sequence..." },
          { type: "output", text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%" },
          { type: "output", text: "ACCESS GRANTED." },
          { type: "output", text: "just kidding. hi :)" },
          { type: "blank" },
        ); break;
      case "joke": {
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs.",
          "A SQL query walks into a bar, walks up to two tables and asks... can I join you?",
          "Why do Java developers wear glasses? Because they don't C#.",
          "How many programmers does it take to change a lightbulb? None, that's a hardware problem.",
          "I would tell you a UDP joke, but you might not get it.",
          "There are 10 types of people: those who understand binary and those who don't.",
        ];
        out.push({ type: "output", text: jokes[Math.floor(Math.random() * jokes.length)] }, { type: "blank" }); break;
      }
      case "fortune": {
        const fortunes = [
          "The best time to start was yesterday. The second best time is now.",
          "Ship it, then iterate.",
          "You don't have to be great to start, but you have to start to be great.",
          "Code is read more often than it is written.",
          "Make it work, make it right, make it fast.",
          "The secret to getting ahead is getting started.",
        ];
        out.push({ type: "output", text: `✦ ${fortunes[Math.floor(Math.random() * fortunes.length)]}` }, { type: "blank" }); break;
      }
      case "coffee":
        out.push(
          { type: "output", text: "    {  {  {" },
          { type: "output", text: "    }  }  }" },
          { type: "output", text: "   .----------." },
          { type: "output", text: "   |          |)" },
          { type: "output", text: "   |          |" },
          { type: "output", text: "    `--------'" },
          { type: "output", text: "" },
          { type: "output", text: "  fueled by coffee." },
          { type: "blank" },
        ); break;
      case "skills":
        out.push(
          { type: "output", text: "Languages   Python · TypeScript · JavaScript · C/C++ · SQL · Solidity" },
          { type: "output", text: "AI/ML       PyTorch · OpenCV · scikit-learn · LangGraph · NumPy · Pandas" },
          { type: "output", text: "Research    LLM eval · LLM-as-Judge · Agentic benchmarking · Token confidence" },
          { type: "output", text: "Data        PySpark · Databricks · Airflow · PostgreSQL · pgvector" },
          { type: "output", text: "Backend     FastAPI · Node.js · Express · Redis" },
          { type: "output", text: "Systems     Docker · Linux · AWS · Vertex AI · Foundry · Slither" },
          { type: "output", text: "Frontend    React · Next.js · Tailwind CSS" },
          { type: "output", text: "Focus       Multi-agent systems · Text-to-SQL · Compilers · PINNs · Perception" },
          { type: "blank" },
        ); break;
      case "ping":
        out.push(
          { type: "output", text: "PING jacob-horne.dev" },
          { type: "output", text: "64 bytes: icmp_seq=0 ttl=64 time=0.42ms" },
          { type: "output", text: "64 bytes: icmp_seq=1 ttl=64 time=0.39ms" },
          { type: "output", text: "jacob is online ✓" },
          { type: "blank" },
        ); break;
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
      <div className="w-full max-w-3xl mx-4 rounded-xl overflow-hidden shadow-2xl border border-neutral-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 bg-neutral-800 px-4 py-3">
          <button onClick={onClose} className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400 transition" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="mx-auto text-xs text-neutral-400 font-mono">visitor@jacob-horne — bash</span>
        </div>
        <div className="bg-[#0d1117] h-[520px] font-mono text-sm">
          {activeGame === "snake" ? (
            <SnakeGame onExit={() => setActiveGame(null)} />
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
                if (line.type === "cols") return (
                  <div key={i} className="grid grid-cols-2 leading-5">
                    <span className="text-green-300/75 pl-2">{line.left}</span>
                    <span className="text-green-300/75 pl-2">{line.right}</span>
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

type RoleEntry = {
  logo: string;
  logoImg?: string;
  company: string;
  companyLink?: string;
  role: string;
  period: string;
  isActive?: boolean;
  /** Broad one-sentence description used on the collapsed timeline row. */
  summary?: string;
  /** Full technical evidence shown only in the detail modal. */
  bullets: string[];
  featured?: { text: string; url?: string } | { text: string; url?: string }[];
  tags: string[];
};
type Project = {
  name: string; monogram: string; desc: string; detail: string; tech: string[];
  accentLine: string; repoUrl: string; demoUrl?: string; imgUrl?: string;
  /** Resume-style evidence shown as scannable highlights inside the detail modal. */
  highlights?: string[];
  /** Specific external proof such as merged upstream pull requests. */
  evidenceLinks?: Array<{ href: string; label: string }>;
  /** "contain" for entries whose artwork is a logo rather than a wide screenshot — the
   *  default crop would cut a square logo off inside the landscape frame. */
  imageFit?: "cover" | "contain";
  group?: string;
  /** Still being worked on — surfaces the same Active dot the role cards use. */
  isActive?: boolean;
  /** Keep the project data available without including it in the curated portfolio grid. */
  isHidden?: boolean;
};
type Paper = {
  /** The recognisable half of the venue — "ICLR 2026". This is the credential, so it gets
   *  the badge; the track is supporting detail. */
  conference: string;
  track?: string;
  title: string;
  detail: string;
  highlights: string[];
  url?: string;
  tags: string[];
};
type Tone = "cyan" | "emerald" | "violet" | "amber" | "rose" | "blue";
type DetailItem = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  summary: string;
  /** Short chips shown on the collapsed card. Omit where the subtitle already lists the
   *  stack (projects do), or the card ends up saying the same thing twice. */
  chips?: string[];
  /** Takes over the card's eyebrow row when the venue is the headline fact, as on a paper.
   *  `label` gets the accent badge; `note` sits beside it as supporting detail. */
  badge?: { label: string; note?: string };
  period?: string;
  logo?: string;
  logoImg?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  meta?: string[];
  paragraphs: string[];
  highlights: string[];
  tags: string[];
  /** Outbound links for the modal. First one is filled, the rest are outlined, so a project
   *  can offer a demo and its source without either hiding the other. */
  links?: Array<{ href: string; label: string }>;
  evidenceLinks?: Array<{ href: string; label: string }>;
  accentLine?: string;
  isActive?: boolean;
  tone?: Tone;
};

// `card` is deliberately identical across every tone, matching what light mode already did
// with plain white. A tone tints its border, label, bullets and buttons — never the fill.
// Tinted fills read as coloured panels against the neutral section surfaces, which is the
// same problem the section backgrounds had, just at card size.
const toneStyles: Record<Tone, {
  text: string;
  soft: string;
  border: string;
  hoverBorder: string;
  ring: string;
  bullet: string;
  arrow: string;
  button: string;
  primary: string;
  card: string;
}> = {
  cyan: {
    text: "text-cyan-700 dark:text-cyan-300",
    soft: "bg-cyan-600/10 dark:bg-cyan-400/10",
    border: "border-cyan-600/30 dark:border-cyan-300/25",
    hoverBorder: "hover:border-cyan-500/65",
    ring: "focus-visible:ring-cyan-500/70",
    bullet: "bg-cyan-500",
    arrow: "group-hover:text-cyan-500 dark:group-hover:text-cyan-300",
    button: "border-cyan-600/35 text-cyan-700 dark:border-cyan-300/35 dark:text-cyan-300",
    primary: "bg-cyan-700 hover:bg-cyan-600",
    card: "bg-white dark:bg-[#161922]",
  },
  emerald: {
    text: "text-emerald-700 dark:text-emerald-300",
    soft: "bg-emerald-600/10 dark:bg-emerald-400/10",
    border: "border-emerald-600/30 dark:border-emerald-300/25",
    hoverBorder: "hover:border-emerald-500/65",
    ring: "focus-visible:ring-emerald-500/70",
    bullet: "bg-emerald-500",
    arrow: "group-hover:text-emerald-500 dark:group-hover:text-emerald-300",
    button: "border-emerald-600/35 text-emerald-700 dark:border-emerald-300/35 dark:text-emerald-300",
    primary: "bg-emerald-700 hover:bg-emerald-600",
    card: "bg-white dark:bg-[#161922]",
  },
  violet: {
    text: "text-violet-700 dark:text-violet-300",
    soft: "bg-violet-600/10 dark:bg-violet-400/10",
    border: "border-violet-600/30 dark:border-violet-300/25",
    hoverBorder: "hover:border-violet-500/65",
    ring: "focus-visible:ring-violet-500/70",
    bullet: "bg-violet-500",
    arrow: "group-hover:text-violet-500 dark:group-hover:text-violet-300",
    button: "border-violet-600/35 text-violet-700 dark:border-violet-300/35 dark:text-violet-300",
    primary: "bg-violet-700 hover:bg-violet-600",
    card: "bg-white dark:bg-[#161922]",
  },
  amber: {
    text: "text-amber-700 dark:text-amber-300",
    soft: "bg-amber-600/10 dark:bg-amber-400/10",
    border: "border-amber-600/30 dark:border-amber-300/25",
    hoverBorder: "hover:border-amber-500/65",
    ring: "focus-visible:ring-amber-500/70",
    bullet: "bg-amber-500",
    arrow: "group-hover:text-amber-500 dark:group-hover:text-amber-300",
    button: "border-amber-600/35 text-amber-700 dark:border-amber-300/35 dark:text-amber-300",
    primary: "bg-amber-700 hover:bg-amber-600",
    card: "bg-white dark:bg-[#161922]",
  },
  rose: {
    text: "text-rose-700 dark:text-rose-300",
    soft: "bg-rose-600/10 dark:bg-rose-400/10",
    border: "border-rose-600/30 dark:border-rose-300/25",
    hoverBorder: "hover:border-rose-500/65",
    ring: "focus-visible:ring-rose-500/70",
    bullet: "bg-rose-500",
    arrow: "group-hover:text-rose-500 dark:group-hover:text-rose-300",
    button: "border-rose-600/35 text-rose-700 dark:border-rose-300/35 dark:text-rose-300",
    primary: "bg-rose-700 hover:bg-rose-600",
    card: "bg-white dark:bg-[#161922]",
  },
  blue: {
    text: "text-blue-700 dark:text-blue-300",
    soft: "bg-blue-600/10 dark:bg-blue-400/10",
    border: "border-blue-600/30 dark:border-blue-300/25",
    hoverBorder: "hover:border-blue-500/65",
    ring: "focus-visible:ring-blue-500/70",
    bullet: "bg-blue-500",
    arrow: "group-hover:text-blue-500 dark:group-hover:text-blue-300",
    button: "border-blue-600/35 text-blue-700 dark:border-blue-300/35 dark:text-blue-300",
    primary: "bg-blue-700 hover:bg-blue-600",
    card: "bg-white dark:bg-[#161922]",
  },
};

/**
 * Sections alternate between these two neutral surfaces rather than each owning a hue.
 * Every section already announces itself with a numbered accent eyebrow and a bold title,
 * so a tinted background was a third, redundant signal — and the only one large enough to
 * make a whole screen read as "the yellow one". Keeping both surfaces neutral means
 * adjacent sections always separate without any of them carrying a colour.
 * Accent colour still lives in the eyebrows, card borders, bullets, and buttons.
 */
const SURFACE_BASE = "bg-[#fbfaf7] dark:bg-[#0a0c12]";
const SURFACE_RAISED = "bg-[#f4f2ec] dark:bg-[#0f1219]";
/** Hairline at every section boundary, so the seam is crisp at either tone. */
const SURFACE_EDGE = "border-t border-black/5 dark:border-white/10";

// Retain the teaching content for a future alternate layout without showing it in the
// current, research-focused portfolio narrative.
const SHOW_TEACHING = false;

const aboutFocus: Array<{ Icon: LucideIcon; label: string; detail: string; tone: Tone }> = [
  {
    Icon: Code2,
    label: "Applied ML",
    detail: "Working across models, data, and evaluation when problems need measurement",
    tone: "cyan",
  },
  {
    Icon: Cpu,
    label: "Systems curiosity",
    detail: "Digging into CUDA, inference behavior, architecture, and the parts below the interface",
    tone: "violet",
  },
  {
    Icon: Users,
    label: "Teaching and teams",
    detail: "Learning by building with researchers, students, robot operators, and project teams",
    tone: "emerald",
  },
];

const experienceRoles: RoleEntry[] = [
  {
    logo: "SNL",
    logoImg: logoSandia,
    company: "Sandia National Laboratories",
    role: "Software Engineer Intern",
    period: "Sep 2026 — Present",
    isActive: true,
    summary: "Building cloud-data infrastructure and agentic benchmarks for security-focused AI evaluation.",
    bullets: [
      "Developing Google Cloud Vertex AI benchmarks that probe hidden software triggers, exploitable vulnerabilities, and unsafe tool execution through reproducible adversarial scenarios.",
      "Building Databricks ingestion and transformation workflows for heterogeneous CISA cloud telemetry, with custom parsers, schema normalization, and input validation for reliable downstream analysis.",
      "Automating benchmark execution and failure analysis in isolated Docker and Linux environments so agent behavior can be reproduced and debugged consistently.",
    ],
    tags: ["Databricks", "Vertex AI", "Agentic Benchmarking", "Cloud Telemetry", "Docker", "Linux"],
  },
  {
    logo: "Capit",
    logoImg: logoC1,
    company: "Capital One",
    role: "Software Engineer Intern",
    period: "Jun 2026 — Aug 2026",
    summary: "Improved the data and serving infrastructure behind promotional-deal recommendations across Capital One products.",
    bullets: [
      "Built Databricks and PySpark sampled offline replay over 800M+ daily outcomes, accelerating recommender and campaign testing 28× through intent-aware sampling and Airflow orchestration.",
      "Implemented 18 automated PySpark checks for sampling parity, rare-event coverage, schema quality, and replay stability; optimized jobs with partitioning, broadcast joins, and caching.",
      "Moved 95/5 ML/control routing from a network API into an in-process SDK, preventing timeout-driven cohort misclassification and reducing serving latency 25% for 60M+ monthly users.",
      "Added unit and end-to-end coverage for routing and ranking behavior, validating production results with Postman and AWS CloudWatch.",
    ],
    tags: ["Python", "PySpark", "Databricks", "Airflow", "Recommender Systems", "AWS CloudWatch"],
  },
  {
    logo: "URP",
    logoImg: logoURP,
    company: "Underwater Robotics Project @ UCI",
    role: "Perception Engineer",
    period: "Sep 2026 — Present",
    isActive: true,
    summary: "Developing perception and navigation software for UCI's autonomous underwater robot.",
    bullets: [
      "Developing pathfinding logic for an autonomous underwater robot, using perception outputs to plan routes and navigate competition tasks under RoboSub constraints.",
      "Building a sensor-fusion node that combines sonar and camera data, giving downstream navigation software a more complete view of the underwater environment.",
      "Implementing object-detection pipelines with OpenCV, PyTorch, and CNN-based models to recognize competition targets and pass detections into the robot's autonomy stack.",
    ],
    tags: ["OpenCV", "CNNs", "PyTorch", "C++", "Python"],
  },
  {
    logo: "Block",
    logoImg: logoBlockchain,
    company: "Blockchain @ UCI",
    role: "Software Engineer",
    period: "Oct 2025 — Present",
    isActive: true,
    summary: "Contributing to Blockchain @ UCI projects spanning multi-agent systems and smart-contract security tooling.",
    bullets: [
      "Built Agonus, an on-chain trading tournament platform with LangChain agents, live competitions, betting, token rewards, rankings, and real-time monitoring.",
      "Architected 10+ concurrent ReAct agents with tools for market research, trade planning, memory, and Uniswap V3 execution, using Celery and Redis for scheduling, locking, and crash recovery.",
      "Developed FastAPI and PostgreSQL services, Solidity betting contracts on OP Sepolia, and Next.js wallet flows with Wagmi and Viem.",
      "Now developing an AI smart-contract security copilot with Foundry, Slither, automated tests, and contract-analysis workflows for surfacing vulnerabilities.",
    ],
    tags: ["LangChain", "FastAPI", "Solidity", "Celery", "Redis", "Foundry", "Slither"],
  },
  {
    logo: "CareT",
    logoImg: logoCaretech,
    company: "CareTech @ UCI",
    role: "Software Developer",
    period: "Oct 2025 — Jun 2026",
    summary: "Built Vitamind, a computer-vision food scanner for real-time recognition and nutrient tracking.",
    bullets: [
      "Built a Next.js and FastAPI food-scanning application that connected real-time PyTorch inference with nutrition APIs and live vitamin-intake totals.",
      "Processed and augmented 28K+ images across 270+ food categories using Python, OpenCV, Roboflow, and PyTorch.",
      "Trained vision models to 81% test accuracy through augmentation and data ablation, then integrated inference into the user-facing tracking workflow.",
    ],
    tags: ["Python", "PyTorch", "OpenCV", "Roboflow", "Next.js", "FastAPI", "Supabase"],
  },
  {
    logo: "Comm",
    logoImg: logoCTC,
    company: "Commit the Change @ UCI",
    role: "Full-Stack Developer",
    period: "Oct 2025 — Jun 2026",
    summary: "Built scheduling and operations software for a community health center serving thousands of patients.",
    bullets: [
      "Developed a React and TypeScript scheduling and quota platform supporting 6,000–8,000 patients annually.",
      "Built Node.js, Express, and PostgreSQL tools for 24+ providers, saving 10–12 staff hours per week through centralized coordination.",
      "Designed Chakra UI and Zustand workflows for provider management, quota tracking, and staff access controls.",
      "Reduced scheduling conflicts 40% and patient calls 30% by consolidating provider and quota operations into one system.",
    ],
    tags: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Chakra UI"],
  },
  {
    logo: "SENS",
    logoImg: logoSENS,
    company: "SENS Psychology",
    role: "Software Development Intern",
    period: "Sep 2025 — Jan 2026",
    summary: "Replaced manual intake and staff coordination with an internal workflow and automation platform.",
    bullets: [
      "Built a Next.js and TypeScript intake platform supporting 30+ staff and more than 1,200 monthly patient interactions.",
      "Reduced intake time 50% and manual email work 60% with Node.js, PostgreSQL, Azure notifications, and workflow automation.",
      "Implemented intake, ticketing, call-routing, and task workflows to replace fragmented staff operations.",
      "Modeled messaging and task lifecycles with Prisma and ZenStack for maintainable, scalable automation.",
    ],
    tags: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Azure"],
  },
];

const researchRoles: RoleEntry[] = [
  {
    logo: "C2",
    logoImg: logoCalit2,
    company: "Calit2 @ UCI",
    role: "Machine Learning Research Assistant",
    period: "Apr 2026 — Present",
    isActive: true,
    summary: "Developing physics-informed machine learning pipelines to replace slow heat-transfer simulations with faster surrogate models.",
    bullets: [
      "Built physics-informed PyTorch GRU sequence models as thermal simulation surrogates, incorporating governing equations, scheduled sampling, and long-horizon rollout constraints to predict spatial wall temperatures from input sequences.",
      "Achieved 12,000× faster inference than FEA with R² = 0.99 and MAE = 1.54°C on thermal predictions.",
    ],
    tags: ["Python", "PyTorch", "GRU", "LSTM", "PINN", "Physics-Informed ML"],
  },
  {
    logo: "UCI",
    logoImg: logoDLL,
    company: "Digital Learning Lab @ UCI",
    role: "Research Assistant",
    period: "Dec 2025 — Present",
    isActive: true,
    summary: "Studying how language models reason, express confidence, and recover from failure in complex agentic systems.",
    bullets: [
      "Designed Advocate/Skeptic/Judge multi-agent LLM pipelines with role-specific system prompts, prompt engineering, and LLM-as-judge rubrics to score evidence grounding, reasoning quality, critical failures, and four ASAP essay traits.",
      "Analyzed token-level confidence across multi-agent responses with log-probabilities, AUROC, and Spearman correlations; found early-token signals more predictive than sequence-level confidence, informing three peer-reviewed publications in 2026.",
      "Replicated BIRD-Interact multi-turn Text-to-SQL and built prompt-engineered agents for database and schema exploration, ambiguity resolution, query planning and generation, SQL execution, error feedback, and iterative schema and query repair.",
      "Evaluated multi-step SQL agent traces with token-confidence failure localization and LLM-as-judge, analyzing schema and identifier errors, execution feedback, and recovery through iterative SQL repair.",
      "Investigating student-simulator agents and ParaStudent-style evaluation, including fine-tuning language models to reproduce student revisions, feedback uptake, and engagement for scalable AI-tutor benchmarking.",
    ],
    featured: [
      {
        text: "Paper accepted to ICLR 2026 LLM Reasoning Workshop — \"The First Tokens Matter: Early Confidence Signals for Evaluating LLM Reasoning\"",
        url: "https://openreview.net/forum?id=0FOOrwSQ9E",
      },
      {
        text: "ACL 2026 Student Research Workshop — \"The Confident Liar: Diagnosing Multi-Agent Debate with Log-Probabilities and LLM-as-Judge\"",
        url: "https://aclanthology.org/2026.acl-srw.121/",
      },
      {
        text: "GEM 2026 — \"Early-Token Confidence Predicts Reasoning Quality in Multi-Agent LLM Debate\"",
        url: "https://aclanthology.org/2026.gem-main.60/",
      },
    ],
    tags: ["Python", "LangGraph", "Text-to-SQL", "LLM-as-Judge", "Token Log-Probabilities", "Multi-Agent Systems"],
  },
];

const teachingRoles: RoleEntry[] = [
  {
    logo: "Robo",
    logoImg: logoRFA,
    company: "Robotics for All",
    role: "Lead Instructor",
    period: "Jan 2023 — Dec 2024",
    bullets: [
      "Instructed classes of 30+ middle school students in Python, Java, and robotics fundamentals.",
      "Designed hands-on project-based curriculum emphasizing STEM accessibility and creative problem solving.",
      "Guided students from zero programming experience to building functional robotics projects.",
    ],
    tags: ["Python", "Java", "Robotics", "Curriculum Design", "STEM Education"],
  },
  {
    logo: "PECS",
    company: "PECS",
    role: "Cybersecurity Instructor",
    period: "Sep 2023 — Jun 2024",
    bullets: [
      "Hosted bi-monthly cybersecurity workshops at local senior centers.",
      "Covered password management, phishing detection, safe browsing, and privacy settings.",
      "Improved digital literacy and online safety for vulnerable populations.",
    ],
    tags: ["Cybersecurity", "Workshop Design", "Community Education"],
  },
];

const projects: Project[] = [
  {
    name: "PyTorch",
    monogram: "PT",
    desc: "Open-source compiler fixes and regression tests for PyTorch's Dynamo graph-capture stack.",
    detail: "Ongoing contributions to PyTorch Dynamo, the compiler infrastructure that captures Python programs as optimized computation graphs.",
    highlights: [
      "Merged 3+ fixes addressing compiler correctness, graph-capture behavior, and exception handling in PyTorch Dynamo.",
      "Added targeted regression tests that reproduce failures and protect the affected compiler paths from future regressions.",
    ],
    evidenceLinks: [
      {
        href: "https://github.com/pytorch/pytorch/pull/197798",
        label: "#197798 — Support constant non-string assert messages",
      },
      {
        href: "https://github.com/pytorch/pytorch/pull/196103",
        label: "#196103 — Support zero-argument bytes()",
      },
      {
        href: "https://github.com/pytorch/pytorch/pull/196722",
        label: "#196722 — Support delattr on exception attributes",
      },
    ],
    tech: ["Python", "PyTorch", "Dynamo", "Compilers", "Testing"],
    accentLine: "bg-orange-500",
    repoUrl: "https://github.com/pytorch/pytorch",
    imgUrl: projPyTorch,
    imageFit: "contain",
    group: "Open Source",
    isActive: true,
  },
  {
    name: "context-cuda",
    monogram: "CTX",
    desc: "A hand-written attention path for running long-context models on the GPU.",
    detail: "A C++ and CUDA PyTorch extension for understanding and optimizing the inference-time attention path behind long-context language models.",
    highlights: [
      "Implementing fused scaled dot-product attention with causal masking directly in CUDA rather than composing built-in PyTorch operations.",
      "Applying rotary position embeddings inside the kernel and managing a KV cache so new tokens do not recompute the full sequence.",
      "Using Python reference implementations and correctness tests to validate the math before benchmarking custom kernels.",
    ],
    tech: ["CUDA", "C++", "PyTorch", "Python"],
    accentLine: "bg-fuchsia-500",
    repoUrl: "https://github.com/jacobhorne-jth/context-cuda",
    isHidden: true,
  },
  {
    name: "Lazarus",
    monogram: "LAZ",
    desc: "A way to keep smart devices working after the company behind them shuts the servers off.",
    detail: "A local replacement for vendor cloud services that keeps otherwise functional smart devices usable after their original servers disappear.",
    highlights: [
      "Guides controlled experiments while recording and comparing device traffic to infer how actions map onto undocumented protocols.",
      "Handles heterogeneous communication patterns including JSON, MQTT, and raw binary messages instead of assuming one device format.",
      "Turns the recovered protocol mapping into self-hosted software that can stand in for the discontinued vendor cloud.",
    ],
    tech: ["Protocol Analysis", "Reverse Engineering", "MQTT", "Embedded"],
    accentLine: "bg-cyan-500",
    repoUrl: "https://github.com/jacobhorne-jth/lazarus",
    isHidden: true,
  },
  {
    name: "Agonus",
    monogram: "AGN",
    desc: "A trading arena where automated competitors face off and viewers can follow the action live.",
    detail: "An agentic crypto tournament platform where autonomous traders compete on-chain while viewers follow rankings, bets, rewards, and live execution.",
    highlights: [
      "Architected 10+ LangChain ReAct agents with tools for market data, trade execution, planning, and memory.",
      "Orchestrated concurrent agents with Celery and Redis scheduling, distributed locks, and crash recovery during live tournaments.",
      "Built FastAPI services, PostgreSQL and SQLAlchemy data models, Solidity betting contracts on OP Sepolia, and Uniswap V3 execution.",
      "Developed a Next.js interface with Wagmi and Viem wallet authentication, transaction signing, and synchronized tournament state.",
    ],
    tech: ["LangChain", "FastAPI", "Celery", "Redis", "Solidity", "PostgreSQL"],
    accentLine: "bg-yellow-500",
    repoUrl: "https://github.com/blockchainuci/Agonus",
    imgUrl: projAgonus,
    group: "Blockchain @ UCI",
  },
  {
    name: "EthicChat",
    monogram: "ETH",
    desc: "An ethics-gated banking assistant grounded in trusted internal documents and policy controls.",
    detail: "A React and FastAPI financial assistant that combines retrieval-augmented generation with explicit ethics checks and human escalation for safer customer guidance.",
    highlights: [
      "Owned the RAG pipeline from PDF and OCR ingestion through document classification, OpenAI embeddings, and PostgreSQL/pgvector retrieval.",
      "Integrated DeBERTa ethics checks, policy guardrails, and human escalation to intercept unsafe or unsupported model responses.",
      "Delivered grounded financial Q&A from customer documents, retrieved evidence, and banking metrics through a React interface and FastAPI backend.",
    ],
    tech: ["React", "FastAPI", "LangGraph", "RAG", "pgvector", "DeBERTa"],
    accentLine: "bg-sky-500",
    repoUrl: "https://github.com/TCS-COMPSCI-180A/chatbot",
    imgUrl: logoTCS,
    imageFit: "contain",
    group: "Tata Consultancy Services",
  },
  {
    name: "Prop.Intel",
    monogram: "PRP",
    desc: "A property research tool that turns ownership and risk data into readable reports.",
    detail: "A full-stack property intelligence platform that combines ownership records, hazard data, predictive modeling, and readable AI summaries into real-time risk reports.",
    highlights: [
      "Integrated ATTOM ownership data, FEMA National Risk Index datasets, and parallel multi-API pipelines with caching for responsive report generation.",
      "Trained ridge regression across 3,100+ counties and eight hazard categories to estimate annual property loss from risk data.",
      "Built dashboards with ownership timelines, hazard breakdowns, and AI-generated summaries to make risk factors easier to interpret.",
    ],
    tech: ["Next.js", "TypeScript", "Python", "Ridge Regression"],
    accentLine: "bg-orange-500",
    repoUrl: "https://github.com/jacobhorne-jth/prop-intel",
    imgUrl: projPropIntel,
    group: "IrvineHacks 2026",
  },
  {
    name: "chrome-org",
    monogram: "ORG",
    desc: "A workspace switcher that gives each project its own Chrome window, tabs, and shortcuts.",
    detail: "A local-first Chrome workspace launcher for separating projects into dedicated windows, saved sessions, and repeatable development setups.",
    highlights: [
      "Gives each workspace its own Chrome window and saved tab session, with optional launch actions for VS Code projects, macOS apps, files, and Discord channels.",
      "Built an MV3 browser extension with a native-messaging companion for the operating-system actions Chrome cannot perform directly.",
      "Designed a keyboard-first command palette with no account, backend, or sync service so workspace data stays on the machine.",
    ],
    tech: ["TypeScript", "React", "Vite", "Chrome MV3", "Node.js"],
    accentLine: "bg-indigo-500",
    repoUrl: "https://github.com/jacobhorne-jth/chrome-org",
    imgUrl: projChromeOrg,
  },
  {
    name: "Portfolio Website",
    monogram: "JH",
    desc: "A personal site for showing the work I care about without making it feel static.",
    detail: "A personal portfolio built as an interactive, responsive account of my engineering and research work rather than a static résumé page.",
    highlights: [
      "Built the interface with React, TypeScript, Tailwind CSS, and Vite, including responsive layouts and light and dark themes.",
      "Created structured detail modals that keep overview cards concise while preserving technical evidence for each role and project.",
      "Added an interactive terminal, animated mesh environment, and occasional fish behavior as personal, code-driven visual elements.",
    ],
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    accentLine: "bg-blue-500",
    repoUrl: "https://github.com/jacobhorne-jth/jacobhorne-jth.github.io",
    imgUrl: projWebsite,
  },
  {
    name: "GitHub Onboarding Agent",
    monogram: "GOA",
    desc: "A guide that helps someone understand an unfamiliar code project faster.",
    detail: "An AI onboarding assistant that ingests a GitHub repository and turns an unfamiliar codebase into structured explanations, searchable context, and guided exploration.",
    highlights: [
      "Generated project overviews, component summaries, and file-level explanations to help new contributors understand unfamiliar repositories.",
      "Built a RAG pipeline with LangChain, Hugging Face embeddings, and Pinecone for code-aware Q&A, dependency insights, and “where-am-I?” tracing.",
      "Developed a FastAPI backend and Streamlit interface powered by LangGraph multi-step reasoning and tool calling for interactive repository exploration.",
    ],
    tech: ["Python", "FastAPI", "LangChain", "LangGraph", "Pinecone"],
    accentLine: "bg-purple-500",
    repoUrl: "https://github.com/jacobhorne-jth/github-onboarding-agent",
    imgUrl: projOnboarding,
  },
  {
    name: "SF Crime Mapper",
    monogram: "SCM",
    desc: "An interactive map for exploring where neighborhood safety risks may be changing.",
    detail: "A full-stack forecasting dashboard that maps changing incident risk across San Francisco neighborhoods and exposes model results through an interactive choropleth.",
    highlights: [
      "Built an interactive React dashboard with Mapbox to visualize neighborhood-level crime predictions in real time.",
      "Designed frontend components and API integrations around a FastAPI backend with dynamically updated map data.",
      "Connected the interface to Python, scikit-learn, XGBoost, and Prophet models for neighborhood risk forecasting.",
      "Engineered reusable JavaScript hooks and state logic to keep data flow between the interface and backend maintainable.",
    ],
    tech: ["FastAPI", "Prophet", "XGBoost", "React", "Vite"],
    accentLine: "bg-amber-500",
    repoUrl: "https://github.com/jacobhorne-jth/sf-crime-mapper",
    imgUrl: projCrimeMap,
  },
  {
    name: "Earnings Web Scraper",
    monogram: "EWS",
    desc: "A tool for checking when S&P 500 companies report earnings and how the stock has moved since.",
    detail: "A Streamlit app that pulls the S&P 500 constituent list from Wikipedia using Scrapy and BeautifulSoup, then scrapes Yahoo Finance for each ticker's next earnings date and one-month return.",
    tech: ["Python", "Streamlit", "Scrapy", "BeautifulSoup"],
    accentLine: "bg-lime-500",
    repoUrl: "https://github.com/jacobhorne-jth/earnings-web-scraper",
    isHidden: true,
  },
  {
    name: "SMS Spam Detector",
    monogram: "SMS",
    desc: "A simple message checker that flags likely spam before someone trusts it.",
    detail: "FastAPI app that detects SMS spam with Logistic Regression, combining TF-IDF text analysis and engineered features like phone number detection and spam keywords.",
    tech: ["Python", "FastAPI", "Logistic Regression", "TF-IDF"],
    accentLine: "bg-rose-500",
    repoUrl: "https://github.com/jacobhorne-jth/sms-spam-detector",
    imgUrl: projSMS,
    isHidden: true,
  },
];

const papers: Paper[] = [
  {
    conference: "ICLR 2026",
    track: "LLM Reasoning Workshop",
    title: "The First Tokens Matter: Early Confidence Signals for Evaluating LLM Reasoning",
    detail: "Explores whether early token-level confidence can predict reasoning quality and expose failure modes in LLM outputs.",
    highlights: [
      "Paired Advocate and Skeptic debate agents with an LLM-as-judge that scored instruction following, justification quality, evidence grounding, and critical failures across two ASAP essay sets.",
      "Found that dispersion in the first three to five generated tokens consistently outperformed full-sequence confidence statistics for predicting judged reasoning quality.",
      "Identified a stable role asymmetry: confidence tracked supportive Advocate reasoning more reliably than adversarial Skeptic critique, with early-token signals detecting Advocate failures at up to 0.849 AUROC versus roughly 0.63 for the Skeptic.",
    ],
    url: "https://openreview.net/forum?id=0FOOrwSQ9E",
    tags: ["LLM Evaluation", "Confidence", "Reasoning"],
  },
  {
    conference: "ACL 2026",
    track: "Student Research Workshop",
    title: "The Confident Liar: Diagnosing Multi-Agent Debate with Log-Probabilities and LLM-as-Judge",
    detail: "Studies multi-agent debate behavior through log-probability signals, judge scoring, and failure analysis.",
    highlights: [
      "Compared token-level log-probability trajectories, LLM-as-judge rubric scores, and final task accuracy across rubric scoring, mathematical reasoning, and factual question answering.",
      "Evaluated a Constructor/Auditor debate architecture using judge dimensions for instruction following, justification quality, evidence grounding, and critical reasoning failures.",
      "Observed a four-phase confidence trajectory and strong role asymmetry: critical-failure detection reached 0.804 AUROC for the Constructor versus 0.634 for the Auditor.",
    ],
    url: "https://aclanthology.org/2026.acl-srw.121/",
    tags: ["Multi-Agent Systems", "NLP", "Log-Probabilities"],
  },
  {
    conference: "GEM 2026",
    title: "Early-Token Confidence Predicts Reasoning Quality in Multi-Agent LLM Debate",
    detail: "Connects early confidence patterns to downstream reasoning quality in debate-style LLM evaluation workflows.",
    highlights: [
      "Evaluated token-level confidence against LLM-as-judge rubric scores in a debate-based essay-scoring framework across two ASAP essay sets.",
      "Found that confidence within the first few generated tokens was the strongest predictor of reasoning quality, outperforming statistics computed over the full response.",
      "Showed that the opening phase of generation contains the most informative variation and that confidence aligns more strongly with supportive reasoning than adversarial critique.",
    ],
    url: "https://aclanthology.org/2026.gem-main.60/",
    tags: ["LLMs", "Evaluation", "Debate"],
  },
];

const coursework = [
  "CS 178 — Machine Learning and Data Mining",
  "CS 171 — Introduction to Artificial Intelligence",
  "CS 143A — Principles of Operating Systems",
  "CS 116 — Computational Photography and Vision",
  "CS 147 — Internet of Things Software and Systems",
  "CS 180A — Project in Computer Science",
  "CS 180B — Project in Computer Science",
  "ICS 46 — Data Structure Implementation and Analysis",
  "ICS 51 — Introductory Computer Organization",
  "ICS 45C — Programming in C/C++ as a Second Language",
  "ICS H32 — Python Programming & Libraries (Accelerated)",
  "MATH 3A — Introduction to Linear Algebra",
  "STATS 67 — Introduction to Probability & Statistics for Computer Science",
  "IN4MATX 43 — Introduction to Software Engineering",
];


const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#research" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Now", href: "#now" },
];

// ─── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({
  number,
  title,
  subtitle,
  tone = "blue",
}: {
  number: string;
  title: string;
  subtitle?: string;
  tone?: Tone;
}) {
  const toneClass = toneStyles[tone];

  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3">
        <span className={`text-xs font-bold tracking-[0.2em] uppercase select-none ${toneClass.text}`}>
          {number}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {subtitle && <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

// ─── Detail Cards ─────────────────────────────────────────────────────────────

const roleToDetail = (entry: RoleEntry, section: string, tone: Tone): DetailItem => {
  const featured = entry.featured ? (Array.isArray(entry.featured) ? entry.featured : [entry.featured]) : [];

  return {
    id: `${section}-${entry.company}-${entry.role}`,
    eyebrow: section,
    title: entry.company,
    subtitle: entry.role,
    summary: entry.summary ?? entry.bullets[0] ?? entry.role,
    chips: entry.tags.slice(0, 4),
    period: entry.period,
    logo: entry.logo,
    logoImg: entry.logoImg,
    meta: undefined,
    paragraphs: [],
    highlights: entry.summary
      ? entry.bullets
      : [...entry.bullets.slice(1), ...featured.map(f => f.text)],
    tags: entry.tags,
    links: entry.companyLink ? [{ href: entry.companyLink, label: "Open organization" }] : undefined,
    isActive: entry.isActive,
    tone,
  };
};

const projectToDetail = (project: Project): DetailItem => ({
  id: `project-${project.name}`,
  eyebrow: project.group ?? "Project",
  title: project.name,
  chips: project.tech.slice(0, 3),
  summary: project.desc,
  logo: project.monogram,
  image: project.imgUrl,
  imageAlt: project.name,
  imageFit: project.imageFit,
  // No meta row: the eyebrow already shows project.group, and the stack and links have
  // their own sections, so anything here would just repeat something above it.
  meta: undefined,
  paragraphs: project.highlights?.length ? [] : [project.detail],
  highlights: [
    ...(project.highlights ?? []),
    ...(project.demoUrl ? ["Includes a live demo surface for trying the system."] : []),
  ],
  tags: project.tech,
  // Demo first when there is one, but the repo always gets its own link rather than being
  // hidden behind the demo the way a single-link card did it.
  links: [
    ...(project.demoUrl ? [{ href: project.demoUrl, label: "Open demo" }] : []),
    ...(project.repoUrl !== "#" ? [{ href: project.repoUrl, label: "Open code" }] : []),
  ],
  evidenceLinks: project.evidenceLinks,
  accentLine: project.accentLine,
  isActive: project.isActive,
  tone: "violet",
});

const paperToDetail = (paper: Paper): DetailItem => ({
  id: `paper-${paper.title}`,
  eyebrow: "Digital Learning Lab @ UCI",
  title: paper.title,
  badge: { label: paper.conference, note: paper.track },
  // The collapsed card is deliberately just venue + title + topic chips. It previously also
  // carried the lab logo, an association line, and a summary
  // paragraph — the logo and the lab line were identical on all three papers, and with the
  // logo taking a column the titles wrapped to four lines. The detail lives in the modal.
  summary: "",
  // The badge carries the venue now, so the meta row only adds the lab.
  meta: ["Lab — Digital Learning Lab @ UCI"],
  paragraphs: [paper.detail],
  highlights: paper.highlights,
  tags: paper.tags,
  links: paper.url ? [{ href: paper.url, label: "Open paper" }] : undefined,
  tone: "cyan",
});

const educationDetail: DetailItem = {
  id: "education-uci",
  eyebrow: "Education",
  title: "University of California, Irvine",
  subtitle: "B.S. Computer Science",
  summary: "3.92 GPA\nDean's List x 6\nCampuswide Honors Collegium",
  period: "Expected Jun 2028",
  logo: "UCI",
  logoImg: logoUCI,
  meta: undefined,
  paragraphs: [],
  highlights: coursework,
  tags: ["Machine Learning", "AI", "Data Structures", "C/C++", "Software Engineering"],
  tone: "rose",
};

function DetailLogo({ item, size = "card" }: { item: DetailItem; size?: "card" | "modal" }) {
  const imageFrame = size === "modal" ? "h-24 w-32" : "h-14 w-20";
  const logoFrame = size === "modal" ? "h-20 w-20" : "h-16 w-16";

  if (item.image) {
    const fit = item.imageFit === "contain" ? "object-contain p-1.5" : "object-cover object-top";
    return (
      <div className={`${imageFrame} rounded-md bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 overflow-hidden shrink-0`}>
        <img src={item.image} alt={item.imageAlt ?? item.title} loading="lazy" decoding="async" className={`h-full w-full ${fit}`} />
      </div>
    );
  }

  // No artwork means no frame. A monogram placeholder would only add a box to look at,
  // and on the papers every one of them would read the same.
  if (!item.logoImg) return null;

  return (
    <div className={`${logoFrame} rounded-lg bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-2`}>
      <img src={item.logoImg} alt={item.title} loading="lazy" decoding="async" className="h-full w-full object-contain" />
    </div>
  );
}

function DetailCard({ item, onOpen }: { item: DetailItem; onOpen: (item: DetailItem) => void }) {
  const tone = toneStyles[item.tone ?? "blue"];

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`group relative min-h-[190px] w-full overflow-hidden rounded-lg border border-gray-200/90 bg-white/90 p-6 text-left shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-lg hover:shadow-slate-950/[0.08] focus:outline-none focus-visible:ring-2 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.06] ${tone.ring}`}
    >
      {item.accentLine && <div className={`absolute inset-x-0 top-0 h-0.5 ${item.accentLine}`} />}
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {item.badge ? (
                <>
                  <span className={`inline-flex items-center rounded px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.12em] ${tone.soft} ${tone.text}`}>
                    {item.badge.label}
                  </span>
                  {item.badge.note && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500 dark:text-slate-400">
                      {item.badge.note}
                    </span>
                  )}
                </>
              ) : (
                <p className="rounded-full bg-gray-100 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500 dark:bg-white/[0.06] dark:text-slate-400">
                  {item.period ?? item.eyebrow}
                </p>
              )}
              {/* Fixed emerald rather than the section tone. "Active" is a state, not a
                  category, so it should look identical wherever it appears — inheriting the
                  tone made it cyan under Research, emerald under Experience and violet under
                  Projects, and the cyan in particular read as a link rather than a status.
                  Sized to match the period beside it so the two sit as one line. */}
              {item.isActive && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold leading-snug tracking-[-0.015em] text-gray-950 dark:text-white">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className={`mt-1.5 text-sm font-medium ${tone.text}`}>{item.subtitle}</p>
            )}
          </div>
          <DetailLogo item={item} />
        </div>

        {item.summary && (
          <p className="whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-slate-300">{item.summary}</p>
        )}

        {item.chips && item.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.chips.map(chip => (
              <span
                key={chip}
                className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-[10px] text-gray-600 dark:bg-white/[0.06] dark:text-slate-400"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200/70 pt-4 dark:border-white/[0.07]">
          <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${tone.text}`}>
            View details
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200 dark:bg-white/[0.06] dark:group-hover:bg-white/10">
            <ArrowRight className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-slate-400 ${tone.arrow}`} />
          </span>
        </div>
      </div>
    </button>
  );
}

function ProjectCard({ item, onOpen }: { item: DetailItem; onOpen: (item: DetailItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group flex min-h-[210px] w-full flex-col rounded-lg border border-gray-200/90 bg-white/80 p-5 text-left shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-lg hover:shadow-slate-950/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 dark:border-white/10 dark:bg-white/[0.025] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.045]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-500 dark:text-slate-500">
            {item.eyebrow}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-gray-950 dark:text-white">
              {item.title}
            </h3>
            {item.isActive && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-current" /> active
              </span>
            )}
          </div>
        </div>
        <DetailLogo item={item} />
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-slate-300">{item.summary}</p>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-gray-200/70 pt-4 dark:border-white/[0.07]">
        <div className="flex min-w-0 flex-wrap gap-x-2.5 gap-y-1">
          {item.chips?.map(chip => (
            <span key={chip} className="font-mono text-[9px] text-gray-500 dark:text-slate-500">
              {chip}
            </span>
          ))}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-violet-600 dark:text-slate-600 dark:group-hover:text-violet-300" />
      </div>
    </button>
  );
}

function ExperienceRow({ item, onOpen }: { item: DetailItem; onOpen: (item: DetailItem) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group grid w-full gap-4 border-t border-gray-200/80 px-4 py-6 text-left transition-colors first:border-t-0 hover:bg-blue-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/60 dark:border-white/10 dark:hover:bg-white/[0.04] md:grid-cols-[72px_minmax(0,1fr)_150px] md:items-start md:px-6"
    >
      <DetailLogo item={item} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-gray-950 dark:text-white">{item.title}</h3>
          {item.isActive && (
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-current" /> active
            </span>
          )}
        </div>
        {item.subtitle && <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-300">{item.subtitle}</p>}
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 dark:text-slate-300">{item.summary}</p>
        {item.chips && (
          <p className="mt-4 font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-gray-500 dark:text-slate-500">
            {item.chips.join("  /  ")}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">{item.period}</p>
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-blue-700 opacity-70 transition-opacity group-hover:opacity-100 dark:text-blue-300">
          details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

function PublicationCard({
  item,
  index,
  onOpen,
}: {
  item: DetailItem;
  index: number;
  onOpen: (item: DetailItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group grid w-full grid-cols-[40px_minmax(0,1fr)_32px] items-start gap-x-4 gap-y-4 border-t border-gray-200/80 px-5 py-6 text-left transition-colors first:border-t-0 hover:bg-cyan-50/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/60 dark:border-white/10 dark:hover:bg-cyan-300/[0.035] md:grid-cols-[64px_190px_minmax(0,1fr)_40px] md:items-center md:gap-6 md:px-7 md:py-7"
    >
      <span className="pt-0.5 font-mono text-sm tracking-[0.16em] text-gray-400 transition-colors group-hover:text-cyan-700 dark:text-slate-600 dark:group-hover:text-cyan-300 md:text-base">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0">
        <p className="font-mono text-base font-bold uppercase tracking-[0.14em] text-cyan-800 dark:text-cyan-200 md:text-lg">
          {item.badge?.label}
        </p>
        {item.badge?.note && (
          <p className="mt-1.5 font-mono text-[9px] uppercase leading-4 tracking-[0.13em] text-gray-500 dark:text-slate-500">
            {item.badge.note}
          </p>
        )}
      </div>

      <h4 className="col-span-2 col-start-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-gray-950 transition-colors group-hover:text-cyan-950 dark:text-white dark:group-hover:text-cyan-50 md:col-span-1 md:col-start-auto md:text-xl">
        {item.title}
      </h4>

      <span className="col-start-3 row-start-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:border-cyan-600/30 group-hover:bg-cyan-600/10 group-hover:text-cyan-700 dark:border-white/10 dark:text-slate-600 dark:group-hover:border-cyan-300/25 dark:group-hover:bg-cyan-300/10 dark:group-hover:text-cyan-200 md:col-start-4 md:row-start-auto md:h-9 md:w-9">
        <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}

function DetailModal({ item, onClose }: { item: DetailItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previousBodyStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const previousRootOverflow = root.style.overflow;
    const previousScrollBehavior = root.style.scrollBehavior;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      // The site uses smooth scrolling for navigation. Disable it for this restoration
      // so unlocking the fixed body never flashes at the top before returning here.
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [item, onClose]);

  if (!item) return null;
  const tone = toneStyles[item.tone ?? "blue"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none bg-[#050710]/75 px-4 py-6 backdrop-blur-sm md:py-10" onClick={onClose}>
      <article
        className={`relative max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-md border bg-[#fbfaf7] p-7 shadow-2xl shadow-slate-950/25 dark:bg-[#0b0d12] md:max-h-[calc(100vh-5rem)] md:p-10 ${tone.border}`}
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} details`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pr-10">
          {item.badge ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center rounded px-2.5 py-1 font-mono text-sm font-bold uppercase tracking-[0.12em] ${tone.soft} ${tone.text}`}>
                {item.badge.label}
              </span>
              {item.badge.note && (
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-gray-500 dark:text-slate-400">
                  {item.badge.note}
                </span>
              )}
            </div>
          ) : (
            <p className={`font-mono text-xs uppercase tracking-[0.22em] ${tone.text}`}>
              {item.period ?? item.eyebrow}
            </p>
          )}
          <div className="mt-4 flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-3xl font-semibold leading-tight text-gray-950 dark:text-white md:text-4xl">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className={`mt-2 text-lg font-medium ${tone.text}`}>{item.subtitle}</p>
              )}
              {item.summary && (
                <p className="mt-5 whitespace-pre-line text-base leading-7 text-gray-700 dark:text-slate-300">
                  {item.summary}
                </p>
              )}
            </div>
            <DetailLogo item={item} size="modal" />
          </div>
        </div>

        {((item.meta && item.meta.length > 0) || (item.badge && item.links && item.links.length > 0)) && (
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {item.meta?.map(meta => (
                <span key={meta} className="rounded-md bg-gray-100 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-gray-600 dark:bg-white/[0.06] dark:text-slate-300">
                  {meta}
                </span>
              ))}
            </div>
            {item.badge && item.links && item.links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.links.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-colors ${tone.primary}`}
                  >
                    {link.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {item.paragraphs.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-slate-800">
            <div className="space-y-5">
              {item.paragraphs.map(paragraph => (
                <p key={paragraph} className="text-base leading-8 text-gray-700 dark:text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {item.highlights.length > 0 && (
          <div className="mt-9">
            <p className={`font-mono text-xs uppercase tracking-[0.2em] ${tone.text}`}>Highlights</p>
            <ul className="mt-4 space-y-3">
              {item.highlights.map(highlight => (
                <li key={highlight} className="flex gap-3 text-sm leading-7 text-gray-700 dark:text-slate-300">
                  <span className={`mt-3 h-1.5 w-1.5 shrink-0 rounded-sm ${tone.bullet}`} />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.evidenceLinks && item.evidenceLinks.length > 0 && (
          <div className="mt-9">
            <p className={`font-mono text-xs uppercase tracking-[0.2em] ${tone.text}`}>Merged pull requests</p>
            <div className="mt-4 overflow-hidden rounded-md border border-gray-200 dark:border-white/10">
              {item.evidenceLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3.5 text-sm text-gray-700 transition-colors first:border-t-0 hover:bg-violet-50 hover:text-gray-950 dark:border-white/10 dark:text-slate-300 dark:hover:bg-violet-300/[0.05] dark:hover:text-white"
                >
                  <span className="min-w-0">{link.label}</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-violet-600 dark:text-slate-600 dark:group-hover:text-violet-300" />
                </a>
              ))}
            </div>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="mt-9">
            <p className={`font-mono text-xs uppercase tracking-[0.2em] ${tone.text}`}>Stack</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span key={tag} className={`rounded border bg-gray-50 px-3 py-1.5 font-mono text-xs text-gray-700 dark:bg-[#111827] dark:text-slate-200 ${tone.border}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {!item.badge && item.links && item.links.length > 0 && (
          <div className="mt-9 flex flex-wrap gap-3">
            {item.links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={
                  i === 0
                    ? `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${tone.primary}`
                    : `inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5 ${tone.button}`
                }
              >
                {link.label}
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
      </article>
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
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-[#fbfaf7]/95 backdrop-blur dark:border-white/10 dark:bg-[#080a10]/95">
      <div className="h-16 w-full px-5 sm:px-8 lg:px-10 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-gray-800 dark:text-slate-200">
            Jacob Horne
          </span>
        </a>

        <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-6">
          {navLinks.map(l => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500 transition-colors duration-150 hover:text-gray-950 dark:text-slate-400 dark:hover:text-white xl:text-[11px] xl:tracking-[0.18em]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center justify-end gap-2">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-150"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-800 transition-all duration-150 hover:border-gray-500 hover:bg-gray-50 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-200 dark:hover:border-cyan-300/55 dark:hover:bg-cyan-300/15"
          >
            Contact
          </a>
        </div>

        <div className="lg:hidden col-start-3 flex items-center justify-end gap-2">
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

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-[#22263a] bg-white dark:bg-[#090a12]">
          <div className="max-w-[1220px] mx-auto px-6 py-4 space-y-1">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-cyan-400/10 rounded-md"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-cyan-400/10 rounded-md"
            >
              Contact
            </a>
            <button
              onClick={() => { setMenuOpen(false); onOpenTerminal(); }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-mono text-gray-800 dark:text-green-400 hover:text-blue-600 dark:hover:text-green-300"
            >
              &gt;_ Terminal
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

// Most of these name a specific thing on purpose. This field is the live-looking part of
// the card, so generic phrasing here costs more than it does anywhere else on the page.
const CURRENTLY_ITEMS = [
  "Building cloud data infrastructure and agentic benchmarks at Sandia",
  "Writing perception code for UCI's autonomous underwater robot",
  "Researching token-level confidence in multi-turn Text-to-SQL benchmarks",
  "Training physics-informed ML models to replace thermal simulations",
  "Building AI-powered smart contract security tooling with Foundry and Slither",
  "Contributing compiler fixes and regression tests to PyTorch Dynamo",
  "Studying system design to understand the production systems around me",
];

// Each line is ~70 characters of small technical mono text, so the hold is set for
// reading it rather than glancing at it. HOLD covers the fade, leaving FADE ms less
// than this actually legible.
const CURRENTLY_HOLD_MS = 11000;
const CURRENTLY_FADE_MS = 350;

function useCurrentlyRotation() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setVisible(false);
      tid = setTimeout(() => {
        setIdx(i => (i + 1) % CURRENTLY_ITEMS.length);
        setVisible(true);
      }, CURRENTLY_FADE_MS);
    }, CURRENTLY_HOLD_MS);
    return () => { clearInterval(id); clearTimeout(tid); };
  }, []);

  return { idx, visible };
}

function LaptopVisual({ idx, visible }: { idx: number; visible: boolean }) {
  return (
    <div className="relative min-w-0 w-full max-w-80 sm:max-w-xl md:max-w-[540px]">
      <div className="relative z-10 overflow-hidden rounded-xl border border-slate-700/60 shadow-2xl shadow-black/40">
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
        <div className="bg-slate-900 p-4 sm:p-5">
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_136px]">
            <div className="min-w-0 overflow-hidden break-words font-mono text-[11px] leading-[1.65] text-slate-300 sm:text-xs">
              <div><span className="text-purple-400">const</span> <span className="text-blue-300">jacob</span> = {"{"}</div>
              <div className="pl-4"><span className="text-slate-400">name:</span>{"      "}<span className="text-amber-300">"Jacob Horne"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">role:</span>{"      "}<span className="text-amber-300">"Software Engineer Intern @ Sandia"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">previous:</span>{"  "}<span className="text-amber-300">"Capital One"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">studying:</span>{"  "}<span className="text-amber-300">"CS @ UCI"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">gpa:</span>{"       "}<span className="text-cyan-400">3.92</span>,</div>
              <div className="pl-4 min-h-[3.3em]">
                <span className="text-slate-400">currently: </span>
                <span
                  className="text-green-300 transition-opacity duration-300"
                  style={{ opacity: visible ? 1 : 0.55 }}
                >"{CURRENTLY_ITEMS[idx]}"</span>
              </div>
              <div>{"}"}</div>
            </div>
            <div className="h-44 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/60 shadow-lg shadow-black/20 sm:h-auto">
              <img src={pfp} alt="Jacob Horne" decoding="async" className="h-full min-h-[178px] w-full object-cover object-top" />
            </div>
          </div>
          <div className="mt-4 bg-slate-800/60 rounded-lg px-3 py-2 font-mono text-[10px] flex items-center gap-2 border border-slate-700/30 sm:text-[11px]">
            <span className="text-green-400">❯</span>
            <span className="text-slate-400">npm run build</span>
            <span className="text-slate-600 mx-1">·</span>
            <span className="text-green-400">✓ built in 607ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onOpenTerminal, darkMode, animationActive }: { onOpenTerminal: () => void; darkMode: boolean; animationActive: boolean }) {
  const { idx, visible } = useCurrentlyRotation();

  return (
    <section id="top" className="relative overflow-hidden bg-[#fbfaf7] text-gray-950 dark:bg-[#070914] dark:text-white">
      <MeshBackground dark={darkMode} active={animationActive} />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1220px] px-6 py-12 md:px-8 lg:py-16">
        <div className="grid min-w-0 w-full grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-16 lg:-translate-y-12 xl:-translate-y-14">
          <div className="min-w-0 w-full max-w-80 space-y-7 pt-6 sm:max-w-xl lg:max-w-none lg:pt-0">
            <div>
              <div className="hero-rise hero-rise-1 space-y-4">
                <div className="space-y-1.5">
                  <h1 className="text-4xl font-semibold tracking-[-0.03em] text-gray-950 dark:text-white sm:text-5xl lg:text-[3.25rem]">
                    Jacob Horne
                  </h1>
                  <p className="text-sm font-semibold tracking-[0.025em] text-cyan-700 dark:text-cyan-300 sm:text-base">
                    Software Engineer &amp; Researcher
                  </p>
                </div>
                <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-gray-950 dark:text-white sm:text-5xl lg:text-[3.2rem] xl:text-[3.35rem]">
                  Building intelligent systems for the real world.
                </h2>
              </div>
            </div>
            <div className="hero-rise hero-rise-3 grid w-full max-w-80 grid-cols-1 gap-3 pt-1 sm:max-w-xl sm:flex sm:flex-wrap lg:max-w-none">
              <a
                href="/JacobHorneResume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-sm font-medium transition-colors duration-150"
              >
                View Resume
              </a>
              <a
                href="https://github.com/jacobhorne-jth"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 text-gray-700 hover:border-violet-500/70 hover:bg-violet-500/10 dark:border-white/15 dark:hover:border-violet-300/55 dark:hover:bg-violet-400/10 px-5 py-2.5 text-sm dark:text-slate-200 transition-all duration-150"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/jacobhornejth"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 text-gray-700 hover:border-amber-500/75 hover:bg-amber-500/10 dark:border-white/15 dark:hover:border-amber-300/55 dark:hover:bg-amber-400/10 px-5 py-2.5 text-sm dark:text-slate-200 transition-all duration-150"
              >
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="mailto:jacobhorne.jth@gmail.com"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 text-gray-700 hover:border-emerald-500/75 hover:bg-emerald-500/10 dark:border-white/15 dark:hover:border-emerald-300/55 dark:hover:bg-emerald-400/10 px-5 py-2.5 text-sm dark:text-slate-200 transition-all duration-150"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
            <div className="hero-rise hero-rise-3 flex items-center gap-3">
              <button
                onClick={onOpenTerminal}
                className="inline-flex items-center gap-2 rounded-lg border border-green-600/45 bg-green-500/10 px-4 py-2 font-mono text-sm text-green-700 hover:border-green-600/75 hover:bg-green-500/15 dark:border-green-500/30 dark:bg-green-500/[0.08] dark:text-green-400 dark:hover:border-green-500/60 dark:hover:bg-green-500/15 transition-all duration-150"
              >
                &gt;_ open terminal
              </button>
              <span className="hidden text-xs text-gray-500 dark:text-slate-500 font-mono sm:inline">← try terminal mode</span>
            </div>
          </div>

          <div className="flex min-w-0 justify-start sm:justify-center lg:justify-end">
            <LaptopVisual idx={idx} visible={visible} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About Me ─────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className={`${SURFACE_RAISED} ${SURFACE_EDGE} pt-12 pb-24 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="01" title="About Me" tone="amber" />
        <div className="grid md:grid-cols-[340px_1fr] gap-12 lg:gap-16 items-start">
          <div className="relative shrink-0">
            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-[#15171c] aspect-[4/5] border border-black/10 dark:border-white/10 shadow-lg shadow-slate-950/10">
              <img src={pfp} alt="Jacob Horne" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-3 right-3 bg-white dark:bg-[#161920] border border-gray-200 dark:border-emerald-200/20 shadow-lg shadow-slate-950/20 rounded-lg px-4 py-3 min-w-44 sm:-bottom-5 sm:-right-5">
              <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">Current role</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Software Engineer Intern</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">@ Sandia National Labs</p>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight max-w-3xl">
              Learning across AI,<br className="hidden sm:block" /> systems, and robotics.
            </h3>
            <div className="max-w-3xl space-y-4 text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              <p>
                I am a CS student at UCI and a Software Engineer Intern at Sandia National Labs working on
                data infrastructure and agentic benchmarking. Before that, I worked on recommender infrastructure
                at Capital One.
              </p>
              <p>
                I&apos;m drawn to making complicated technical work easier to reason about: how models behave,
                how systems hold up under load, how robots perceive, and how to turn those ideas into something
                people can actually use.
              </p>
            </div>
            <div className="grid gap-3 max-w-3xl">
              {aboutFocus.map(item => {
                const tone = toneStyles[item.tone];
                return (
                <div key={item.label} className={`flex items-start gap-4 rounded-lg border border-l-4 px-4 py-3 shadow-sm shadow-slate-950/5 ${tone.card} ${tone.border}`}>
                  <div className={`mt-0.5 h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${tone.soft}`}>
                    <item.Icon className={`h-4.5 w-4.5 ${tone.text}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className={`text-[11px] font-mono uppercase tracking-[0.16em] ${tone.text}`}>{item.label}</p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-slate-200 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceSection() {
  const [selected, setSelected] = useState<DetailItem | null>(null);
  const items = experienceRoles.map(entry => roleToDetail(entry, "Experience", "blue"));
  const currentItems = items.filter(item => item.isActive);
  const earlierItems = items.filter(item => !item.isActive);

  return (
    <section id="experience" className={`${SURFACE_BASE} ${SURFACE_EDGE} pt-10 pb-24 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader
          number="02"
          title="Experience"
          tone="blue"
        />

        <div className="relative">
          <div className="absolute bottom-0 left-[6px] top-2 w-px bg-gradient-to-b from-blue-500/70 via-blue-400/25 to-transparent md:left-[119px] dark:from-blue-300/60 dark:via-blue-300/20" />

          <div className="space-y-14">
            <div className="relative pl-7 md:grid md:grid-cols-[96px_minmax(0,1fr)] md:gap-12 md:pl-0">
              <span className="absolute left-0 top-1.5 h-[13px] w-[13px] rounded-full border-[3px] border-[#fbfaf7] bg-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.35)] dark:border-[#0a0c12] md:left-[113px]" />
              <div className="mb-4 md:mb-0 md:text-right">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 dark:text-white">Now</p>
              </div>
              <div className="border-y border-gray-200/80 dark:border-white/10">
                {currentItems.map(item => <ExperienceRow key={item.id} item={item} onOpen={setSelected} />)}
              </div>
            </div>

            <div className="relative pl-7 md:grid md:grid-cols-[96px_minmax(0,1fr)] md:gap-12 md:pl-0">
              <span className="absolute left-[1px] top-1.5 h-[11px] w-[11px] rounded-full border-[3px] border-[#fbfaf7] bg-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.35)] dark:border-[#0a0c12] md:left-[114px]" />
              <div className="mb-4 md:mb-0 md:text-right">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-900 dark:text-white">Earlier</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-gray-500 dark:text-slate-500">2025 — 2026</p>
              </div>
              <div className="border-y border-gray-200/80 dark:border-white/10">
                {earlierItems.map(item => <ExperienceRow key={item.id} item={item} onOpen={setSelected} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  const [selected, setSelected] = useState<DetailItem | null>(null);
  const items = projects.filter(project => !project.isHidden).map(projectToDetail);

  return (
    <section id="projects" className={`${SURFACE_RAISED} ${SURFACE_EDGE} pt-10 pb-24 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-700 dark:text-violet-300 uppercase select-none">04</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Projects</h2>
          </div>
          <a
            href="https://github.com/jacobhorne-jth"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-violet-700 hover:text-violet-600 dark:text-violet-300 dark:hover:text-violet-200 font-medium transition-colors duration-150 pb-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {items.map(item => <ProjectCard key={item.id} item={item} onOpen={setSelected} />)}
        </div>

      </div>
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ─── Research ─────────────────────────────────────────────────────────────────

function ResearchSection() {
  const [selected, setSelected] = useState<DetailItem | null>(null);
  const researchItems = researchRoles.map(entry => roleToDetail(entry, "Research", "cyan"));
  const paperItems = papers.map(paperToDetail);

  return (
    <section id="research" className={`${SURFACE_BASE} ${SURFACE_EDGE} pt-10 pb-24 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader
          number="03"
          title="Research"
          subtitle="Investigating how intelligent systems reason, fail, and earn trust."
          tone="cyan"
        />
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {researchItems.map(item => <DetailCard key={item.id} item={item} onOpen={setSelected} />)}
        </div>

        <div className="mt-12 border-t border-gray-300/70 pt-9 dark:border-white/10">
          <div className="mb-7">
            <h3 className="text-2xl font-semibold text-gray-950 dark:text-white">Publications</h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200/90 bg-white/55 shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none">
            {paperItems.map((item, index) => (
              <PublicationCard key={item.id} item={item} index={index} onOpen={setSelected} />
            ))}
          </div>
        </div>
      </div>
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ─── Teaching & Mentorship ────────────────────────────────────────────────────

function TeachingSection() {
  const [selected, setSelected] = useState<DetailItem | null>(null);
  const items = teachingRoles.map(entry => roleToDetail(entry, "Teaching", "blue"));

  return (
    <section id="teaching" className={`${SURFACE_RAISED} ${SURFACE_EDGE} pt-10 pb-24 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="05" title="Teaching & Mentorship" tone="blue" />
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {items.map(item => <DetailCard key={item.id} item={item} onOpen={setSelected} />)}
        </div>
      </div>
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationSection() {
  const [selected, setSelected] = useState<DetailItem | null>(null);

  return (
    <section id="education" className={`${SURFACE_BASE} ${SURFACE_EDGE} pt-10 pb-24 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="max-w-xl">
          <div className="flex items-baseline gap-3 mb-10">
            <span className="text-xs font-bold tracking-[0.2em] text-rose-700 dark:text-rose-300 uppercase select-none">05</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h2>
          </div>
          <DetailCard item={educationDetail} onOpen={setSelected} />
        </div>
      </div>
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ─── Now ──────────────────────────────────────────────────────────────────────

function NowSection() {
  const items: Array<{ label: string; tone: Tone; entries: string[] }> = [
    {
      label: "Building",
      tone: "emerald",
      entries: [
        "Data infrastructure and agentic benchmarks at Sandia",
        "Smart contract security tooling",
        "PyTorch Dynamo compiler fixes and regression tests",
        "Underwater robotics perception",
      ],
    },
    {
      label: "Researching",
      tone: "cyan",
      entries: [
        "Token-level confidence in Text-to-SQL",
        "Physics-informed thermal models",
        "Multi-agent LLM evaluation",
      ],
    },
    {
      label: "Learning",
      tone: "amber",
      entries: [
        "System design in production systems",
        "Compiler internals and graph capture",
        "Protocol reverse engineering",
        "Robotics software architecture",
      ],
    },
  ];

  return (
    <section id="now" className={`${SURFACE_RAISED} ${SURFACE_EDGE} pt-20 pb-24 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-700 dark:text-violet-300 uppercase select-none">06</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-950 dark:text-white">What I'm up to</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(col => {
            const tone = toneStyles[col.tone];
            return (
            <div key={col.label} className={`rounded-md border p-7 ${tone.card} ${tone.border}`}>
              <p className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 ${tone.text}`}>{col.label}</p>
              <ul className="space-y-3">
                {col.entries.map((e, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                    <span className={`mt-[7px] h-1.5 w-1.5 rounded-sm shrink-0 ${tone.bullet}`} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className={`${SURFACE_BASE} ${SURFACE_EDGE} pt-16 pb-20 scroll-mt-16`}>
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,1fr)] md:items-start">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-bold tracking-[0.2em] text-amber-700 dark:text-amber-300 uppercase select-none">07</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Let's Connect</h2>
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-slate-300">
              I'm open to internships, research collaborations, and thoughtful conversations about building useful technical systems.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {["Winter 2027", "Spring 2027", "Summer 2027", "Fall 2027"].map(term => (
                <span key={term} className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                  {term}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {[
              { Icon: Mail, label: "jacobhorne.jth@gmail.com", href: "mailto:jacobhorne.jth@gmail.com" },
              { Icon: LinkedinIcon, label: "linkedin.com/in/jacobhornejth", href: "https://linkedin.com/in/jacobhornejth" },
              { Icon: GithubIcon, label: "github.com/jacobhorne-jth", href: "https://github.com/jacobhorne-jth" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 rounded-md border border-amber-200/80 bg-white/70 px-4 py-4 text-sm text-gray-700 transition-all duration-150 hover:border-amber-500/60 hover:bg-white dark:border-amber-300/15 dark:bg-white/[0.035] dark:text-slate-200 dark:hover:border-amber-300/45 dark:hover:bg-white/[0.06]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="h-9 w-9 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    <link.Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="truncate">{link.label}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-150 group-hover:translate-x-1 dark:text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// These sections do not depend on the global theme state—the `dark` class handles
// their colours in CSS. Keeping their element trees stable avoids reconciling the
// entire portfolio whenever the navbar theme control or terminal state changes.
const MemoAboutSection = memo(AboutSection);
const MemoExperienceSection = memo(ExperienceSection);
const MemoResearchSection = memo(ResearchSection);
const MemoProjectsSection = memo(ProjectsSection);
const MemoTeachingSection = memo(TeachingSection);
const MemoEducationSection = memo(EducationSection);
const MemoNowSection = memo(NowSection);
const MemoContactSection = memo(ContactSection);
const MemoNavbar = memo(Navbar);
const MemoHero = memo(Hero);

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setTerminalOpen(false), []);
  const toggleDark = useCallback(() => setDarkMode(v => !v), []);

  return (
    <div className={`min-h-screen${darkMode ? " dark" : ""}`}>
      {terminalOpen && <Terminal onClose={closeTerminal} />}
      <MemoNavbar onOpenTerminal={openTerminal} darkMode={darkMode} onToggleDark={toggleDark} />
      <MemoHero onOpenTerminal={openTerminal} darkMode={darkMode} animationActive={!terminalOpen} />
      <MemoAboutSection />
      <MemoExperienceSection />
      <MemoResearchSection />
      <MemoProjectsSection />
      {SHOW_TEACHING && <MemoTeachingSection />}
      <MemoEducationSection />
      <MemoNowSection />
      <MemoContactSection />
    </div>
  );
}
