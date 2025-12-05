import React, { useState, useEffect, useCallback } from 'react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';

// --- CSS Styles ---
const styles = `
  body {
    margin: 0;
    font-family: sans-serif;
  }

  /* Header Styles */
  .header {
    height: 80px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #eeeeee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 1000;
  }

  .logo {
    width: 50px;
    height: 50px;
    margin: 15px;
    background-color: #333;
    border-radius: 50%;
  }

  .nav {
    margin-right: 20px;
    display: flex;
    gap: 15px;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .nav a {
    text-decoration: none;
    color: #333;
  }

  /* Responsive Navigation Text Logic */
  .nav-text-desktop {
    display: inline;
  }
  .nav-text-mobile {
    display: none;
  }

  @media (max-width: 800px) {
    .nav-text-desktop {
      display: none;
    }
    .nav-text-mobile {
      display: inline;
    }
  }

  /* Footer Styles */
  .footer {
    height: 50px;
    width: 100%;
    background-color: #999999;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  /* Main Body Layout */
  .main-body {
    padding-top: 80px; 
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  /* Dashboard Specific Styles */
  .dashboard-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .dash-line-1 {
    color: red;
    font-size: 2em;
    margin-bottom: 20px;
  }

  .dash-line-2 {
    font-size: 1.5em;
  }

  .reset-btn {
    margin-left: 10px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.8em;
  }

  /* Slido Game Styles */
  .slido-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    outline: none;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 150px);
    grid-template-rows: repeat(3, 150px);
    border: 1px solid #333; 
    background-color: #333;
    gap: 0;
    margin: 0; /* Requirement: 0px margin */
    margin-bottom: 20px; /* Spacing for buttons */
  }

  .grid-cell {
    width: 150px;
    height: 150px;
    background-color: #fff;
    border: 1px solid #333;
    box-sizing: border-box;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
  }

  .grid-cell.empty {
    background-color: white;
    cursor: default;
    border: 0; /* Optional: Remove border for empty cell if desired, but standard grid usually keeps it */
    border: 1px solid #333; /* Keeping border for consistency */
  }
  
  .tile-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0f0e0; 
    color: #2c5e2c;
    font-weight: bold;
    font-size: 0.8em; /* Adjust for text */
  }

  .controls {
    display: flex;
    width: 450px; /* Match grid width */
    justify-content: space-between;
  }

  .control-btn {
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
  }
`;

// --- Components ---

const Header = () => {
  return (
    <header className="header">
      <img 
        src="https://api.iconify.design/game-icons:game-console.svg" 
        alt="Logo" 
        className="logo" 
      />
      <nav className="nav">
        <Link to="/">
            <span className="nav-text-desktop">Home</span>
            <span className="nav-text-mobile">H</span>
        </Link>
        <span> | </span>
        <Link to="/blanko">
            <span className="nav-text-desktop">Blanko</span>
            <span className="nav-text-mobile">B</span>
        </Link>
        <span> | </span>
        <Link to="/slido">
            <span className="nav-text-desktop">Slido</span>
            <span className="nav-text-mobile">S</span>
        </Link>
        <span> | </span>
        <Link to="/tetro">
            <span className="nav-text-desktop">Tetro</span>
            <span className="nav-text-mobile">T</span>
        </Link>
      </nav>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      UNSW COMP6080 Footer
    </footer>
  );
};

