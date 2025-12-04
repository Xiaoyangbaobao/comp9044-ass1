# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


这份 UNSW COMP6080 Final Exam Ultimate Cheat Sheet 旨在涵盖前端开发的完整生命周期：从 JS 基础到 React 高级模式，再到网络请求、UI 设计、测试和无障碍访问。

建议你将此内容打印或放在分屏中，按模块快速检索。

1. JavaScript ES6+ 核心 (The Basics)
数组操作 (Array Methods)
在 React 列表渲染和数据处理中必用。

JavaScript

// 1. Map (转换数组 -> 渲染列表)
const items = data.map(item => <div key={item.id}>{item.name}</div>);

// 2. Filter (筛选/删除)
const activeUsers = users.filter(user => user.isActive);
const deleteById = (id) => list.filter(item => item.id !== id);

// 3. Reduce (累加/聚合)
const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

// 4. Find (查找单个)
const currentUser = users.find(u => u.id === targetId);
解构与展开 (Destructuring & Spread)
JavaScript

// 对象解构 & 重命名
const { name, age: userAge } = userObj;

// 数组解构
const [first, second] = list;

// 展开运算符 (复制/合并) - *不可变性(Immutability)的关键*
const newState = { ...oldState, name: 'New Name' }; // 更新对象属性
const newList = [...oldList, newItem]; // 添加元素
Promise & Async/Await
JavaScript

// 这种写法比 .then() 链式调用更清晰，考试推荐用这个
const getData = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error');
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};
2. React Hooks 全解 (The Engine)
基础 Hooks
JavaScript

// useState
const [count, setCount] = useState(0);
setCount(c => c + 1); // 如果新状态依赖旧状态，必须用回调函数

// useEffect (副作用)
useEffect(() => {
  // Mount 或 update 时执行
  const timer = setInterval(() => {}, 1000);
  
  // Cleanup (Unmount 或依赖变化前执行)
  return () => clearInterval(timer);
}, [dependency]); // [] = Mount only; [prop] = Prop change
高级 Hooks
JavaScript

// useContext (全局状态/主题)
const ThemeContext = createContext(null);
// 在子组件中:
const theme = useContext(ThemeContext);

// useReducer (复杂状态逻辑)
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    default: return state;
  }
};
const [state, dispatch] = useReducer(reducer, { count: 0 });
// 调用: dispatch({ type: 'increment' })
自定义 Hooks (Custom Hooks) 模版
考试中若要求复用逻辑，用这个结构。

JavaScript

function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
3. 路由与导航 (React Router v6)
注意： 确保 App 被 <BrowserRouter> 包裹。

路由定义
JavaScript

<Routes>
  <Route path="/" element={<Home />} />
  {/* 动态路由参数 */}
  <Route path="/profile/:id" element={<Profile />} />
  {/* 404 处理 */}
  <Route path="*" element={<NotFound />} />
</Routes>
导航与参数获取
JavaScript

import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Component = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 获取 URL 中的 :id
  
  const goHome = () => {
    navigate('/home'); // 跳转
    // navigate(-1); //以此类推，返回上一页
  };
  
  return <button onClick={goHome}>Go</button>;
};
4. 网络请求与文件处理 (Network & Files)
完整的 Fetch 封装 (GET/POST/PUT/DELETE)
JavaScript

const apiCall = async (method, path, body = null, token = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`http://localhost:port${path}`, options);
  const data = await response.json();
  
  if (data.error) throw new Error(data.error);
  return data;
};
图片上传转 Base64 (常见考点)
用于将用户上传的图片预览或发给后端。

JavaScript

const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find(type => type === file.type);
  
  if (!valid) throw Error('provided file is not a png, jpg or jpeg image.');
  
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// 使用:
const handleUpload = async (e) => {
  const file = e.target.files[0];
  const base64 = await fileToDataUrl(file);
  setImgSrc(base64);
}
5. UI 样式与 CSS (Styling)
Styled Components (CSS-in-JS)
COMP6080 常用库。

JavaScript

import styled from 'styled-components';

// 接受 props 动态改变样式
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'white'};
  color: ${props => props.primary ? 'white' : 'blue'};
  padding: 10px;
  border-radius: 5px;

  &:hover {
    opacity: 0.8;
  }
