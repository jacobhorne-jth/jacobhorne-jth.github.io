import { useCallback, useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Mail,
  ExternalLink,
  ArrowRight,
  Code2,
  Cpu,
  Users,
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
import projAgonus from "./assets/projects/agonus.png";
import projPropIntel from "./assets/projects/propintel.png";
import projCrimeMap from "./assets/projects/JacobHorneCrimeMap.png";
import projOnboarding from "./assets/projects/onbaoardingreal.png";
import projSMS from "./assets/projects/realsms.png";
import projWebsite from "./assets/projects/port.png";
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
  { type: "cols", left: "  about      — scroll to about",  right: "  linkedin   — open LinkedIn profile" },
  { type: "cols", left: "  education  — education",        right: "  resume     — open resume PDF" },
  { type: "cols", left: "  experience — experience",       right: "  email      — show email address" },
  { type: "cols", left: "  research   — research",         right: "  whoami     — info about Jacob" },
  { type: "cols", left: "  projects   — projects",         right: "  ls         — list all sections" },
  { type: "cols", left: "  contact    — contact",          right: "  flip       — flip the page" },
  { type: "cols", left: "  game       — play snake",       right: "  papers     — research papers" },
  { type: "cols", left: "  hack       — initiate hack",    right: "  joke       — random dev joke" },
  { type: "cols", left: "  fortune    — words of wisdom",  right: "  coffee     — ☕" },
  { type: "cols", left: "  skills     — tech stack",       right: "  ping       — ping jacob" },
  { type: "cols", left: "  clear      — clear terminal",   right: "  exit       — close terminal" },
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
          { type: "output", text: "about/  experience/  projects/  research/  teaching/  education/  now/  contact/" },
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
          { type: "output", text: "Languages   Python · TypeScript · JavaScript · C/C++ · SQL · Java · R" },
          { type: "output", text: "ML/Data     PyTorch · scikit-learn · PySpark · NumPy · Pandas · OpenCV" },
          { type: "output", text: "Backend     FastAPI · Node.js · Express · PostgreSQL · Redis · pgvector" },
          { type: "output", text: "Frontend    React · Next.js · Tailwind CSS · Zustand · Chakra UI" },
          { type: "output", text: "Infra       Databricks · Airflow · Docker · AWS · Supabase · Git" },
          { type: "output", text: "Focus       Recommenders · LLM eval · Agents · PINNs · CUDA · Perception" },
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
  bullets: string[];
  featured?: { text: string; url?: string } | { text: string; url?: string }[];
  tags: string[];
};
type Project = {
  name: string; monogram: string; desc: string; detail: string; tech: string[];
  accentLine: string; repoUrl: string; demoUrl?: string; imgUrl?: string;
  group?: string;
};
type Paper = {
  venue: string;
  title: string;
  detail: string;
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
  period?: string;
  logo?: string;
  logoImg?: string;
  image?: string;
  imageAlt?: string;
  meta?: string[];
  paragraphs: string[];
  highlights: string[];
  tags: string[];
  href?: string;
  hrefLabel?: string;
  accentLine?: string;
  isActive?: boolean;
  tone?: Tone;
};

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
    card: "bg-white dark:bg-[#10202a]",
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
    card: "bg-white dark:bg-[#10251e]",
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
    card: "bg-white dark:bg-[#1d1730]",
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
    card: "bg-white dark:bg-[#241c10]",
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
    card: "bg-white dark:bg-[#281722]",
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
    card: "bg-white dark:bg-[#111c32]",
  },
};

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
    period: "Aug 2026 — Present",
    isActive: true,
    bullets: [
      "Building AI R&D tooling that makes Sandia's AI research more usable for researchers, engineers, and mission users.",
      "Turning research workflows into practical software interfaces, tooling, and systems users can rely on.",
    ],
    tags: ["AI R&D", "Developer Tooling", "Software Engineering"],
  },
  {
    logo: "Capit",
    logoImg: logoC1,
    company: "Capital One",
    role: "Software Engineer Intern",
    period: "Jun 2026 — Aug 2026",
    bullets: [
      "Built ML recommender infrastructure for customer-message experiences.",
      "Replaced a network API call with an in-process SDK, reducing latency by 25% for 60M+ monthly customers.",
      "Built Databricks/PySpark sampling pipelines over 800M+ historical customer-message outcomes, enabling candidate recommender models to test against broader production behavior 28x faster.",
      "Automated sampling and upstream jobs in Apache Airflow with 18 schema, distribution, and multiplier quality checks.",
    ],
    tags: ["Python", "PySpark", "Databricks", "Airflow", "Recommender Systems"],
  },
  {
    logo: "URP",
    logoImg: logoURP,
    company: "Underwater Robotics Project @ UCI",
    role: "Perception Engineer",
    period: "Aug 2026 — Present",
    isActive: true,
    bullets: [
      "Building perception systems for an autonomous underwater robot, focusing on the software that gives the robot its eyes.",
      "Evaluating camera, sonar, classical vision, and CNN-based approaches under RoboSub competition constraints.",
      "Working on object-detection pipelines inside the robot software stack, with emphasis on robust perception in aquatic environments.",
      "Learning ROS-style publish-subscribe architectures, embedded deployment constraints, and Dockerized robotics workflows.",
    ],
    tags: ["Computer Vision", "Robotics", "Perception", "Autonomy", "Docker"],
  },
  {
    logo: "Block",
    logoImg: logoBlockchain,
    company: "Blockchain @ UCI",
    role: "Technical Developer",
    period: "Oct 2025 — Present",
    isActive: true,
    bullets: [
      "Developing the backend agent system for Agonus, an AI-powered crypto trading tournament platform.",
      "Building full-stack infrastructure for autonomous trading agents to execute strategies and compete on-chain in real time.",
      "Powering real-time agent performance tracking and strategy update broadcasts.",
    ],
    tags: ["Python", "FastAPI", "TypeScript", "Blockchain", "AI Agents"],
  },
  {
    logo: "CareT",
    logoImg: logoCaretech,
    company: "CareTech at UCI",
    role: "Software Developer",
    period: "Oct 2025 — Jun 2026",
    bullets: [
      "Processed and prepared 28K+ food images using Python, OpenCV, and PyTorch across 270+ diverse food categories.",
      "Trained PyTorch object detection models via Roboflow and Colab with augmentation techniques (CLAHE, brightness, gamma), achieving 81% classification accuracy.",
      "Developing a web-based interface for real-time food recognition integrated into the full nutrition tracking platform.",
    ],
    tags: ["Python", "PyTorch", "OpenCV", "Roboflow", "Next.js", "FastAPI", "Supabase"],
  },
  {
    logo: "Comm",
    logoImg: logoCTC,
    company: "Commit the Change",
    role: "Full-Stack Developer",
    period: "Oct 2025 — Jun 2026",
    bullets: [
      "Built a scheduling/quota-management platform with React and TypeScript supporting 23,000+ patients across clinics.",
      "Developed secure Node.js/Express REST APIs processing 5,000+ requests/week for auth and workflow automation.",
      "Implemented Chakra UI, Zustand interfaces backed by PostgreSQL, reducing booking conflicts and scheduling workload by 30%.",
    ],
    tags: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Chakra UI"],
  },
  {
    logo: "SENS",
    logoImg: logoSENS,
    company: "SENS Psychology",
    role: "Software Development Intern",
    period: "Sep 2025 — Jan 2026",
    bullets: [
      "Built an internal workflow system with Next.js and TypeScript supporting 30+ staff and 1,200+ monthly interactions.",
      "Reduced patient intake time by 50% by replacing manual processes with Node.js/React intake, ticketing, and call-routing pipelines.",
      "Cut manual email work 60% with Microsoft Azure notifications; modeled task lifecycle in Prisma/Zenstack for scalable workflow automation.",
    ],
    tags: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Azure"],
  },
];

