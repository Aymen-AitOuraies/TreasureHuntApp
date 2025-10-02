import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage/LoginMain';
import PuzzlesMain from './PuzzlesPage/PuzzlesMain';
import LeaderboardMain from './LeaderboardPage/LeaderboardMain';
function App() {
  return (
    <div className="block lg:hidden">
      {/* <LoginPage /> */}
      {/* <PuzzlesMain /> */}
      <LeaderboardMain />
    </div>
  );
}

export default App;
