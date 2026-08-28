import React, { useState, useEffect } from 'react';
import { useAntigravityEngine } from './hooks/useAntigravityEngine';
import { useSoundEngine } from './hooks/useSoundEngine';
import { useConfetti } from './hooks/useConfetti';
import { Header } from './components/Header';
import { ArenaView } from './components/ArenaView';
import { TeamsEditView } from './components/TeamsEditView';
import { QuestionsView } from './components/QuestionsView';
import { BuzzerArena } from './components/BuzzerArena';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { LeaderboardView } from './components/LeaderboardView';
import { RoleModal } from './components/RoleModal';
import { TheaterMode } from './components/TheaterMode';
import { ErrorBoundary } from './components/ErrorBoundary';
import { IntroSplash } from './components/IntroSplash';

export default function App() {
  const sounds = useSoundEngine();
  const confetti = useConfetti();
  const engine = useAntigravityEngine(sounds, confetti);

  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('arena'); // 'arena' | 'buzzer' | 'questions' | 'admin' | 'leaderboard' | 'login'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('antigravity_admin_auth_v1') === 'true';
  });
  const [theaterOpen, setTheaterOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      // Spacebar: Pause/Resume Quiz
      if (e.code === 'Space') {
        e.preventDefault();
        if (engine.gameState.isPaused) {
          engine.resumeQuiz();
        } else {
          engine.pauseQuiz();
        }
      }

      // Key 'S' or 's': Skip Question in Arena
      if (e.key === 's' || e.key === 'S') {
        if (engine.gameState.roundPhase === 'team_round') {
          engine.skipTeamQuestion();
        } else if (engine.gameState.roundPhase === 'balance_pass') {
          engine.skipBalanceQuestion();
        }
      }

      // Number keys 1, 2, 3, 4: Select options
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (engine.gameState.roundPhase === 'team_round') {
          engine.submitTeamAnswer(optIdx);
        } else if (engine.gameState.roundPhase === 'balance_pass') {
          engine.submitBalanceAnswer(optIdx);
        }
      }

      // Key 'T' or 't': Toggle Fullscreen Theater Mode
      if (e.key === 't' || e.key === 'T') {
        setTheaterOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [engine]);

  const handleAdminLoginSuccess = () => {
    localStorage.setItem('antigravity_admin_auth_v1', 'true');
    setIsAdminAuthenticated(true);
    engine.updateRole('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('antigravity_admin_auth_v1');
    setIsAdminAuthenticated(false);
    engine.updateRole('projector');
    setCurrentView('arena');
  };

  return (
    <ErrorBoundary>
      {/* Cinematic Intro Splash Screen */}
      {showSplash && (
        <IntroSplash onFinish={() => setShowSplash(false)} />
      )}

      <div className="app-container">
        {/* Canvas Confetti */}
        <canvas id="confettiCanvas" ref={confetti.canvasRef}></canvas>

        {/* Header */}
        <Header
          settings={engine.settings}
          gameState={engine.gameState}
          userRole={engine.userRole}
          currentView={currentView}
          onViewChange={setCurrentView}
          onOpenTheater={() => setTheaterOpen(true)}
        />

        {/* Main View Area */}
        <main className="app-main">
                    {currentView === 'teams' && (
            <TeamsEditView engine={engine} />
          )}
          {currentView === 'arena' && (
            <ArenaView engine={engine} onViewChange={setCurrentView} isAdmin={isAdminAuthenticated} />
          )}
          {currentView === 'buzzer' && (
            <BuzzerArena engine={engine} onViewChange={setCurrentView} isAdmin={isAdminAuthenticated} />
          )}
          {currentView === 'questions' && (
            <QuestionsView engine={engine} isAdmin={isAdminAuthenticated} />
          )}
          {currentView === 'admin' && (
            isAdminAuthenticated ? (
              <AdminPanel engine={engine} onLogout={handleAdminLogout} onNavigateToTeams={() => setCurrentView('teams')} />
            ) : (
              <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
            )
          )}
          {currentView === 'leaderboard' && (
            <LeaderboardView settings={engine.settings} gameState={engine.gameState} />
          )}
          {currentView === 'login' && (
            <RoleModal onSelectRole={(role) => {
              engine.updateRole(role);
              if (role === 'admin' && !isAdminAuthenticated) {
                setCurrentView('admin');
              } else {
                setCurrentView('arena');
              }
            }} />
          )}
        </main>

        {/* Big-Screen Theater Mode Overlay */}
        {theaterOpen && (
          <TheaterMode
            settings={engine.settings}
            gameState={engine.gameState}
            onClose={() => setTheaterOpen(false)}
            engine={engine}
          />
        )}

        {/* Permanent Bottom-Corner Developer Credit */}
        <footer 
          style={{
            position: 'fixed',
            bottom: '12px',
            right: '16px',
            zIndex: 9999,
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--text-muted)',
            background: 'rgba(255, 255, 255, 0.92)',
            padding: '5px 12px',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none'
          }}
        >
          <span style={{ color: '#4f46e5' }}>⚡</span>
          <span>Created by <b style={{ color: '#4f46e5' }}>Suhail</b> (CSE III Year)</span>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
