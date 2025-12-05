import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- 1. 配置与常量 (Config) ---
const GRID_SIZE = 4; // 例如：4x4 网格
const INITIAL_SCORE = 0;
const GAME_STATES = {
  IDLE: 'IDLE',       // 等待开始
  PLAYING: 'PLAYING', // 进行中
  WON: 'WON',         // 胜利
  GAME_OVER: 'GAME_OVER' // 失败
};

// --- 2. 辅助函数 (Helpers) ---
// 用于生成初始网格、检查数组等纯函数
const generateEmptyGrid = () => Array(GRID_SIZE * GRID_SIZE).fill(null);

const GameTemplate = () => {
  // --- 3. 状态管理 (State) ---
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [score, setScore] = useState(INITIAL_SCORE);
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  
  // 用于解决 useEffect 闭包陷阱的 Ref (如果是实时游戏如贪吃蛇需要)
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // --- 4. 核心游戏逻辑 (Core Logic) ---
  
  // A. 初始化/重置游戏
  const initGame = useCallback(() => {
    const newGrid = generateEmptyGrid();
    // TODO: 在这里添加初始化逻辑，比如随机放置方块、生成蛇等
    // newGrid[0] = 'Player'; 
    
    setGrid(newGrid);
    setScore(INITIAL_SCORE);
    setGameState(GAME_STATES.PLAYING);
  }, []);

  // B. 胜利/结束判定
  const checkGameStatus = (currentGrid) => {
    // TODO: 实现胜利条件
    const isWin = false; 
    if (isWin) {
      setGameState(GAME_STATES.WON);
      handleWin();
      return;
    }

    // TODO: 实现失败条件
    const isOver = false;
    if (isOver) {
      setGameState(GAME_STATES.GAME_OVER);
    }
  };

  // C. 胜利后处理 (积分、弹窗)
  const handleWin = () => {
    // 延迟弹窗，让 UI 先渲染最后一帧
    setTimeout(() => {
      alert("You Won!");
      // 更新 Dashboard 总分 (LocalStorage)
      const currentWins = parseInt(localStorage.getItem('gamesWon') || '0', 10);
      localStorage.setItem('gamesWon', (currentWins + 1).toString());
    }, 100);
  };

  // --- 5. 交互处理 (Interaction) ---

  // A. 移动/操作逻辑
  const handleMove = useCallback((direction) => {
    if (gameStateRef.current !== GAME_STATES.PLAYING) return;

    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      // TODO: 根据 direction ('UP', 'DOWN', 'LEFT', 'RIGHT') 更新 newGrid
      // let moved = false;
      
      // if (moved) {
      //   checkGameStatus(newGrid);
      //   return newGrid;
      // }
      return prevGrid;
    });
  }, []);

  // B. 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 防止滚动
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp': handleMove('UP'); break;
        case 'ArrowDown': handleMove('DOWN'); break;
        case 'ArrowLeft': handleMove('LEFT'); break;
        case 'ArrowRight': handleMove('RIGHT'); break;
        case 'r': initGame(); break; // 快捷键 R 重置
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, initGame]); // 依赖项

  // C. 挂载时自动开始 (可选)
  useEffect(() => {
    initGame();
  }, [initGame]);


  // --- 6. 渲染 (Render) ---
  return (
    <div className="game-container" style={{ textAlign: 'center', outline: 'none' }} tabIndex="0">
      
      {/* 头部信息 */}
      <div className="game-header">
        <h2>Score: {score}</h2>
        <div className="status-badge">{gameState}</div>
      </div>

      {/* 游戏棋盘 */}
      <div 
        className="grid-board"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 100px)`, // 动态列宽
          gap: '5px',
          margin: '20px auto',
          width: 'fit-content',
          backgroundColor: '#333',
          border: '5px solid #333'
        }}
      >
        {grid.map((cell, index) => (
          <div 
            key={index}
            className="grid-cell"
            onClick={() => { /* 支持点击交互 */ }}
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: cell ? '#fff' : '#ccc', // 有内容白色，无内容灰色
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              cursor: 'pointer'
            }}
          >
            {cell}
          </div>
        ))}
      </div>

      {/* 控制按钮区 */}
      <div className="game-controls">
        <button 
          onClick={() => { /* 一键胜利逻辑 (调试用) */ setGameState(GAME_STATES.WON); }}
          disabled={gameState === GAME_STATES.WON}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Solve / Debug Win
        </button>
        
        <button 
          onClick={initGame}
          style={{ padding: '10px 20px' }}
        >
          {gameState === GAME_STATES.IDLE ? 'Start Game' : 'Reset'}
        </button>
      </div>

    </div>
  );
};

export default GameTemplate;
