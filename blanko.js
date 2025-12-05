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

// Placeholder components for other routes
const Blanko = () => <div style={{padding: '20px'}}><h1>Blanko Game Page</h1></div>;
const Slido = () => <div style={{padding: '20px'}}><h1>Slido Game Page</h1></div>;
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
