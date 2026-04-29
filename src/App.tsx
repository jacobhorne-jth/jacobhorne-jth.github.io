import { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Mail,
  ExternalLink,
  ArrowRight,
  Code2,
  Cpu,
  Users,
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
import projAgonus from "./assets/projects/agonus.png";
import projPropIntel from "./assets/projects/propintel.png";
import projCrimeMap from "./assets/projects/JacobHorneCrimeMap.png";
import projOnboarding from "./assets/projects/onbaoardingreal.png";
import projSMS from "./assets/projects/realsms.png";
import projWebsite from "./assets/projects/port.png";
import logoC1 from "./assets/logos/c1-logo.png";
import logoBTT from "./assets/logos/btt-logo.png";
import logoTCS from "./assets/logos/tcs-logo.jpg";
import logoCaretech from "./assets/logos/caretechlogo.jpeg";
import logoCTC from "./assets/logos/ctclogo.jpeg";
import logoBlockchain from "./assets/logos/blockchainlogo.jpeg";
import logoSENS from "./assets/logos/senslogo.jpeg";
import logoCQ from "./assets/logos/cqlogo.png";
import logoCARE from "./assets/logos/carelogo.png";
import logoHandshake from "./assets/logos/hlogo.jpeg";
import logoThinkNeuro from "./assets/logos/tnlogo.png";
import logoCOSMOS from "./assets/logos/cosmosLogo.jpeg";
import logoRFA from "./assets/logos/rfalogo.jpeg";
import logoSW from "./assets/logos/swlogo.jpeg";
import logoSL from "./assets/logos/sllogo.png";
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
  { type: "cols", left: "  game       — play snake",       right: "  pong       — play pong" },
  { type: "cols", left: "  hack       — initiate hack",    right: "  joke       — random dev joke" },
  { type: "cols", left: "  fortune    — words of wisdom",  right: "  coffee     — ☕" },
  { type: "cols", left: "  skills     — tech stack",       right: "  ping       — ping jacob" },
  { type: "cols", left: "  clear      — clear terminal",   right: "  exit       — close terminal" },
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

// ─── Pong game ───────────────────────────────────────────────────────────────

function PongGame({ onExit }: { onExit: () => void }) {
  const COLS = 50, ROWS = 16, PADDLE_H = 4, PADDLE_SPEED = 0.9;
  const PLAYER_X = 1, AI_X = COLS - 2;
  const keysHeld = useRef(new Set<string>());
  const playerY = useRef((ROWS - PADDLE_H) / 2);
  const aiY = useRef((ROWS - PADDLE_H) / 2);
  const ballX = useRef(COLS / 2);
  const ballY = useRef(ROWS / 2);
  const ballVX = useRef(1.0);
  const ballVY = useRef(0.5);
  const playerScore = useRef(0);
  const aiScore = useRef(0);
  const phase = useRef<"idle" | "playing" | "gameover">("idle");
  const [, tick] = useState(0);
  const redraw = () => tick(n => n + 1);

  const resetBall = (dir: 1 | -1) => {
    ballX.current = COLS / 2;
    ballY.current = ROWS / 2;
    ballVX.current = dir * 1.0;
    ballVY.current = (Math.random() > 0.5 ? 1 : -1) * 0.45;
  };

  const restart = () => {
    playerY.current = (ROWS - PADDLE_H) / 2;
    aiY.current = (ROWS - PADDLE_H) / 2;
    playerScore.current = 0;
    aiScore.current = 0;
    resetBall(1);
    phase.current = "idle";
    redraw();
  };

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (["ArrowUp","ArrowDown","w","s","W","S"," "].includes(e.key)) e.preventDefault();
      keysHeld.current.add(e.key);
      if (e.key === " ") {
        if (phase.current === "idle") { phase.current = "playing"; redraw(); }
        else if (phase.current === "gameover") restart();
      } else if (e.key === "Escape" || e.key === "q") onExit();
    };
    const onUp = (e: KeyboardEvent) => keysHeld.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [onExit]);

  useEffect(() => {
    const id = setInterval(() => {
      if (phase.current !== "playing") return;

      if (keysHeld.current.has("ArrowUp") || keysHeld.current.has("w") || keysHeld.current.has("W"))
        playerY.current = Math.max(0, playerY.current - PADDLE_SPEED);
      if (keysHeld.current.has("ArrowDown") || keysHeld.current.has("s") || keysHeld.current.has("S"))
        playerY.current = Math.min(ROWS - PADDLE_H, playerY.current + PADDLE_SPEED);

      ballX.current += ballVX.current;
      ballY.current += ballVY.current;

      if (ballY.current <= 0)        { ballY.current = 0;        ballVY.current =  Math.abs(ballVY.current); }
      if (ballY.current >= ROWS - 1) { ballY.current = ROWS - 1; ballVY.current = -Math.abs(ballVY.current); }

      const bx = ballX.current, by = ballY.current;

      if (bx <= PLAYER_X + 1 && ballVX.current < 0) {
        const py = playerY.current;
        if (by >= py && by < py + PADDLE_H) {
          ballX.current = PLAYER_X + 1.1;
          ballVX.current = Math.min(Math.abs(ballVX.current) * 1.05, 2.2);
          ballVY.current = ((by - (py + PADDLE_H / 2)) / (PADDLE_H / 2)) * 0.9;
        }
      }
      if (bx >= AI_X - 1 && ballVX.current > 0) {
        const ay = aiY.current;
        if (by >= ay && by < ay + PADDLE_H) {
          ballX.current = AI_X - 1.1;
          ballVX.current = -Math.min(Math.abs(ballVX.current) * 1.05, 2.2);
          ballVY.current = ((by - (ay + PADDLE_H / 2)) / (PADDLE_H / 2)) * 0.9;
        }
      }

      const aiCenter = aiY.current + PADDLE_H / 2;
      if (ballY.current > aiCenter + 0.3) aiY.current = Math.min(ROWS - PADDLE_H, aiY.current + 0.65);
      else if (ballY.current < aiCenter - 0.3) aiY.current = Math.max(0, aiY.current - 0.65);

      if (ballX.current < 0) {
        aiScore.current++;
        if (aiScore.current >= 5) phase.current = "gameover"; else resetBall(-1);
      } else if (ballX.current > COLS) {
        playerScore.current++;
        if (playerScore.current >= 5) phase.current = "gameover"; else resetBall(1);
      }

      redraw();
    }, 60);
    return () => clearInterval(id);
  }, []);

  const rows = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => {
      const bx = Math.round(ballX.current), by = Math.round(ballY.current);
      const py = Math.floor(playerY.current), ay = Math.floor(aiY.current);
      if (x === bx && y === by) return "●";
      if (x === PLAYER_X && y >= py && y < py + PADDLE_H) return "█";
      if (x === AI_X && y >= ay && y < ay + PADDLE_H) return "█";
      if (x === Math.floor(COLS / 2) && y % 2 === 0) return "┊";
      return " ";
    }).join("")
  );

  return (
    <div className="flex flex-col h-full p-3 gap-2 select-none font-mono">
      <div className="flex justify-between text-xs text-green-600">
        <span>you: {playerScore.current}</span>
        <span>pong.exe  ↑↓/WS to move · [q] quit</span>
        <span>cpu: {aiScore.current}</span>
      </div>
      <div className="flex-1 flex items-center justify-center border border-green-900/40 rounded-lg">
        {phase.current === "idle" && (
          <div className="text-center space-y-2">
            <div className="text-green-400 text-base">PONG</div>
            <div className="text-green-700 text-xs">↑↓ or W/S to move · first to 5 wins</div>
            <div className="text-green-700 text-xs">[space] to start · [q] quit</div>
          </div>
        )}
        {phase.current === "gameover" && (
          <div className="text-center space-y-2">
            <div className={playerScore.current >= 5 ? "text-green-400" : "text-red-400"}>
              {playerScore.current >= 5 ? "YOU WIN!" : "GAME OVER"}
            </div>
            <div className="text-green-500 text-xs">{playerScore.current} — {aiScore.current}</div>
            <div className="text-green-700 text-xs">[space] restart · [q] quit</div>
          </div>
        )}
        {phase.current === "playing" && (
          <pre className="text-green-400 text-xs leading-tight">{rows.join("\n")}</pre>
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
  const [activeGame, setActiveGame] = useState<"snake" | "pong" | null>(null);
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
      case "game": setActiveGame("snake"); return;
      case "pong": setActiveGame("pong"); return;
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
          { type: "output", text: "Languages   Python · TypeScript · JavaScript · C/C++ · SQL · Java" },
          { type: "output", text: "Frameworks  FastAPI · Next.js · React · Node.js · PyTorch · LangChain" },
          { type: "output", text: "Infra       PostgreSQL · Supabase · pgvector · Docker · AWS" },
          { type: "output", text: "AI/ML       LLMs · RAG · Agents · PINNs · XGBoost · Transformers" },
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
          ) : activeGame === "pong" ? (
            <PongGame onExit={() => setActiveGame(null)} />
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

type AboutColumn = { Icon: LucideIcon; text: string };
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
  name: string; monogram: string; desc: string; tech: string[];
  accentLine: string; repoUrl: string; demoUrl?: string; imgUrl?: string;
  group?: string;
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

const experienceRoles: RoleEntry[] = [
  {
    logo: "Capit",
    logoImg: logoC1,
    company: "Capital One",
    role: "Software Engineering Intern",
    period: "Summer 2026",
    bullets: ["Incoming Summer 2026"],
    tags: [],
  },
  {
    logo: "Break", 
    logoImg: logoBTT,
    company: "Break Through Tech",
    role: "AI/ML Fellow",
    period: "Mar 2026 — Present",
    isActive: true,
    bullets: [
      "Incoming 2026/27 cohort",
    ],
    tags: [],
  },
  {
    logo: "Tata",
    logoImg: logoTCS,
    company: "Tata Consultancy Services",
    role: "Software Engineer (Capstone)",
    period: "Jan 2026 — Present",
    isActive: true,
    bullets: [
      "Built a 5-stage agentic pipeline with an ethics gate blocking vulnerable users from persuasion responses with 100% deterministic accuracy.",
      "Designed a zero-shot DeBERTa v3 classifier across 8 emotion labels and 12 financial intent categories mapped to Cialdini-backed YAML strategy files.",
      "Built a PDF/OCR ingestion pipeline across 6 banking document types with OpenAI embeddings in pgvector for semantic retrieval.",
    ],
    tags: ["Python", "DeBERTa", "GPT-4o-mini", "FastAPI", "pgvector", "OpenAI"],
  },
  {
    logo: "CareT",
    logoImg: logoCaretech,
    company: "CareTech at UCI",
    role: "Software Developer",
    period: "Oct 2025 — Present",
    isActive: true,
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
    period: "Oct 2025 — Present",
    isActive: true,
    bullets: [
      "Built a scheduling/quota-management platform with React and TypeScript supporting 23,000+ patients across clinics.",
      "Developed secure Node.js/Express REST APIs processing 5,000+ requests/week for auth and workflow automation.",
      "Implemented Chakra UI, Zustand interfaces backed by PostgreSQL, reducing booking conflicts and scheduling workload by 30%.",
    ],
    tags: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Chakra UI"],
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
  {
    logo: "Crowd",
    logoImg: logoCQ,
    company: "CrowdQuant",
    role: "Software Engineering Intern",
    period: "Jun 2025 — Aug 2025",
    bullets: [
      "Built a crowdsourced stock prediction platform with FastAPI and React, integrating Supabase and JWT auth with role-based access control for 100+ test users.",
      "Developed PyTorch training pipelines for ResNet18 and MobileNetV2, improving forecasting accuracy by 20%.",
      "Scaled GPU workloads using Runpod, reducing training time by 40% through optimized distributed training workflows.",
    ],
    tags: ["Python", "FastAPI", "React", "PyTorch", "Supabase", "Runpod", "JWT"],
  },
  {
    logo: "CARE",
    logoImg: logoCARE,
    company: "CARE Initiative",
    role: "Software Lead",
    period: "Sep 2021 — Aug 2024",
    bullets: [
      "Led development of a wrist-worn embedded systems device for bilateral stimulation therapy.",
      "Built a React Native companion app with real-time Bluetooth device communication.",
      "Designed hardware and software systems to support users experiencing panic attacks.",
    ],
    tags: ["Embedded C", "C++", "React Native", "Hardware", "BLE"],
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
      "Co-authored paper accepted to ICLR 2026 LLM Reasoning Workshop on multi-agent evaluation and token-level confidence.",
    ],
    featured: [
      {
        text: "Paper accepted to ICLR 2026 LLM Reasoning Workshop — \"The First Tokens Matter: Early Confidence Signals for Evaluating LLM Reasoning\"",
        url: "https://openreview.net/forum?id=0FOOrwSQ9E",
      },
      {
        text: "Paper accepted to ACL 2026 Student Research Workshop",
        url: "https://openreview.net/forum?id=thD04Xbris",
      },
    ],
    tags: ["Python", "LangGraph", "NLP", "NumPy", "Pandas", "Matplotlib", "LLMs"],
  },
  {
    logo: "Hand",
    logoImg: logoHandshake,
    company: "Handshake",
    role: "AI Model Validation Expert",
    period: "Sep 2025 — Dec 2025",
    bullets: [
      "Validated LLM outputs across production AI systems for accuracy, reliability, and safety.",
      "Optimized data-labeling workflows to improve consistency and labeling throughput.",
      "Enforced model compliance standards for enterprise AI deployments.",
    ],
    tags: ["LLMs", "Data Labeling", "QA", "AI Safety"],
  },
  {
    logo: "Think",
    logoImg: logoThinkNeuro,
    company: "Think Neuro",
    role: "AI Researcher",
    period: "Sep 2024 — Jan 2025",
    bullets: [
      "Conducted bibliometric analysis of 90+ peer-reviewed studies on AI/ML in brain-computer interfaces and neurofeedback.",
      "Applied R-based statistical analysis to uncover trends in neuroimaging, neural decoding, and AI-driven neurotechnology.",
      "Produced research summaries identifying emerging directions across the BCI research landscape.",
    ],
    tags: ["R", "Python", "Data Visualization", "Research", "BCI"],
  },
  {
    logo: "UCSD",
    logoImg: logoCOSMOS,
    company: "UCSD COSMOS — Game AI Design",
    role: "Student Researcher",
    period: "Jul 2023 — Aug 2023",
    bullets: [
      "Researched AI-driven game design and computational modeling with a focus on simulation.",
      "Implemented C# AI state machines and behavior trees in Unity.",
      "Created original video games demonstrating learned AI and simulation principles.",
    ],
    tags: ["C#", "Unity", "AI/ML", "Game Design"],
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
  {
    logo: "Scho",
    logoImg: logoSW,
    company: "Schoolhouse.world",
    role: "Tutor",
    period: "Aug 2022 — Jun 2023",
    bullets: [
      "Led SAT bootcamps and one-on-one tutoring for 20+ students in CS, math, and physics.",
      "Taught Python, Java, data structures, algebra through calculus, and mechanics.",
      "Adapted instruction to individual learning styles and pacing needs.",
    ],
    tags: ["Python", "Java", "Mathematics", "Tutoring", "SAT Prep"],
  },
  {
    logo: "STEM",
    logoImg: logoSL,
    company: "STEM League",
    role: "Java & Python Mentor",
    period: "Jun 2022 — Aug 2022",
    bullets: [
      "Mentored students through personalized Python and Java fundamentals instruction.",
      "Built strong programming and problem-solving foundations for competitive learners.",
    ],
    tags: ["Python", "Java", "Mentoring"],
  },
];

const projects: Project[] = [
  {
    name: "Agonus",
    monogram: "AGN",
    desc: "Decentralized AI trading platform where autonomous agents compete in crypto tournaments with on-chain betting, real-time leaderboards, and tokenized rewards.",
    tech: ["LangChain", "FastAPI", "Next.js", "Solidity", "PostgreSQL"],
    accentLine: "bg-yellow-500",
    repoUrl: "#",
    demoUrl: "https://agonus-frontend-45256917921.us-central1.run.app/",
    imgUrl: projAgonus,
    group: "Blockchain @ UCI",
  },
  {
    name: "Prop.Intel",
    monogram: "PRP",
    desc: "AI property risk platform generating real-time reports using ATTOM ownership data, FEMA National Risk Index datasets, and a ridge regression model across 3,100+ counties.",
    tech: ["Next.js", "TypeScript", "Python", "Ridge Regression"],
    accentLine: "bg-orange-500",
    repoUrl: "https://github.com/jacobhorne-jth/prop-intel",
    imgUrl: projPropIntel,
  },
  {
    name: "SF Crime Mapper",
    monogram: "SCM",
    desc: "Full-stack interactive web app that forecasts San Francisco neighborhood-level incident risk and visualizes it on a Mapbox choropleth.",
    tech: ["FastAPI", "Prophet", "XGBoost", "React", "Vite"],
    accentLine: "bg-amber-500",
    repoUrl: "https://github.com/jacobhorne-jth/sf-crime-mapper",
    imgUrl: projCrimeMap,
  },
  {
    name: "GitHub Onboarding Agent",
    monogram: "GOA",
    desc: "AI-powered GitHub onboarding agent that ingests any repository and provides code-aware summaries, repo exploration, and RAG-driven Q&A.",
    tech: ["Python", "FastAPI", "LangChain", "LangGraph", "Pinecone"],
    accentLine: "bg-purple-500",
    repoUrl: "https://github.com/jacobhorne-jth/github-onboarding-agent",
    imgUrl: projOnboarding,
  },
  {
    name: "SMS Spam Detector",
    monogram: "SMS",
    desc: "FastAPI app that detects SMS spam with Logistic Regression, combining TF-IDF text analysis and engineered features like phone number detection and spam keywords.",
    tech: ["Python", "FastAPI", "Logistic Regression", "TF-IDF"],
    accentLine: "bg-rose-500",
    repoUrl: "https://github.com/jacobhorne-jth/sms-spam-detector",
    imgUrl: projSMS,
  },
  {
    name: "Portfolio Website",
    monogram: "JH",
    desc: "This portfolio — built with React, TypeScript, and Tailwind CSS. Features a dark/light mode, interactive terminal with snake game, and responsive design.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    accentLine: "bg-blue-500",
    repoUrl: "https://github.com/jacobhorne-jth/jacobhorne-jth.github.io",
    imgUrl: projWebsite,
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
  { label: "Now", href: "#explore" },
  { label: "Contact", href: "#education" },
];

// ─── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3">
        <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">
          {number}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {subtitle && <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}

// ─── RoleCard ──────────────────────────────────────────────────────────────────

function RoleCard({ entry }: { entry: RoleEntry }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
            {entry.logoImg
              ? <img src={entry.logoImg} alt={entry.company} className="h-full w-full object-cover" />
              : <span className="text-[9px] font-bold text-slate-300 leading-none text-center px-0.5">{entry.logo}</span>}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{entry.role}</span>
              {entry.isActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  Active
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-300 mt-0.5">
              {entry.companyLink ? (
                <a href={entry.companyLink} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                  {entry.company} <ExternalLink className="h-2.5 w-2.5" />
                </a>
              ) : entry.company}
            </div>
          </div>
        </div>
        <span className="text-[11px] font-mono text-gray-500 dark:text-slate-300 shrink-0 pt-0.5">{entry.period}</span>
      </div>

      {/* Bullets */}
      {entry.bullets.length > 0 && (
        <ul className="space-y-1.5">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-sm bg-blue-500 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Featured callout */}
      {entry.featured && (Array.isArray(entry.featured) ? entry.featured : [entry.featured]).map((f, i) => (
        <a
          key={i}
          href={f.url ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="flex items-start gap-2 rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3 text-xs text-blue-300 hover:bg-blue-500/15 transition-colors"
        >
          <span className="text-yellow-400 shrink-0 mt-px">★</span>
          <span className="flex-1 leading-relaxed">{f.text}</span>
          {f.url && <ExternalLink className="h-3 w-3 shrink-0 mt-px text-blue-400" />}
        </a>
      ))}

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map(t => (
            <span key={t} className="text-[11px] rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-2.5 py-0.5 text-gray-500 dark:text-slate-400">
              {t}
            </span>
          ))}
        </div>
      )}
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
      <div className="max-w-[1220px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
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
          <div className="max-w-[1220px] mx-auto px-6 py-4 space-y-1">
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
  "Building an AI smart contract audit playground that proves exploits",
  "Building a real-time food recognition and vitamin tracking platform",
  "Building an appointment-management platform for local non profit",
  "Researching physics-informed ML (PINNs) for thermal storage optimization",
  "Building a financial chatbot with an agentic ethics gate for persuasian",
  "Researching uncertainty in multi-agent LLMs through token analysis",
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
              <div><span className="text-purple-400">const</span> <span className="text-blue-300">jacob</span> = {"{"}</div>
              <div className="pl-4"><span className="text-slate-400">name:</span>{"      "}<span className="text-amber-300">"Jacob Horne"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">role:</span>{"      "}<span className="text-amber-300">"Incoming SWE Intern @ Capital One"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">studying:</span>{"  "}<span className="text-amber-300">"CS @ UCI"</span>,</div>
              <div className="pl-4"><span className="text-slate-400">gpa:</span>{"       "}<span className="text-cyan-400">3.9</span>,</div>
              <div className="pl-4 min-h-[3.3em]">
                <span className="text-slate-400">currently: </span>
                <span
                  className="text-green-300 transition-opacity duration-300"
                  style={{ opacity: visible ? 1 : 0 }}
                >"{CURRENTLY_ITEMS[idx]}",</span>
              </div>
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
      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pt-24 pb-36 md:pt-28 md:pb-48">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-7">
            <p className="font-mono text-base text-blue-400 tracking-wide">&gt; Hello, I'm</p>
            <div className="space-y-3">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-none text-white">
                Jacob Horne.
              </h1>
              <p className="text-2xl md:text-3xl text-slate-300 font-medium">
                Software Engineer. Researcher.<br />Builder. Teacher. Learner.
              </p>
            </div>
            <p className="text-base text-slate-400 leading-relaxed max-w-lg">
              I build production-focused software systems across machine learning, full-stack development,
              and AI. Currently studying CS at UCI and incoming SWE Intern at Capital One.
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
    <section id="about" className="bg-gray-50 dark:bg-slate-950 pt-8 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
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
    <section id="experience" className="bg-gray-50 dark:bg-slate-950 pt-8 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="02" title="Experience" />
        <div className="grid sm:grid-cols-2 gap-5">
          {experienceRoles.map(e => <RoleCard key={e.company + e.role} entry={e} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsSection() {
  return (
    <section id="projects" className="bg-gray-50 dark:bg-slate-950 pt-8 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        {/* Header row */}
        <div className="flex items-baseline gap-4 mb-8">
          <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">03</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
          <a
            href="https://github.com/jacobhorne-jth"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-150 pb-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
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
                <div className={`absolute top-0 left-0 right-0 h-0.5 z-10 ${p.accentLine}`} />
                {p.imgUrl ? (
                  <img src={p.imgUrl} alt={p.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <span className="text-5xl font-black font-mono text-slate-700/60 select-none tracking-tighter">
                    {p.monogram}
                  </span>
                )}
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
              <div className="px-5 pb-4 flex items-center gap-3 flex-wrap">
                {p.repoUrl !== "#" && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
                  >
                    <GithubIcon className="h-3.5 w-3.5" /> Code
                  </a>
                )}
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Demo
                  </a>
                )}
                {p.group && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-300 ml-auto">
                    <Users className="h-3 w-3 shrink-0" /> {p.group}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Research ─────────────────────────────────────────────────────────────────

function ResearchSection() {
  return (
    <section id="research" className="bg-gray-50 dark:bg-slate-950 pt-8 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="04" title="Research" />
        <div className="grid sm:grid-cols-2 gap-5">
          {researchRoles.map(e => <RoleCard key={e.company + e.role} entry={e} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Teaching & Mentorship ────────────────────────────────────────────────────

function TeachingSection() {
  return (
    <section id="teaching" className="bg-gray-50 dark:bg-slate-950 pt-8 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <SectionHeader number="05" title="Teaching & Mentorship" />
        <div className="grid sm:grid-cols-2 gap-5">
          {teachingRoles.map(e => <RoleCard key={e.company + e.role} entry={e} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Education + Contact ──────────────────────────────────────────────────────

function EducationContact() {
  return (
    <section id="education" className="bg-gray-50 dark:bg-slate-950 pt-8 pb-24 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Education */}
          <div>
            <div className="flex items-baseline gap-3 mb-10">
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">06</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Education</h2>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-slate-700 p-8">
              <img src={logoUCI} alt="UCI" className="h-16 w-16 rounded-xl object-cover mb-5" />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">University of California, Irvine</p>
                <p className="text-sm text-gray-600 dark:text-slate-300">B.S. Computer Science</p>
                <p className="text-sm text-blue-400">Campuswide Honors Collegium</p>
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100 pt-1">GPA: 3.9</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-mono">Expected Graduation: Jun 2027</p>
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
              <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">07</span>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Let's Connect</h2>
            </div>
            <div className="space-y-5">
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                I'm always open to new opportunities, research collaborations, and interesting conversations.
                Reach out anytime.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-slate-400 font-mono shrink-0">Open to internships/opportunities:</span>
                {["Fall 2026", "Winter 2027", "Summer 2027"].map(term => (
                  <span key={term} className="rounded-full bg-green-500/10 border border-green-500/25 px-2.5 py-0.5 text-xs text-green-400 font-mono">
                    {term}
                  </span>
                ))}
              </div>
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
                  target="_blank"
                  rel="noreferrer"
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

// ─── Now ──────────────────────────────────────────────────────────────────────

function NowSection() {
  const items = [
    {
      label: "Building",
      entries: [
        "ML surrogates (GRU + PINN) for thermal energy storage prediction @ Calit2",
        "Agentic ethics gate pipeline for financial chatbot @ TCS Capstone",
        "Smart contract audit playground",
        "Full-stack appointment-management platform for Celebrating Life Community Health Center",
        "Nutrition tracking app with real-time food scanning for vitamin intake and recommendations",
      ],
    },
    {
      label: "Learning",
      entries: [
        "Physics-informed neural networks and heat transfer PDE constraints",
        "Multi-agent LLM evaluation and token-level confidence modeling",
        "Distributed systems / networks — scalability patterns, consensus, and fault tolerance",
        "LLM optimization — quantization, KV caching, and inference throughput",
      ],
    },
    {
      label: "Up next",
      entries: [
        "Incoming SWE Intern @ Capital One — Summer 2026",
        "Break Through Tech AI/ML Fellowship — 2026/27 cohort",
        "MAISS Peer Mentor @ UCI",
      ],
    },
  ];

  return (
    <section id="now" className="bg-slate-950 border-t border-slate-800 pt-16 pb-20 scroll-mt-16">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8">
        <div className="mb-10">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase select-none">Now</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">What I'm up to</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(col => (
            <div key={col.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-xs font-bold tracking-[0.2em] text-blue-500 uppercase mb-4">{col.label}</p>
              <ul className="space-y-3">
                {col.entries.map((e, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-sm bg-blue-500 shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
      label: "Terminal Mode",
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
      href: "#now",
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
      <div className="max-w-[1220px] mx-auto">
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
      <TeachingSection />
      <EducationContact />
      <NowSection />
      <ExploreBar onOpenTerminal={openTerminal} />
    </div>
  );
}