const researchRoles: RoleEntry[] = [
  {
    logo: "C2",
    logoImg: logoCalit2,
    company: "Calit2 @ UCI",
    role: "AI/ML Undergraduate Researcher",
    period: "Apr 2026 — Present",
    isActive: true,
    bullets: [
      "Building GRU, LSTM, and PINN surrogate models to predict thermal storage temperature profiles (T_inner, T_outer, T_avg) across 150s transient simulations.",
      "Designed a physics-informed loss function enforcing heat transfer PDEs, achieving R² > 0.97 for T_inner prediction across 10 held-out test cases.",
      "Implemented full autoregressive rollout with an InitStateEncoder to warm-start hidden state, eliminating teacher forcing during inference for stable long-horizon prediction.",
    ],
    tags: ["Python", "PyTorch", "GRU", "LSTM", "PINN", "Physics-Informed ML"],
  },
  {
    logo: "UCI",
    logoImg: logoDLL,
    company: "UCI Digital Learning Lab",
    role: "Research Assistant",
    period: "Dec 2025 — Present",
    isActive: true,
    bullets: [
      "Analyzed LLM output datasets using NumPy, Pandas, and Matplotlib for token log-probs, confidence behavior, and uncertainty modeling.",
      "Built multi-agent evaluation pipelines in LangGraph with critic, advocate, and judge agents orchestrating rubric-based reasoning and scoring across essay evaluation workflows.",
      "Co-authored papers on multi-agent LLM evaluation, token-level confidence, and reasoning quality across ICLR, ACL SRW, and GEM venues.",
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
    tags: ["Python", "LangGraph", "NLP", "NumPy", "Pandas", "Matplotlib", "LLMs"],
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
    name: "Agonus",
    monogram: "AGN",
    desc: "A trading arena where automated competitors face off and viewers can follow the action live.",
    detail: "Decentralized AI trading platform where autonomous agents compete in crypto tournaments with on-chain betting, real-time leaderboards, and tokenized rewards.",
    tech: ["LangChain", "FastAPI", "Next.js", "Solidity", "PostgreSQL"],
    accentLine: "bg-yellow-500",
    repoUrl: "#",
    demoUrl: "https://agonus-frontend-45256917921.us-central1.run.app/",
    imgUrl: projAgonus,
    group: "Blockchain @ UCI",
  },
  {
    name: "TCS Banking AI Capstone",
    monogram: "TCS",
    desc: "A banking assistant that helps answer customer questions using trusted internal documents.",
    detail: "React/FastAPI banking chatbot with DeBERTa ethics checks, PDF/OCR document ingestion, OpenAI embeddings, and PostgreSQL/pgvector retrieval to ground customer guidance in banking data.",
    tech: ["FastAPI", "PostgreSQL", "pgvector", "OpenAI", "DeBERTa"],
    accentLine: "bg-sky-500",
    repoUrl: "#",
    imgUrl: logoTCS,
    group: "Tata Consultancy Services",
  },
  {
    name: "Prop.Intel",
    monogram: "PRP",
    desc: "A property research tool that turns ownership and risk data into readable reports.",
    detail: "AI property risk platform generating real-time reports using ATTOM ownership data, FEMA National Risk Index datasets, and a ridge regression model across 3,100+ counties.",
    tech: ["Next.js", "TypeScript", "Python", "Ridge Regression"],
    accentLine: "bg-orange-500",
    repoUrl: "https://github.com/jacobhorne-jth/prop-intel",
    imgUrl: projPropIntel,
  },
  {
    name: "SF Crime Mapper",
    monogram: "SCM",
    desc: "An interactive map for exploring where neighborhood safety risks may be changing.",
    detail: "Full-stack interactive web app that forecasts San Francisco neighborhood-level incident risk and visualizes it on a Mapbox choropleth.",
    tech: ["FastAPI", "Prophet", "XGBoost", "React", "Vite"],
    accentLine: "bg-amber-500",
    repoUrl: "https://github.com/jacobhorne-jth/sf-crime-mapper",
    imgUrl: projCrimeMap,
  },
  {
    name: "GitHub Onboarding Agent",
    monogram: "GOA",
    desc: "A guide that helps someone understand an unfamiliar code project faster.",
    detail: "AI-powered GitHub onboarding agent that ingests any repository and provides code-aware summaries, repo exploration, and RAG-driven Q&A.",
    tech: ["Python", "FastAPI", "LangChain", "LangGraph", "Pinecone"],
    accentLine: "bg-purple-500",
    repoUrl: "https://github.com/jacobhorne-jth/github-onboarding-agent",
    imgUrl: projOnboarding,
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
  },
  {
    name: "Portfolio Website",
    monogram: "JH",
    desc: "A personal site for showing the work I care about without making it feel static.",
    detail: "This portfolio is built with React, TypeScript, and Tailwind CSS. It features focused storytelling, dark/light mode, detailed project modals, and an interactive terminal Easter egg.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    accentLine: "bg-blue-500",
    repoUrl: "https://github.com/jacobhorne-jth/jacobhorne-jth.github.io",
    imgUrl: projWebsite,
  },
];

const papers: Paper[] = [
  {
    venue: "ICLR 2026 LLM Reasoning Workshop",
    title: "The First Tokens Matter: Early Confidence Signals for Evaluating LLM Reasoning",
    detail: "Explores whether early token-level confidence can predict reasoning quality and expose failure modes in LLM outputs.",
    url: "https://openreview.net/forum?id=0FOOrwSQ9E",
    tags: ["LLM Evaluation", "Confidence", "Reasoning"],
  },
  {
    venue: "ACL 2026 Student Research Workshop",
    title: "The Confident Liar: Diagnosing Multi-Agent Debate with Log-Probabilities and LLM-as-Judge",
    detail: "Studies multi-agent debate behavior through log-probability signals, judge scoring, and failure analysis.",
    url: "https://aclanthology.org/2026.acl-srw.121/",
    tags: ["Multi-Agent Systems", "NLP", "Log-Probabilities"],
  },
  {
    venue: "GEM 2026",
    title: "Early-Token Confidence Predicts Reasoning Quality in Multi-Agent LLM Debate",
    detail: "Connects early confidence patterns to downstream reasoning quality in debate-style LLM evaluation workflows.",
    url: "https://aclanthology.org/2026.gem-main.60/",
    tags: ["LLMs", "Evaluation", "Debate"],
  },
];


const coursework = [
  "CS 178 — Machine Learning & Data Mining",
  "CS 171 — Introduction to Artificial Intelligence",
  "CS 180A/B — Project in Computer Science",
  "ICS 46 — Data Structures & Analysis",
  "ICS 45C — Programming in C/C++",
  "ICS H32 — Python Programming & Libraries (Accelerated)",
  "ICS 33 — Intermediate Programming",
  "STATS 67 — Probability & Statistics for CS",
  "IN4MATX 43 — Introduction to Software Engineering",
];

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Teaching", href: "#teaching" },
  { label: "Education", href: "#education" },
  { label: "Now", href: "#now" },
  { label: "Contact", href: "#contact" },
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
    summary: entry.bullets[0] ?? entry.role,
    period: entry.period,
    logo: entry.logo,
    logoImg: entry.logoImg,
    meta: [`Role — ${entry.role}`],
    paragraphs: [entry.bullets[0] ?? entry.role],
    highlights: [
      ...entry.bullets.slice(1),
      ...featured.map(f => f.text),
    ],
    tags: entry.tags,
    href: entry.companyLink,
    hrefLabel: "Open organization",
    isActive: entry.isActive,
    tone,
  };
};

