React 页面壳
// App.tsx
import { useState } from 'react';
import Tetris from './games/tetris/Tetris';
import Slider from './games/slider/Slider';
import Blanko from './games/blanko/Blanko';

export default function App() {
  const [tab, setTab] = useState<'tetris'|'slider'|'blanko'>('tetris');
  return (
    <main>
      <nav aria-label="Game selector">
        <button onClick={()=>setTab('tetris')} aria-pressed={tab==='tetris'}>Tetris</button>
        <button onClick={()=>setTab('slider')} aria-pressed={tab==='slider'}>Slider</button>
        <button onClick={()=>setTab('blanko')} aria-pressed={tab==='blanko'}>Blanko</button>
      </nav>
      {tab==='tetris' && <Tetris/>}
      {tab==='slider' && <Slider/>}
      {tab==='blanko' && <Blanko/>}
    </main>
  );
}

常用工具
// utils/misc.ts
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
export const choice = <T,>(arr: T[]) => arr[Math.floor(Math.random()*arr.length)];
export const range = (n: number) => [...Array(n).keys()];

export function useEvent<K extends keyof WindowEventMap>(
  type: K, handler: (ev: WindowEventMap[K]) => any, deps: any[] = []
){
  React.useEffect(() => { window.addEventListener(type, handler as any); 
    return () => window.removeEventListener(type, handler as any); }, deps);
}

2) 键盘可达性（所有游戏通用）

容器元素 tabIndex={0} + role="application"（或具体 role）。

用 keydown 做控制；不要用 keypress。

阻止方向键滚动：e.preventDefault()。

「Roving tabindex」列表选择：当前项 tabIndex=0 其他 -1，方向键切换后 .focus()。

可视反馈：:focus-visible 样式。

SR 读屏：动态状态用 aria-live="polite"。

// 可粘贴进任意游戏根节点
<div
  role="application"
  tabIndex={0}
  onKeyDown={(e) => {
    const k = e.key.toLowerCase();
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault();
    // switch(k) { ... } 具体游戏处理
  }}
  aria-label="Game area"
/>

