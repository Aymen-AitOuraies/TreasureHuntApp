import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage/LoginMain';
import PuzzlesMain from './PuzzlesPage/PuzzlesMain';
import LeaderboardMain from './LeaderboardPage/LeaderboardMain';
import StoreMain from './StorePage/StoreMain';

function App() {
  const [currentPage, setCurrentPage] = useState('puzzle');

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'puzzle':
        return <PuzzlesMain onNavigate={setCurrentPage} />;
      case 'leaderboard':
        return <LeaderboardMain onNavigate={setCurrentPage} />;
      case 'store':
        return <StoreMain onNavigate={setCurrentPage} />;
      default:
        return <PuzzlesMain onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="block lg:hidden">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
