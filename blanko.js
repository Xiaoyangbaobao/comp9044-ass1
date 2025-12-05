import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// --- CSS Styles (Injected for Single File Simplicity) ---
const styles = `
  body {
    margin: 0; /* Requirement: Margin of 0 */
    font-family: sans-serif;
  }

  /* Header Styles */
  .header {
    height: 80px; /* Requirement: 80px high */
    width: 100%; /* Requirement: Full width of viewport */
    position: fixed; /* Requirement: Fixed position */
    top: 0;
    left: 0;
    background-color: #eeeeee; /* Requirement: #eeeeee */
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 1000;
  }

  .logo {
    width: 50px; /* Requirement: 50px x 50px */
    height: 50px;
    margin: 15px; /* Requirement: Margin of 15px on all sides */
    background-color: #333; /* Placeholder for logo image */
    border-radius: 50%;
  }

  .nav {
    margin-right: 20px; /* Aligned on the right hand side */
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

  /* Requirement: For viewport widths less than or equal to 800px */
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
    height: 50px; /* Requirement: Height of 50px */
    width: 100%; /* Requirement: Full width of viewport */
    background-color: #999999; /* Requirement: #999999 */
    /* Requirement: Not fixed to bottom of viewport, but bottom of document */
    /* This is default block behavior, sitting below content */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  /* Main Body Layout */
  .main-body {
    /* Requirement: Occupy full space not used by header/footer */
    /* Padding top 80px to account for fixed header */
    padding-top: 80px; 
    min-height: calc(100vh - 50px); /* Ensures footer pushes to bottom if content is short */
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  /* Dashboard Specific Styles */
  .dashboard-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center; /* Centre aligned vertically */
    align-items: center; /* Centre aligned horizontally */
    text-align: center;
  }

  .dash-line-1 {
    color: red; /* Requirement: Colour red */
    font-size: 2em; /* Requirement: Font size 2em */
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
`;

// --- Components ---

const Header = () => {
  return (
    <header className="header">
      {/* Logo Section */}
      <img 
        src="https://api.iconify.design/game-icons:game-console.svg" 
        alt="Logo" 
        className="logo" 
      />

      {/* Navigation Section */}
      <nav className="nav">
        {/* Using simple spans and CSS media queries to swap text is more robust/performant than JS window listeners */}
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

  // Helper function to fetch default data
  const fetchDefaultScore = async () => {
    try {
      const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json');
      const data = await response.json();
      // Expecting format: {"score":5}
      return data.score;
    } catch (error) {
      console.error("Failed to fetch info:", error);
      return 0; // Fallback
    }
  };

  useEffect(() => {
    const initData = async () => {
      // 1. Check LocalStorage
      const storedScore = localStorage.getItem('gamesWon');

      if (storedScore !== null) {
        // If exists, use it
        setGamesWon(parseInt(storedScore, 10));
        setLoading(false);
      } else {
        // 2. If empty, fetch from URL
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
    // Requirement: When reset is pressed... set to value returned when fetching URL
    const resetScore = await fetchDefaultScore();
    setGamesWon(resetScore);
    localStorage.setItem('gamesWon', resetScore.toString());
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      {/* Line 1 */}
      <div className="dash-line-1">
        Please choose an option from the navbar
      </div>
      
      {/* Line 2 */}
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

// Placeholder components for other routesconst Blanko = () => {
  const [currentString, setCurrentString] = useState("");
  const [missingIndices, setMissingIndices] = useState([]);
  const [inputs, setInputs] = useState({});

  // Initialize Game
  const initGame = useCallback(() => {
    // Pick random string
    const randomStr = BLANKO_STRINGS[Math.floor(Math.random() * BLANKO_STRINGS.length)];
    setCurrentString(randomStr);

    // Pick 3 random indices that are NOT spaces
    const indices = [];
    const validIndices = [];
    for (let i = 0; i < randomStr.length; i++) {
        if (randomStr[i] !== ' ') validIndices.push(i);
    }

    while (indices.length < 3) {
        const randIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
        if (!indices.includes(randIndex)) {
            indices.push(randIndex);
        }
    }
    setMissingIndices(indices);
    setInputs({});
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleInputChange = (index, value) => {
    // Only allow single char
    if (value.length > 1) return;

    const newInputs = { ...inputs, [index]: value };
    setInputs(newInputs);

    // Check if we have 3 inputs
    if (Object.keys(newInputs).length === 3) {
        // Check correctness
        let correct = true;
        for (const idx of missingIndices) {
            // Case sensitive check? Prompt says "entered values are correct", usually implies exact match or case-insensitive.
            // Let's assume Case Insensitive for better UX, or Exact if strict.
            // Given "strings defined below" usually implies exact values. I'll do exact.
            if (!newInputs[idx] || newInputs[idx] !== currentString[idx]) {
                correct = false;
                break;
            }
        }

        if (correct) {
            setTimeout(() => {
                alert("Correct!");
                const currentWins = parseInt(localStorage.getItem('gamesWon') || '0', 10);
                localStorage.setItem('gamesWon', (currentWins + 1).toString());
                initGame();
            }, 50);
        }
    }
  };

  return (
    <div className="blanko-container">
        <div className="blanko-row">
            {/* Generate 12 boxes. If string is shorter, we pad? Prompt says "7 strings defined below" and "display 12 square containers". 
                I assumed strings are 12 chars. If string is somehow null (initial render), display placeholders. */}
            {Array.from({ length: 12 }).map((_, i) => {
                const char = currentString[i] || "";
                const isMissing = missingIndices.includes(i);

                return (
                    <div key={i} className="blanko-box">
                        {isMissing ? (
                            <input 
                                className="blanko-input"
                                value={inputs[i] || ""}
                                onChange={(e) => handleInputChange(i, e.target.value)}
                                maxLength={1}
                            />
                        ) : (
                            char
                        )}
                    </div>
                );
            })}
        </div>
        <button className="blanko-reset-btn" onClick={initGame}>
            Reset Game
        </button>
    </div>
  );
};
const Slido = () => {
  const [board, setBoard] = useState([...SOLVED_STATE]);
  const [hasMoved, setHasMoved] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);

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
const Tetro = () => <div style={{padding: '20px'}}><h1>Tetro Game Page</h1></div>;

// --- Main App Component ---

const App = () => {
  return (
    <BrowserRouter>
      {/* Inject CSS */}
      <style>{styles}</style>
      
      <Header />
      
      {/* Main Body */}
      <main className="main-body">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blanko" element={<Blanko />} />
          <Route path="/slido" element={<Slido />} />
          <Route path="/tetro" element={<Tetro />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