3) CSS 速用片段
:root { --gap: 8px; --cell: 32px; --bg: #0e1116; --fg: #e6edf3; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--fg); font-family: system-ui, -apple-system, Segoe UI, Roboto; }

.grid {
  display: grid;
  gap: var(--gap);
}

.board-10x12 {
  display: grid;
  grid-template-columns: repeat(10, var(--cell));
  grid-template-rows: repeat(12, var(--cell));
  gap: 2px;
  background: #222;
  padding: 8px;
}
.cell {
  width: var(--cell); height: var(--cell);
  border: 1px solid #333; background: #111;
}
.cell.on { background: #3aa0ff; }
.button {
  padding: 8px 12px; border: 1px solid #444; border-radius: 8px;
  background:#1f2937; color:#fff; cursor:pointer;
}
.button:focus-visible { outline: 2px solid #60a5fa; outline-offset: 2px; }

4) 游戏一：下落块（Tetris/10×12）
数据结构
type Cell = 0 | 1;             // 0空 1占
type Board = Cell[][];         // [rows][cols]
type Point = {x:number,y:number};

const W = 10, H = 12;
const SHAPES: Point[][] = [
  // 只示例 I,O,L 三种，够用就行，其他可按需加
  [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],          // I
  [{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}],          // O
  [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:2}],          // L
];

const emptyBoard = ():Board => Array.from({length:H},()=>Array.from({length:W},()=>0 as Cell));

旋转与碰撞
function rotate(shape: Point[]): Point[] {
  // 90° 顺时针： (x,y) -> (y, -x) 再平移到非负
  const rotated = shape.map(p => ({x: p.y, y: -p.x}));
  const minX = Math.min(...rotated.map(p=>p.x));
  const minY = Math.min(...rotated.map(p=>p.y));
  return rotated.map(p => ({x: p.x - minX, y: p.y - minY}));
}

function collide(board: Board, shape: Point[], off: Point): boolean {
  return shape.some(p => {
    const x = p.x + off.x, y = p.y + off.y;
    return x<0 || x>=W || y<0 || y>=H || board[y][x]===1;
  });
}

固定/消行
function merge(board: Board, shape: Point[], off: Point): Board {
  const next = board.map(r=>r.slice());
  shape.forEach(p => { next[p.y+off.y][p.x+off.x] = 1; });
  return next;
}
function clearLines(board: Board): {board:Board, cleared:number} {
  const kept = board.filter(row => row.some(c=>c===0));
  const cleared = H - kept.length;
  const pad = Array.from({length:cleared},()=>Array(W).fill(0));
  return { board: [...pad, ...kept] as Board, cleared };
}

组件核心
// games/tetris/Tetris.tsx
import React from 'react';
import { useEvent } from '../../utils/misc';

export default function Tetris() {
  const [board, setBoard] = React.useState(emptyBoard());
  const [shape, setShape] = React.useState<Point[]>(() => choice(SHAPES));
  const [off, setOff] = React.useState<Point>({x:3,y:0});
  const [running, setRunning] = React.useState(false);

  // 下落循环
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (!collide(board, shape, {x:off.x, y:off.y+1})) setOff(o=>({...o,y:o.y+1}));
      else {
        const merged = merge(board, shape, off);
        const {board: cleared} = clearLines(merged);
        setBoard(cleared);
        const next = choice(SHAPES);
        const origin = {x:3,y:0};
        if (collide(cleared, next, origin)) { // game over
          setRunning(false);
        } else { setShape(next); setOff(origin); }
      }
    }, 800);
    return () => clearInterval(id);
  }, [running, board, shape, off]);

  // 键盘
  useEvent('keydown', (e) => {
    if (!running) return;
    const k = e.key.toLowerCase();
    if (['arrowleft','arrowright','arrowdown','arrowup',' '].includes(k)) e.preventDefault();
    if (k==='arrowleft'  && !collide(board, shape, {x:off.x-1,y:off.y})) setOff(o=>({...o,x:o.x-1}));
    if (k==='arrowright' && !collide(board, shape, {x:off.x+1,y:off.y})) setOff(o=>({...o,x:o.x+1}));
    if (k==='arrowdown'  && !collide(board, shape, {x:off.x,y:off.y+1})) setOff(o=>({...o,y:o.y+1}));
    if (k==='arrowup' || k===' ') {
      const r = rotate(shape);
      if (!collide(board, r, off)) setShape(r);
    }
  }, [running, board, shape, off]);

  // 渲染
  const overlay = new Set(shape.map(p => `${p.x+off.x},${p.y+off.y}`));
  return (
    <section aria-label="Tetris" tabIndex={0}>
      <div className="board-10x12">
        {Array.from({length:H}).map((_,y)=>
          Array.from({length:W}).map((_,x)=>{
            const on = board[y][x]===1 || overlay.has(`${x},${y}`);
            return <div key={`${x}-${y}`} className={`cell ${on?'on':''}`} />;
          })
        )}
      </div>
      <div style={{marginTop:12, display:'flex', gap:8}}>
        <button className="button" onClick={()=>setRunning(true)} aria-pressed={running}>Start</button>
        <button className="button" onClick={()=>{
          setBoard(emptyBoard()); setShape(choice(SHAPES)); setOff({x:3,y:0}); setRunning(false);
        }}>Reset</button>
      </div>
    </section>
  );
}

5) 游戏二：3×3 滑块（Sliding Puzzle）
核心要点

状态：tiles: number[]，0 表示空格；目标 [1,2,3,4,5,6,7,8,0]。

随机可解：计算「逆序数」与空格行，3×3 里仅需保证逆序数为偶数。

移动规则：点击与空格**相邻（曼哈顿距离=1）**的数字，与 0 交换。

const goal = [1,2,3,4,5,6,7,8,0];
const N = 3;

function shuffleSolvable(): number[] {
  let arr = goal.slice();
  do { arr = arr.sort(()=>Math.random()-0.5); } while(!isSolvable(arr));
  return arr;
}
function inversions(a:number[]) {
  const v = a.filter(n=>n!==0);
  let cnt = 0; for(let i=0;i<v.length;i++)for(let j=i+1;j<v.length;j++) if(v[i]>v[j]) cnt++;
  return cnt;
}
function isSolvable(a:number[]) { return inversions(a) % 2 === 0; }
function pos(i:number){ return {x:i%N, y:Math.floor(i/N)}; }
function canSwap(a:number[], i:number, j:number){
  const p = pos(i), q = pos(j);
  return Math.abs(p.x-q.x)+Math.abs(p.y-q.y) === 1;
}

