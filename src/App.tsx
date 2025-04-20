import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Components
import LoadingScreen from './components/ui/LoadingScreen';
import Layout from './components/layout/Layout';

// Pages
const Home = lazy(() => import('./pages/Home'));
const ModeSelection = lazy(() => import('./pages/ModeSelection'));
const TeamSetup = lazy(() => import('./pages/TeamSetup'));
const GameSetup = lazy(() => import('./pages/GameSetup'));
const CoinToss = lazy(() => import('./pages/CoinToss'));
const PlayerSelection = lazy(() => import('./pages/PlayerSelection'));
const ScoringScreen = lazy(() => import('./pages/ScoringScreen'));
const Scorecard = lazy(() => import('./pages/Scorecard'));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mode-selection" element={<ModeSelection />} />
          <Route path="/team-setup" element={<TeamSetup />} />
          <Route path="/game-setup" element={<GameSetup />} />
          <Route path="/coin-toss" element={<CoinToss />} />
          <Route path="/player-selection" element={<PlayerSelection />} />
          <Route path="/scoring" element={<ScoringScreen />} />
          <Route path="/scorecard" element={<Scorecard />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;