`;
响应式布局 (Media Queries)
CSS

/* CSS 写法 */
@media (max-width: 600px) {
  .container { flexDirection: 'column'; }
}
CSS Flexbox 速查
justify-content: (主轴) flex-start | center | space-between

align-items: (交叉轴) center | stretch | flex-start

flex-direction: row | column

CSS Grid 速查
CSS

display: grid;
grid-template-columns: repeat(3, 1fr); /* 3等分列 */
gap: 20px;
6. 测试 (Testing - Jest & React Testing Library)
这是拿分重点，语法必须准。

常用查询 (Selectors)
screen.getByText(/submit/i): 按文本（忽略大小写）。

screen.getByRole('button', { name: /submit/i }): 按 ARIA 角色（推荐，最符合 A11y）。

screen.getByLabelText(/username/i): 按表单 label。

screen.getByTestId('custom-id'): 最后手段。

交互 (User Event)
JavaScript

import userEvent from '@testing-library/user-event';

test('submits form', async () => {
  render(<MyComponent />);
  
  const input = screen.getByLabelText(/email/i);
  // 必须 await
  await userEvent.type(input, 'test@test.com');
  await userEvent.click(screen.getByRole('button'));
});
断言 (Assertions)
JavaScript

expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveValue('test@test.com');
expect(element).toHaveStyle('color: red');
7. 无障碍访问 (Accessibility / A11y)
COMP6080 必考点：如果你代码功能完美但没有 A11y，通常会扣 10-20% 的分。

Semantic HTML (语义化):

不要全部用 <div>。

使用 <main>, <nav>, <header>, <article>, <section>, <footer>。

按钮必须用 <button> 而不是 <div onClick...>。

Image Alt Text:

JavaScript

<img src="cat.jpg" alt="A cute sleeping cat" /> 
// 装饰性图片用空 alt: alt=""
ARIA Labels (当没有可视文本时):

JavaScript

<button aria-label="Close menu">
  <IconX />
</button>
Form Labels:

所有 input 必须有对应的 label。

JavaScript

<label htmlFor="email">Email</label>
<input id="email" type="text" />
Keyboard Navigation:

确保所有交互元素有 tabIndex="0" (如果不是原生 button/input)。

处理 onKeyDown (Enter/Space)。

8. 实用小工具 (Utilities)
LocalStorage (持久化数据)
JavaScript

// 存
localStorage.setItem('token', 'xyz123');
localStorage.setItem('user', JSON.stringify({ name: 'Bob' }));

// 取
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// 删
localStorage.removeItem('token');
动态 Class (Conditional Classes)
如果不使用 classnames 库：

JavaScript

<div className={`btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
考试最后检查清单 (Checklist):
Console Errors: 打开 F12，确保没有红字报错 (尤其是 key prop missing)。

Linter: 确保没有 ESLint 警告。

Title: 是否动态修改了 document.title? (常见加分项)。

Loading State: 网络请求时是否显示了 "Loading..."?

Error Handling: 网络请求失败是否弹出了 alert 或显示了错误信息?

Would you like me to write a template for a "Dashboard Page" that combines Fetch, Grid Layout, and Error Handling?


既然重点是**“三个线上小游戏”，那么考察的核心就会从通用的 CRUD（增删改查）转向状态管理、定时器循环（Game Loop）、二维数组逻辑、碰撞检测以及键盘交互**。

针对 UNSW COMP6080 的小游戏考试风格，我为你重新整理了一份**“游戏开发专用” Cheat Sheet**。请把这份备在手边，这通常覆盖了 90% 的小游戏考题（如贪吃蛇、扫雷、翻牌记忆、井字棋、打地鼠等）。

🎮 COMP6080 Game Exam Cheat Sheet
1. 游戏核心引擎：定时器 (The Game Loop)
大多数游戏（贪吃蛇、打地鼠、俄罗斯方块）都需要“动”，这就需要 setInterval。

标准定时器模式 (Hook)
背下这段代码，它解决了 React 中 setInterval 拿不到最新 State 的闭包陷阱。

JavaScript

// 写在组件内部，用于驱动游戏循环
useEffect(() => {
  if (!isPlaying || isGameOver) return; // 暂停或结束时不执行

  const gameLoop = setInterval(() => {
    // 这里写每一帧的逻辑：移动蛇、生成地鼠、倒计时
    setGameState(prev => {
      // 必须用回调函数形式更新，否则 prev 是旧的
      const newState = { ...prev, timeLeft: prev.timeLeft - 1 };
      return newState;
    });
  }, 1000); // 速度 (ms)

  // 清理函数：组件卸载或依赖变化时清除旧 Timer
  return () => clearInterval(gameLoop);
}, [isPlaying, isGameOver]); // 依赖项：状态改变时重启 Timer
2. 游戏棋盘布局 (The Board)
方案 A：一维数组 + CSS Grid (最推荐，简单)
适合：井字棋、翻牌游戏、打地鼠。 假设是一个 3x3 的棋盘：

