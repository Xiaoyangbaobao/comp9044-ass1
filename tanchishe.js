import React, { useEffect, useMemo, useRef, useState } from "react";

// --- Types
 type Cell = { x: number; y: number };
 type Dir = "up" | "down" | "left" | "right";

// --- Helpers
const equal = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- Component
export default function SnakeGame() {
  // Grid size
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);

  // Game state
  const [snake, setSnake] = useState<Cell[]>([{ x: 10, y: 10 }]);
  const [dir, setDir] = useState<Dir>("right");
  const nextDir = useRef<Dir>("right"); // prevent instant reverse on same tick
  const [food, setFood] = useState<Cell>({ x: 15, y: 10 });
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(160); // ms per tick
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem("snake.best") || 0));
  const [wrap, setWrap] = useState(true); // wrap around walls
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Derived: set for O(1) lookups
  const snakeSet = useMemo(() => new Set(snake.map((c) => `${c.x},${c.y}`)), [snake]);

  // Place a food not on the snake
  const spawnFood = () => {
    let f: Cell;
    do {
      f = { x: rand(0, cols - 1), y: rand(0, rows - 1) };
    } while (snakeSet.has(`${f.x},${f.y}`));
    setFood(f);
  };

  // Reset game
  const reset = () => {
    setSnake([{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]);
    setDir("right");
    nextDir.current = "right";
    setScore(0);
    setSpeed(160);
    setGameOver(false);
    setRunning(true);
    setTimeout(spawnFood, 0);
  };

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "enter"].includes(k)) {
        e.preventDefault();
      }
      if (k === " ") { // space toggle
        setRunning((r) => !r);
        return;
      }
      if (k === "enter" && gameOver) {
        reset();
        return;
      }
      const d = nextDir.current;
      if (k === "arrowup" && d !== "down") nextDir.current = "up";
      else if (k === "arrowdown" && d !== "up") nextDir.current = "down";
      else if (k === "arrowleft" && d !== "right") nextDir.current = "left";
      else if (k === "arrowright" && d !== "left") nextDir.current = "right";
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (!running || gameOver) return;
    const id = setInterval(() => {
      setDir(nextDir.current);
      setSnake((prev) => {
        const head = prev[0];
        let nx = head.x;
        let ny = head.y;
        if (nextDir.current === "up") ny -= 1;
        if (nextDir.current === "down") ny += 1;
        if (nextDir.current === "left") nx -= 1;
        if (nextDir.current === "right") nx += 1;

        // wall / wrap
        if (wrap) {
          if (nx < 0) nx = cols - 1;
          if (nx >= cols) nx = 0;
          if (ny < 0) ny = rows - 1;
          if (ny >= rows) ny = 0;
        }

        // collision with wall if no wrap
        if (!wrap && (nx < 0 || nx >= cols || ny < 0 || ny >= rows)) {
          setRunning(false);
          setGameOver(true);
          return prev;
        }

        const newHead: Cell = { x: nx, y: ny };
        const willEat = equal(newHead, food);

        // self collision (ignore tail when moving unless growing)
        const body = willEat ? prev : prev.slice(0, -1);
        if (body.some((c) => equal(c, newHead))) {
          setRunning(false);
          setGameOver(true);
          return prev;
        }

        const nextSnake = [newHead, ...prev];
        if (!willEat) nextSnake.pop();
        else {
          // ate food
          setScore((s) => {
            const ns = s + 1;
            if (ns > best) {
              setBest(ns);
              localStorage.setItem("snake.best", String(ns));
            }
            return ns;
          });
          // speed up every 4 points, min cap
          setSpeed((sp) => Math.max(70, sp - 5));
          spawnFood();
        }
        return nextSnake;
      });
    }, speed);
    return () => clearInterval(id);
  }, [running, speed, cols, rows, wrap, food, best, gameOver]);

  // Focus container on mount for keyboard
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Render grid cells once (coordinates)
  const cells = useMemo(() => {
    const arr: Cell[] = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) arr.push({ x, y });
    return arr;
  }, [rows, cols]);

  const isSnake = (c: Cell) => snakeSet.has(`${c.x},${c.y}`);
  const isHead = (c: Cell) => equal(snake[0], c);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-100 text-zinc-900 p-4">
      <div className="grid gap-4 max-w-[980px] w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">React Snake</h1>
            <span className="text-sm opacity-70">Score: <b>{score}</b></span>
            <span className="text-sm opacity-70">Best: <b>{best}</b></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white hover:opacity-90"
              onClick={() => (gameOver ? reset() : setRunning((r) => !r))}
            >
              {gameOver ? "Restart" : running ? "Pause" : "Start"}
            </button>
            <button
              className="px-3 py-1.5 rounded-xl border border-zinc-300 hover:bg-white"
              onClick={() => reset()}
            >Reset</button>
            <label className="ml-2 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} />
              Wrap walls
            </label>
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex items-center gap-2">Rows
            <input
              className="w-16 px-2 py-1 rounded border"
              type="number" min={8} max={50}
              value={rows}
              onChange={(e) => setRows(Math.min(50, Math.max(8, Number(e.target.value) || 20)))}
            />
          </label>
          <label className="inline-flex items-center gap-2">Cols
            <input
              className="w-16 px-2 py-1 rounded border"
              type="number" min={8} max={50}
              value={cols}
              onChange={(e) => setCols(Math.min(50, Math.max(8, Number(e.target.value) || 20)))}
            />
          </label>
          <label className="inline-flex items-center gap-2">Speed (ms)
            <input
              className="w-20 px-2 py-1 rounded border"
              type="number" min={60} max={600}
              value={speed}
              onChange={(e) => setSpeed(Math.min(600, Math.max(60, Number(e.target.value) || 160)))}
            />
          </label>
        </div>

        {/* Game board */}
        <div
          ref={containerRef}
          role="application"
          tabIndex={0}
          aria-label="Snake game area. Use arrow keys to move. Space to pause or resume."
          className="outline-none mx-auto"
          style={{
            width: Math.min(520, window.innerWidth - 32),
          }}
        >
          <div
            className="bg-white rounded-2xl shadow p-2"
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                aspectRatio: `${cols}/${rows}`,
                gap: 2,
              }}
            >
              {cells.map((c) => {
                const snakeBody = isSnake(c);
                const headCell = isHead(c);
                const isFood = equal(food, c);
                return (
                  <div
                    key={`${c.x}-${c.y}`}
                    className={`rounded ${snakeBody ? (headCell ? "bg-emerald-500" : "bg-emerald-400") : isFood ? "bg-rose-500" : "bg-zinc-200"}`}
                    aria-hidden
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Status / Help */}
        <div className="flex flex-wrap items-center justify-between text-sm">
          <div className="opacity-70">Controls: Arrow keys to move • Space to pause/resume • Enter to restart when over.</div>
          {gameOver && <div className="text-rose-600 font-medium">Game over. Press Enter or Restart.</div>}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center justify-center gap-3 mt-2 select-none">
          <div className="grid grid-cols-3 gap-2">
            <button className="col-start-2 px-4 py-3 rounded-xl border bg-white hover:bg-zinc-50" onClick={() => (nextDir.current !== "down") && (nextDir.current = "up")}>↑</button>
            <button className="px-4 py-3 rounded-xl border bg-white hover:bg-zinc-50" onClick={() => (nextDir.current !== "right") && (nextDir.current = "left")}>←</button>
            <button className="px-4 py-3 rounded-xl border bg-white hover:bg-zinc-50" onClick={() => (nextDir.current !== "left") && (nextDir.current = "right")}>→</button>
            <button className="col-start-2 px-4 py-3 rounded-xl border bg-white hover:bg-zinc-50" onClick={() => (nextDir.current !== "up") && (nextDir.current = "down")}>↓</button>
          </div>
        </div>
      </div>
    </div>
  );
}
