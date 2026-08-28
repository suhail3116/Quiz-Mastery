import React, { useRef, useState, useEffect } from 'react';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function Header({ settings = {}, gameState = {}, userRole = 'projector', currentView, onViewChange, onOpenTheater }) {
  const teamNames = settings?.teamNames || DEFAULT_TEAM_NAMES;
  const teamColors = settings?.teamColors || DEFAULT_TEAM_COLORS;
  const scores = gameState?.scores || [0, 0, 0, 0];
  const count = settings?.totalTeams || teamNames.length || 4;

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [count, scores]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -180 : 180;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const getRoleLabel = () => {
    const roleStr = String(userRole || 'projector');
    if (roleStr === 'admin') return { label: '🛡️ Quizmaster', cls: 'role-admin' };
    if (roleStr.startsWith('team')) {
      const idx = parseInt(roleStr.replace('team', ''), 10) - 1;
      const tName = teamNames[idx] || `Team ${idx + 1}`;
      return { label: `👥 ${tName}`, cls: 'role-team' };
    }
    return { label: '📺 Arena Projector', cls: 'role-projector' };
  };

  const role = getRoleLabel();

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-section" onClick={() => onViewChange('arena')}>
          <div className="brand-logo">🚀</div>
          <div>
            <h1 className="brand-title">Dait Quiz Mastery</h1>
            <div className="brand-subtitle">Dhaanish Ahmed Institute of Technology Coimbatore</div>
          </div>
        </div>

        {/* Live Scoreboard Carousel Strip */}
        <div className="scoreboard-carousel-wrapper">
          <button 
            className={`scoreboard-nav-arrow ${canScrollLeft ? 'visible' : 'hidden'}`}
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            ◀
          </button>

          <div 
            className="scoreboard-strip" 
            ref={scrollRef}
            onScroll={checkScroll}
          >
            {Array.from({ length: count }).map((_, i) => {
              const name = teamNames[i] || `Team ${i + 1}`;
              const color = teamColors[i] || '#4f46e5';
              const score = scores[i] || 0;
              const isActive = (gameState?.roundPhase === 'team_round' && gameState?.currentTeamIndex === i) ||
                               (gameState?.roundPhase === 'balance_pass' && gameState?.balanceTargetTeam === i);

              return (
                <div 
                  key={i} 
                  className={`team-score-card ${isActive ? 'active-turn' : ''}`}
                  style={{ '--team-color': color }}
                >
                  <div className="team-avatar" style={{ background: color }}>
                    {i + 1}
                  </div>
                  <div className="team-info">
                    <div className="team-name" title={name}>{name}</div>
                    <div className="team-points">{score} <span className="pts-label">pts</span></div>
                  </div>
                  {isActive && <div className="turn-pulse-indicator"></div>}
                </div>
              );
            })}
          </div>

          <button 
            className={`scoreboard-nav-arrow ${canScrollRight ? 'visible' : 'hidden'}`}
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            ▶
          </button>
        </div>

        {/* Nav Tabs & Action Badges */}
        <div className="header-actions">
          {/* Big-Screen Theater Mode Button */}
          <button 
            className="btn btn-sm btn-outline"
            onClick={onOpenTheater}
            title="Launch Fullscreen Big-Screen Theater Mode"
            style={{ borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#ffffff', borderColor: '#4338ca' }}
          >
            📺 Theater Mode
          </button>

          <span className={`role-badge ${role.cls}`}>{role.label}</span>
          
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${currentView === 'teams' ? 'active' : ''}`}
              onClick={() => onViewChange('teams')}
            >
              👥 Teams
            </button>
            <button 
              className={`nav-tab ${currentView === 'arena' ? 'active' : ''}`}
              onClick={() => onViewChange('arena')}
            >
              🎮 Arena
            </button>
            <button 
              className={`nav-tab ${currentView === 'buzzer' ? 'active' : ''}`}
              onClick={() => onViewChange('buzzer')}
            >
              ⚡ Buzzer
            </button>
            <button 
              className={`nav-tab ${currentView === 'questions' ? 'active' : ''}`}
              onClick={() => onViewChange('questions')}
            >
              📚 Questions
            </button>
            <button 
              className={`nav-tab ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => onViewChange('admin')}
              title={userRole === 'admin' ? 'Admin Controls (Active on this computer)' : 'Admin Login (Enter password to access)'}
            >
              {userRole === 'admin' ? '⚙️ Admin (Active)' : '🔒 Admin Login'}
            </button>
            <button 
              className={`nav-tab ${currentView === 'leaderboard' ? 'active' : ''}`}
              onClick={() => onViewChange('leaderboard')}
            >
              🏆 Scores
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