组件
// games/slider/Slider.tsx
export default function Slider() {
  const [tiles, setTiles] = React.useState<number[]>(() => shuffleSolvable());
  const zi = tiles.indexOf(0);

  const move = (i:number) => {
    const z = tiles.indexOf(0);
    if (!canSwap(tiles, i, z)) return;
    const next = tiles.slice(); [next[i], next[z]] = [next[z], next[i]];
    setTiles(next);
  };

  const done = tiles.every((v,i)=>v===goal[i]);

  return (
    <section aria-label="Sliding puzzle" tabIndex={0}>
      <div className="grid" style={{gridTemplateColumns:`repeat(${N}, 100px)`}}>
        {tiles.map((n,i)=>(
          <button
            key={i}
            className="button"
            style={{height:100, visibility: n===0 ? 'hidden' : 'visible'}}
            onClick={()=>move(i)}
            aria-label={n===0?'empty':`tile ${n}`}
          >
            {n!==0 && n}
          </button>
        ))}
      </div>
      <div style={{marginTop:10, display:'flex', gap:8}}>
        <button className="button" onClick={()=>setTiles(shuffleSolvable())}>Shuffle</button>
        {done && <span role="status" aria-live="polite">🎉 Completed!</span>}
      </div>
    </section>
  );
}


键盘支持： 给每个 tile tabIndex={-1}，用 roving tabindex 仅让「可移动的」tile 可聚焦；方向键把焦点移动到下一个可移动 tile，按 Enter 执行 move()（考试里不强制也可按简单版处理：容器接收方向键，移动与 0 相邻的 tile）。

6) 游戏三：Blanko（词条填空 3 格）
需求要点（结合你之前的实现）

给定单词，随机挑 3 个下标为空 <input>。

受控输入：只接收单字符 [A-Za-z]，自动大写，输入后自动聚焦到下一个空格。

校验：全部填完后比较与原词是否相同，高亮正确/错误。

辅助功能：每个 input 加 aria-label="letter position X"；结果提示 aria-live="polite"。

// games/blanko/Blanko.tsx
const WORDS = ['COMP6080','REACT','JAVASCRIPT','HOOKS','ELEMENT'];
const pick3 = (len:number) => Array.from(new Set(
  Array.from({length:100}).map(()=>Math.floor(Math.random()*len))
)).slice(0,3).sort((a,b)=>a-b);

export default function Blanko(){
  const origin = React.useMemo(()=>choice(WORDS),[]);
  const blanks = React.useMemo(()=>pick3(origin.length),[origin]);
  const [chars, setChars] = React.useState<string[]>(Array(origin.length).fill(''));
  const inputs = React.useRef<Array<HTMLInputElement|null>>([]);

  const onChange = (i:number, v:string) => {
    const ch = v.toUpperCase().slice(-1).replace(/[^A-Z0-9]/g,'');
    setChars(prev => { const n = prev.slice(); n[i]=ch; return n; });
    if (ch && inputs.current[i+1]) inputs.current[i+1]!.focus();
  };

  const done = blanks.every(i => chars[i] && chars[i].length===1);
  const result = done ? origin.split('').every((c,i)=> blanks.includes(i) ? chars[i]===c : true) : null;

  return (
    <section aria-label="Blanko" tabIndex={0}>
      <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
        {origin.split('').map((c,i)=>{
          const isBlank = blanks.includes(i);
          return isBlank ? (
            <input
              key={i}
              ref={el => inputs.current[i]=el}
              value={chars[i]||''}
              onChange={e=>onChange(i,e.target.value)}
              maxLength={1}
              aria-label={`letter position ${i+1}`}
              className="button"
              style={{width:40,textAlign:'center', background:'#0b1220'}}
            />
          ) : (
            <span key={i} className="button" aria-hidden="true">{c}</span>
          );
        })}
      </div>
      <div style={{marginTop:10}} aria-live="polite">
        {done && (result ? '✅ Correct!' : '❌ Try again')}
      </div>
      <button className="button" style={{marginTop:10}} onClick={()=>location.reload()}>New Word</button>
    </section>
  );
}