const projectToDetail = (project: Project): DetailItem => ({
  id: `project-${project.name}`,
  eyebrow: project.group ?? "Project",
  title: project.name,
  subtitle: project.tech.slice(0, 3).join(" / "),
  summary: project.desc,
  logo: project.monogram,
  image: project.imgUrl,
  imageAlt: project.name,
  meta: project.group ? [`Group — ${project.group}`] : ["Independent build"],
  paragraphs: [project.detail],
  highlights: [
    `Built with ${project.tech.slice(0, 4).join(", ")}.`,
    project.demoUrl ? "Includes a live demo surface for trying the system." : "Designed as a code-first project with implementation details in the repository.",
  ],
  tags: project.tech,
  href: project.demoUrl ?? (project.repoUrl !== "#" ? project.repoUrl : undefined),
  hrefLabel: project.demoUrl ? "Open demo" : "Open code",
  accentLine: project.accentLine,
  tone: "violet",
});

const paperToDetail = (paper: Paper): DetailItem => ({
  id: `paper-${paper.title}`,
  eyebrow: "UCI Digital Learning Lab",
  title: paper.title,
  subtitle: "Associated with UCI Digital Learning Lab",
  summary: paper.detail,
  logo: "PDF",
  logoImg: logoDLL,
  period: paper.venue,
  meta: [`Venue — ${paper.venue}`, "Lab — UCI Digital Learning Lab"],
  paragraphs: [
    paper.detail,
    "This work reflects my interest in evaluating model behavior with signals that can be measured, compared, and improved.",
  ],
  highlights: [
    "Focuses on confidence, reasoning quality, and evaluation signals.",
    "Connects empirical analysis to practical LLM evaluation workflows.",
  ],
  tags: paper.tags,
  href: paper.url,
  hrefLabel: "Open paper",
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
  meta: ["GPA — 3.92", "Dean's List — 6x", "Campuswide Honors Collegium"],
  paragraphs: ["3.92 GPA", "Dean's List x 6", "Campuswide Honors Collegium"],
  highlights: coursework,
  tags: ["Machine Learning", "AI", "Data Structures", "C/C++", "Software Engineering"],
  tone: "rose",
};

function DetailLogo({ item, size = "card" }: { item: DetailItem; size?: "card" | "modal" }) {
  const imageFrame = size === "modal" ? "h-20 w-28" : "h-12 w-16";
  const logoFrame = size === "modal" ? "h-[4.5rem] w-[4.5rem]" : "h-12 w-12";

  if (item.image) {
    return (
      <div className={`${imageFrame} rounded-md bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 overflow-hidden shrink-0`}>
        <img src={item.image} alt={item.imageAlt ?? item.title} className="h-full w-full object-cover object-top" />
      </div>
    );
  }

  return (
    <div className={`${logoFrame} rounded-md bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0`}>
      {item.logoImg
        ? <img src={item.logoImg} alt={item.title} className="h-full w-full object-cover" />
        : <span className="text-[10px] font-semibold tracking-wide text-gray-500 dark:text-slate-300">{item.logo}</span>}
    </div>
  );
}

function DetailCard({ item, onOpen }: { item: DetailItem; onOpen: (item: DetailItem) => void }) {
  const tone = toneStyles[item.tone ?? "blue"];

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`group relative min-h-[168px] w-full overflow-hidden rounded-md border border-gray-200/80 bg-white/90 p-5 text-left shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-md hover:shadow-slate-950/10 focus:outline-none focus-visible:ring-2 dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.06] ${tone.ring}`}
    >
      {item.accentLine && <div className={`absolute inset-x-0 top-0 h-0.5 ${item.accentLine}`} />}
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                {item.period ?? item.eyebrow}
              </p>
              {item.isActive && (
                <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] ${tone.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${tone.bullet}`} />
                  Active
                </span>
              )}
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-snug text-gray-950 dark:text-white">
              {item.title}
            </h3>
            {item.subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">{item.subtitle}</p>
            )}
          </div>
          <DetailLogo item={item} />
        </div>

        <p className="whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-slate-300">{item.summary}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className={`font-mono text-[10px] uppercase tracking-[0.18em] opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100 ${tone.text}`}>
            View details
          </span>
          <ArrowRight className={`h-4 w-4 text-gray-300 transition-all duration-200 group-hover:translate-x-1 dark:text-slate-500 ${tone.arrow}`} />
        </div>
      </div>
    </button>
  );
}

function DetailModal({ item, onClose }: { item: DetailItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;
  const tone = toneStyles[item.tone ?? "blue"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050710]/75 px-4 py-6 backdrop-blur-sm md:py-10" onClick={onClose}>
      <article
        className={`relative max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-md border bg-[#fbfaf7] p-7 shadow-2xl shadow-slate-950/25 dark:bg-[#0b0d12] md:max-h-[calc(100vh-5rem)] md:p-10 ${tone.border}`}
        onClick={event => event.stopPropagation()}
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
          <p className={`font-mono text-xs uppercase tracking-[0.22em] ${tone.text}`}>
            {item.period ?? item.eyebrow}
          </p>
          <div className="mt-4 flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-3xl font-semibold leading-tight text-gray-950 dark:text-white md:text-4xl">
                {item.title}
                {item.subtitle && (
                  <span className="text-gray-500 dark:text-slate-400 md:text-2xl"> · {item.subtitle}</span>
                )}
              </h3>
              <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-700 dark:text-slate-300">
                {item.summary}
              </p>
            </div>
            <DetailLogo item={item} size="modal" />
          </div>
        </div>

        {item.meta && item.meta.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-600 dark:text-slate-300">
            {item.meta.map(meta => <span key={meta}>{meta}</span>)}
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-slate-800">
          <div className="space-y-5">
            {item.paragraphs.map(paragraph => (
              <p key={paragraph} className="text-base leading-8 text-gray-700 dark:text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

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

        {item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`mt-9 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${tone.primary}`}
          >
            {item.hrefLabel ?? "Open link"}
            <ExternalLink className="h-4 w-4" />
          </a>
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
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="h-2 w-2 rounded-full bg-cyan-700 dark:bg-cyan-300" />
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-gray-800 dark:text-slate-200">
            Jacob Horne
          </span>
        </a>

        {/* Desktop nav */}
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
          {/* Dark/light toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-150"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {/* Terminal button */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gray-800 transition-all duration-150 hover:border-gray-500 dark:border-green-500/35 dark:bg-green-500/10 dark:text-green-300 dark:hover:border-green-400/60"
          >
            Terminal
          </button>
        </div>

        {/* Mobile hamburger */}
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

      {/* Mobile dropdown */}
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

const CURRENTLY_ITEMS = [
  "Building a CUDA project to understand model execution closer to the hardware",
  "Building Lazarus to turn scattered context into usable workflows",
  "Researching text-to-SQL confidence through query execution and repair loops",
  "Researching physics-informed ML for fast thermal storage prediction",
  "Making Sandia AI research usable through full-stack tools for researchers",
  "Studying system design to better understand production systems",
  "Building a personal operating system across tools, notes, and automations",
  "Building underwater robotics perception systems for autonomous robot vision",
];

function LaptopVisual() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setVisible(false);
      tid = setTimeout(() => {
        setIdx(i => (i + 1) % CURRENTLY_ITEMS.length);
        setVisible(true);
      }, 350);
    }, 7000);
    return () => { clearInterval(id); clearTimeout(tid); };
  }, []);

  return (
    <div className="relative w-full max-w-[520px]">
      <div className="relative overflow-hidden rounded-xl border border-slate-700/60 shadow-2xl shadow-black/40">
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
        <div className="bg-slate-900 p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_136px]">
            {/* Code panel */}
            <div className="font-mono text-xs leading-[1.65] text-slate-300 overflow-hidden">
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
                  style={{ opacity: visible ? 1 : 0 }}
                >"{CURRENTLY_ITEMS[idx]}",</span>
              </div>
              <div>{"}"}</div>
            </div>
            {/* Portrait panel */}
            <div className="h-44 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/60 shadow-lg shadow-black/20 sm:h-auto">
              <img src={pfp} alt="Jacob Horne" className="h-full min-h-[178px] w-full object-cover object-top" />
            </div>
          </div>
          {/* Terminal line */}
          <div className="mt-4 bg-slate-800/60 rounded-lg px-3 py-2 font-mono text-[11px] flex items-center gap-2 border border-slate-700/30">
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

function Hero({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-[#fbfaf7] text-gray-950 dark:bg-[#070914] dark:text-white">
      <div className="absolute inset-x-0 bottom-0 hidden h-28 items-end gap-3 px-8 opacity-40 sm:flex" aria-hidden="true">
        {[34, 58, 42, 70, 28, 52, 80, 46, 64, 36, 74, 44, 60, 32, 68, 40, 76, 50, 66, 38, 72, 45, 62, 35].map((height, index) => (
          <span
            key={index}
            className="flex-1 bg-gray-200/70 dark:bg-white/[0.05]"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1220px] px-6 py-16 md:px-8 lg:py-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-16">
          {/* Left */}
          <div className="space-y-7">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Building to learn
            </p>
            <div className="space-y-3">
              <h1 className="text-5xl font-semibold tracking-tight leading-none text-gray-950 dark:text-white sm:text-6xl md:text-7xl">
                Jacob Horne.
              </h1>
              <p className="max-w-xl text-2xl font-medium text-gray-700 dark:text-slate-300 md:text-3xl">
                I build things to understand them, then make them clearer, faster, or more useful.
              </p>
            </div>
            <p className="text-base text-gray-600 dark:text-slate-400 leading-relaxed max-w-lg">
              I like learning by building things that make technical ideas concrete: ML infrastructure,
              evaluation systems, robotics perception, CUDA experiments, and full-stack tools.
            </p>
            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1 sm:flex sm:flex-wrap">
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
                className="flex items-center justify-center gap-2 rounded-lg border border-violet-300/50 text-gray-700 hover:border-violet-500/70 hover:bg-violet-500/10 dark:border-violet-300/20 dark:hover:border-violet-300/55 dark:hover:bg-violet-400/10 px-5 py-2.5 text-sm dark:text-slate-200 transition-all duration-150"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/jacobhornejth"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-amber-300/60 text-gray-700 hover:border-amber-500/75 hover:bg-amber-500/10 dark:border-amber-300/20 dark:hover:border-amber-300/55 dark:hover:bg-amber-400/10 px-5 py-2.5 text-sm dark:text-slate-200 transition-all duration-150"
              >
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="mailto:jacobhorne.jth@gmail.com"
                className="flex items-center justify-center gap-2 rounded-lg border border-emerald-300/60 text-gray-700 hover:border-emerald-500/75 hover:bg-emerald-500/10 dark:border-emerald-300/20 dark:hover:border-emerald-300/55 dark:hover:bg-emerald-400/10 px-5 py-2.5 text-sm dark:text-slate-200 transition-all duration-150"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
            {/* Terminal button — prominent */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenTerminal}
                className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/8 px-4 py-2 font-mono text-sm text-green-400 hover:border-green-500/60 hover:bg-green-500/15 transition-all duration-150"
              >
                &gt;_ open terminal
              </button>
              <span className="text-xs text-gray-500 dark:text-slate-500 font-mono">← try terminal mode</span>
            </div>
          </div>

          {/* Right: visual */}
          <div className="flex justify-center lg:justify-end">
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
    <section id="about" className="bg-[#f7f1e8] dark:bg-[#10120f] pt-12 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="01" title="About Me" tone="amber" />
        <div className="grid md:grid-cols-[340px_1fr] gap-12 lg:gap-16 items-start">
          {/* Photo */}
          <div className="relative shrink-0">
            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-[#191d18] aspect-[4/5] border border-amber-900/10 dark:border-amber-200/15 shadow-lg shadow-slate-950/10">
              <img src={pfp} alt="Jacob Horne" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-3 right-3 bg-white dark:bg-[#171b18] border border-gray-200 dark:border-emerald-200/20 shadow-lg shadow-slate-950/20 rounded-lg px-4 py-3 min-w-44 sm:-bottom-5 sm:-right-5">
              <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">Current role</p>
              <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Software Engineer Intern</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">@ Sandia National Labs</p>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight max-w-3xl">
              Learning across AI,<br className="hidden sm:block" /> systems, and robotics.
            </h3>
            <div className="max-w-3xl space-y-4 text-sm md:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
              <p>
                I am a CS student at UCI and a Software Engineer Intern at Sandia National Labs.
                Before that, I worked on recommender infrastructure at Capital One.
              </p>
              <p>
                I tend to follow questions until they become buildable: how models behave, how systems hold up,
                how robots perceive, and how tools can make complicated work easier to reason about.
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
  const items = experienceRoles.map(entry => roleToDetail(entry, "Experience", "emerald"));

  return (
    <section id="experience" className="border-t border-black/5 bg-[#f7f6f1] pt-10 pb-24 scroll-mt-16 dark:border-white/10 dark:bg-[#0b100d]">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="02" title="Experience" tone="emerald" />
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {items.map(item => <DetailCard key={item.id} item={item} onOpen={setSelected} />)}
        </div>
      </div>
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  const [selected, setSelected] = useState<DetailItem | null>(null);
  const items = projects.map(projectToDetail);

  return (
    <section id="projects" className="border-t border-black/5 bg-[#fbfaf7] pt-10 pb-24 scroll-mt-16 dark:border-white/10 dark:bg-[#0f0d14]">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        {/* Header row */}
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-700 dark:text-violet-300 uppercase select-none">03</span>
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
          {items.map(item => <DetailCard key={item.id} item={item} onOpen={setSelected} />)}
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
    <section id="research" className="border-t border-black/5 bg-[#f4f8f7] pt-10 pb-24 scroll-mt-16 dark:border-white/10 dark:bg-[#091214]">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="04" title="Research" tone="cyan" />
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {researchItems.map(item => <DetailCard key={item.id} item={item} onOpen={setSelected} />)}
        </div>

        <div className="mt-12 border-t border-cyan-700/10 pt-8 dark:border-cyan-300/15">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-cyan-700/20 bg-white dark:border-cyan-300/20 dark:bg-white/5">
                <img src={logoDLL} alt="UCI Digital Learning Lab" className="h-full w-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-950 dark:text-white">Papers</h3>
            </div>
            <p className="max-w-md text-sm leading-6 text-gray-600 dark:text-slate-300">
              Research outputs tied to my work with the Digital Learning Lab.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {paperItems.map(item => <DetailCard key={item.id} item={item} onOpen={setSelected} />)}
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
    <section id="teaching" className="border-t border-black/5 bg-[#f7f6f1] pt-10 pb-24 scroll-mt-16 dark:border-white/10 dark:bg-[#0b0f15]">
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
    <section id="education" className="bg-[#fbf0f5] dark:bg-[#1b0c15] pt-10 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="max-w-xl">
          <div className="flex items-baseline gap-3 mb-10">
            <span className="text-xs font-bold tracking-[0.2em] text-rose-700 dark:text-rose-300 uppercase select-none">06</span>
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
        "AI R&D tooling at Sandia",
        "CUDA model-execution experiments",
        "Lazarus workflow tooling",
        "A personal operating system",
      ],
    },
    {
      label: "Researching",
      tone: "cyan",
      entries: [
        "Text-to-SQL confidence",
        "Physics-informed thermal prediction",
        "Multi-agent LLM evaluation",
        "Underwater robotics perception",
      ],
    },
    {
      label: "Learning",
      tone: "amber",
      entries: [
        "System design",
        "CUDA kernels and inference throughput",
        "Robotics software architecture",
        "Cleaner technical tools",
      ],
    },
  ];

  return (
    <section id="now" className="bg-[#f8f5ff] dark:bg-[#0d0a12] border-t border-violet-200 dark:border-violet-300/15 pt-20 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-700 dark:text-violet-300 uppercase select-none">07</span>
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
    <section id="contact" className="bg-[#fff5df] dark:bg-[#1d1508] border-t border-amber-200 dark:border-amber-300/15 pt-16 pb-20 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(360px,1fr)] md:items-start">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-bold tracking-[0.2em] text-amber-700 dark:text-amber-300 uppercase select-none">08</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Let's Connect</h2>
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-slate-300">
              I'm open to internships, research collaborations, and thoughtful conversations about building useful technical systems.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {["Winter 2027", "Summer 2027", "Fall 2027"].map(term => (
                <span key={term} className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                  {term}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
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

// ─── Explore Bar ──────────────────────────────────────────────────────────────

function ExploreBar({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const items = [
    {
      Icon: TerminalIcon,
      iconClass: "text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300",
      borderClass: "border-emerald-500/35 group-hover:border-emerald-500/70 group-hover:shadow-sm group-hover:shadow-emerald-500/10",
      arrowClass: "text-gray-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
      label: "Terminal Mode",
      sub: "Interactive CLI experience",
      action: onOpenTerminal,
      href: null as string | null,
    },
    {
      Icon: Zap,
      iconClass: "text-violet-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-300",
      borderClass: "border-violet-500/30 dark:border-violet-300/20 group-hover:border-violet-500/70 dark:group-hover:border-violet-400/60",
      arrowClass: "text-gray-400 dark:text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-300",
      label: "Now",
      sub: "What I'm building & learning",
      action: null as (() => void) | null,
      href: "#now",
    },
    {
      Icon: Code2,
      iconClass: "text-amber-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-300",
      borderClass: "border-amber-500/35 dark:border-amber-300/20 group-hover:border-amber-500/75 dark:group-hover:border-amber-400/60",
      arrowClass: "text-gray-400 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-300",
      label: "Research",
      sub: "Papers and model evaluation",
      action: null,
      href: "#research",
    },
  ];

  return (
    <section id="explore" className="bg-white dark:bg-[#080a10] border-t border-gray-200 dark:border-slate-700/40">
      <div className="max-w-[1220px] mx-auto">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-slate-700/40">
          {items.map(item => {
            const inner = (
              <div className="group flex items-center justify-between px-8 py-10 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-200 ${item.borderClass}`}>
                    <item.Icon className={`h-4.5 w-4.5 transition-colors duration-200 ${item.iconClass}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-950 dark:text-white text-base">{item.label}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{item.sub}</p>
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
      <TeachingSection />
      <EducationSection />
      <NowSection />
      <ContactSection />
      <ExploreBar onOpenTerminal={openTerminal} />
    </div>
  );
}