const Dashboard = () => {
  const [gamesWon, setGamesWon] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDefaultScore = async () => {
    try {
      const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json');
      const data = await response.json();
      return data.score;
    } catch (error) {
      console.error("Failed to fetch info:", error);
      return 0;
    }
  };

  useEffect(() => {
    const initData = async () => {
      const storedScore = localStorage.getItem('gamesWon');
      if (storedScore !== null) {
        setGamesWon(parseInt(storedScore, 10));
        setLoading(false);
      } else {
        const initialScore = await fetchDefaultScore();
        setGamesWon(initialScore);
        localStorage.setItem('gamesWon', initialScore.toString());
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleReset = async () => {
    setLoading(true);
    const resetScore = await fetchDefaultScore();
    setGamesWon(resetScore);
    localStorage.setItem('gamesWon', resetScore.toString());
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <div className="dash-line-1">
        Please choose an option from the navbar
      </div>
      <div className="dash-line-2">
        {loading ? (
          <span>Loading score...</span>
        ) : (
          <>
            Games won: {gamesWon} 
            <button className="reset-btn" onClick={handleReset}>
              (reset)
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- Slido Game Logic ---

const SOLVED_STATE = [1, 2, 3, 4, 5, 6, 7, 8, null];

const Slido = () => {
  const [board, setBoard] = useState([...SOLVED_STATE]);
  const [hasMoved, setHasMoved] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

  // Check if puzzle is solvable (standard inversion count for 8-puzzle)
  const isSolvable = (arr) => {
    const flatten = arr.filter(x => x !== null);
    let inversions = 0;
    for (let i = 0; i < flatten.length; i++) {
      for (let j = i + 1; j < flatten.length; j++) {
        if (flatten[i] > flatten[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  };

  const shuffleBoard = () => {
    let newBoard;
    do {
      newBoard = [1, 2, 3, 4, 5, 6, 7, 8, null];
      for (let i = newBoard.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]];
      }
    } while (!isSolvable(newBoard) || JSON.stringify(newBoard) === JSON.stringify(SOLVED_STATE));
    
    setBoard(newBoard);
    setHasMoved(false);
    setIsGameWon(false);
  };

  useEffect(() => {
    shuffleBoard();
  }, []);

  const handleWin = () => {
    // Alert and update score after a brief delay to allow UI to render last move
    setTimeout(() => {
      alert("Correct!");
      const currentWins = parseInt(localStorage.getItem('gamesWon') || '0', 10);
      localStorage.setItem('gamesWon', (currentWins + 1).toString());
      shuffleBoard();
    }, 50);
  };

  const moveTile = useCallback((index) => {
    setBoard(prevBoard => {
      const blankIndex = prevBoard.indexOf(null);
      const emptyRow = Math.floor(blankIndex / 3);
      const emptyCol = blankIndex % 3;
      const targetRow = Math.floor(index / 3);
      const targetCol = index % 3;

      const isAdjacent = (
        (Math.abs(emptyRow - targetRow) === 1 && emptyCol === targetCol) ||
        (Math.abs(emptyCol - targetCol) === 1 && emptyRow === targetRow)
      );

      if (isAdjacent) {
        const newBoard = [...prevBoard];
        newBoard[blankIndex] = newBoard[index];
        newBoard[index] = null;
        
        setHasMoved(true);
        
        if (JSON.stringify(newBoard) === JSON.stringify(SOLVED_STATE)) {
            setIsGameWon(true);
            handleWin();
        }
        return newBoard;
      }
      return prevBoard;
    });
  }, []);

  const handleContainerClick = (e) => {
      e.currentTarget.focus();
  };
  
  const handleSolve = () => {
    setBoard([...SOLVED_STATE]);
    setIsGameWon(true);
    // Note: Solve button only visualizes win, does not trigger win tally score increment
  };

  return (
    <div 
        className="slido-container" 
        tabIndex="0" 
        onClick={handleContainerClick}
        onKeyDown={(e) => {
             if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                setBoard(prevBoard => {
                    if (JSON.stringify(prevBoard) === JSON.stringify(SOLVED_STATE)) return prevBoard;
                    
                    const blankIndex = prevBoard.indexOf(null);
                    const emptyRow = Math.floor(blankIndex / 3);
                    const emptyCol = blankIndex % 3;
                    let targetIndex = -1;

                    // Requirement: "Clicking the 'down' key... result in the shrek cell immediately ABOVE the blank moving DOWN"
                    if (e.key === 'ArrowDown') { if (emptyRow > 0) targetIndex = blankIndex - 3; }
                    else if (e.key === 'ArrowUp') { if (emptyRow < 2) targetIndex = blankIndex + 3; }
                    else if (e.key === 'ArrowRight') { if (emptyCol > 0) targetIndex = blankIndex - 1; }
                    else if (e.key === 'ArrowLeft') { if (emptyCol < 2) targetIndex = blankIndex + 1; }

                    if (targetIndex !== -1) {
                        const newBoard = [...prevBoard];
                        newBoard[blankIndex] = newBoard[targetIndex];
                        newBoard[targetIndex] = null;
                        setHasMoved(true);
                        
                        if (JSON.stringify(newBoard) === JSON.stringify(SOLVED_STATE)) {
                            setIsGameWon(true);
                            handleWin();
                        }
                        return newBoard;
                    }
                    return prevBoard;
                });
            }
        }}
    >
      <div className="grid-container">
        {board.map((tile, index) => (
          <div 
            key={index} 
            className={`grid-cell ${tile === null ? 'empty' : ''}`}
            onClick={() => tile !== null && moveTile(index)}
          >
            {tile !== null && (
                <div className="tile-content">
                    Shrek {tile}
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="controls">
        <button 
            className="control-btn" 
            onClick={handleSolve} 
            disabled={isGameWon} 
            style={{ float: 'left' }}
        >
            Solve
        </button>
        <button 
            className="control-btn" 
            onClick={shuffleBoard}
            disabled={!hasMoved && !isGameWon} 
             style={{ float: 'right' }}
        >
            Reset
        </button>
      </div>
    </div>
  );
};

// Placeholder components for other routes
const Blanko = () => <div style={{padding: '20px'}}><h1>Blanko Game Page</h1></div>;
const Tetro = () => <div style={{padding: '20px'}}><h1>Tetro Game Page</h1></div>;

// --- Main App Component ---

const App = () => {
  return (
    <MemoryRouter>
      <style>{styles}</style>
      <Header />
      <main className="main-body">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blanko" element={<Blanko />} />
          <Route path="/slido" element={<Slido />} />
          <Route path="/tetro" element={<Tetro />} />
        </Routes>
      </main>
      <Footer />
    </MemoryRouter>
  );
};

export default App;