JavaScript

// 初始化状态：生成一个长度为 9 的数组，填满 null
const [board, setBoard] = useState(Array(9).fill(null));

// 渲染
return (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3列
    gap: '5px',
    width: '300px'
  }}>
    {board.map((cell, index) => (
      <button 
        key={index} 
        onClick={() => handleClick(index)}
        style={{ height: '100px', background: '#eee' }}
      >
        {cell}
      </button>
    ))}
  </div>
);
方案 B：坐标系统 ({x, y})
适合：贪吃蛇、走迷宫。

JavaScript

// 比如贪吃蛇的身体是一组坐标
const [snake, setSnake] = useState([{x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}]);
3. 核心游戏逻辑模版 (Logic Patterns)
1. 随机数生成 (Randomness)
用于：随机生成地鼠、随机洗牌。

JavaScript

// 生成 [0, max) 之间的整数
const getRandomInt = (max) => Math.floor(Math.random() * max);

// 数组洗牌 (Fisher-Yates Shuffle) - 记忆翻牌游戏必用
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
2. 胜利条件检测 (Win Condition)
用于：井字棋、五子棋。

JavaScript

const checkWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横向
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 纵向
    [0, 4, 8], [2, 4, 6]             // 对角线
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 如果三个格子都不为空且相等
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // 返回 'X' 或 'O'
    }
  }
  return null;
};
3. 碰撞检测 (Collision)
用于：贪吃蛇撞墙、飞机大战。

JavaScript

// 假设 gridWidth = 10
if (
  head.x < 0 || head.x >= gridWidth || // 撞左右墙
  head.y < 0 || head.y >= gridHeight || // 撞上下墙
  snakeBody.some(segment => segment.x === head.x && segment.y === head.y) // 撞自己
) {
  setGameOver(true);
}
4. 键盘控制 (Keyboard Controls)
这是拿分点，也是游戏能否玩起来的关键。

JavaScript

useEffect(() => {
  const handleKeyDown = (e) => {
    // 阻止方向键滚动页面
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowUp': setDirection({x: 0, y: -1}); break;
      case 'ArrowDown': setDirection({x: 0, y: 1}); break;
      case 'ArrowLeft': setDirection({x: -1, y: 0}); break;
      case 'ArrowRight': setDirection({x: 1, y: 0}); break;
      case ' ': setIsPaused(prev => !prev); break; // 空格暂停
      case 'r': restartGame(); break; // R键重开
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []); // 依赖通常为空，如果在内部用了 state，最好用 useRef 存 state
5. 三类常见游戏题型的“作弊码”
类型 A：记忆翻牌 / 配对 (Memory Match)
数据结构: [{ id: 1, emoji: '🐶', flipped: false, matched: false }, ...]

关键逻辑:

用户点击卡片 -> flipped: true。

记录 firstCard 和 secondCard。

如果两张卡 emoji 一样 -> matched: true。

如果不一样 -> setTimeout(() => flipped: false, 1000) (延迟翻回去)。

类型 B：打地鼠 / 反应类 (Whack-a-Mole)
数据结构: activeMoleIndex (当前哪个洞有地鼠)。

关键逻辑:

setInterval 每秒改变 activeMoleIndex 为随机数。

点击事件：如果 clickIndex === activeMoleIndex，分数+1，立刻设 activeMoleIndex = null。

类型 C：井字棋 / 连连看 (Turn-based Grid)
数据结构: board (数组), isXNext (布尔值)。

关键逻辑:

点击 -> 检查该格是否为空。

更新 board -> setIsXNext(!isXNext)。

每次渲染调用 checkWinner(board)。

6. 必拿的分数：UI 与 A11y (Do not forget!)
就算游戏逻辑写崩了，把界面分拿满也能及格。

Header: 显示 Score (分数), Time Left (剩余时间), Reset Button (重置)。

Start Screen: 游戏开始前显示 "Press Start"，结束后显示 "Game Over" 和 "Play Again"。

A11y (无障碍):

棋盘格子如果是 div，必须加 role="button" 和 tabIndex="0"。

加 aria-label: 比如 <button aria-label="Cell at row 1 column 1, empty"></button>。

简单好用的重置函数
JavaScript

const resetGame = () => {
  setBoard(initialBoard);
  setScore(0);
  setIsGameOver(false);
  setTimeLeft(60);
};
建议： 考试时先快速把三个游戏的架子（Header, Board, Button）搭出来，保证 UI 分数，然后再去写那些复杂的逻辑。先求“能显示”，再求“能动”，最后求“能赢”。
