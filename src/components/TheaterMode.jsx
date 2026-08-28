import React, { useEffect } from 'react';
import { CircularTimer } from './CircularTimer';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function TheaterMode({ engine = {}, onClose }) {
  const { 
    settings = {}, 
    gameState = {}, 
    getCurrentQuestion, 
    getCurrentTeamBucket,
    submitTeamAnswer,
    submitBalanceAnswer,
    skipTeamQuestion,
    skipBalanceQuestion,
    pauseQuiz,
    resumeQuiz,
    adjustQuestionTime,
    adjustTotalTime
  } = engine;

  const teamNames = settings?.teamNames || DEFAULT_TEAM_NAMES;
  const teamColors = settings?.teamColors || DEFAULT_TEAM_COLORS;
  const currentTeamIdx = gameState?.currentTeamIndex || 0;
  const currentTeamName = teamNames[currentTeamIdx] || `Team ${currentTeamIdx + 1}`;
  const currentTeamColor = teamColors[currentTeamIdx] || '#4f46e5';

  const currentQ = getCurrentQuestion ? getCurrentQuestion() : null;
  const bucket = getCurrentTeamBucket ? getCurrentTeamBucket() : [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        handleOptionClick(optIdx);
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState?.isPaused) {
          if (resumeQuiz) resumeQuiz();
        } else {
          if (pauseQuiz) pauseQuiz();
        }
      }

      if (e.key === 's' || e.key === 'S') {
        if (gameState?.roundPhase === 'team_round' && skipTeamQuestion) {
          skipTeamQuestion();
        } else if (gameState?.roundPhase === 'balance_pass' && skipBalanceQuestion) {
          skipBalanceQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, gameState?.roundPhase, gameState?.isPaused]);

  const handleOptionClick = (idx) => {
    if (gameState?.isPaused) return;
    if (gameState?.roundPhase === 'team_round' && submitTeamAnswer) {
      submitTeamAnswer(idx);
    } else if (gameState?.roundPhase === 'balance_pass' && submitBalanceAnswer) {
      submitBalanceAnswer(idx);
    }
  };

  if (!currentQ) {
    return (
      <div className="theater-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px' }}>No Active Question</h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '24px' }}>
            Start a tournament round from the main arena to view in Theater Mode.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onClose}>
            ✕ Exit Theater Mode (ESC)
          </button>
        </div>
      </div>
    );
  }

  const totalRoundMax = settings?.totalRoundTime || 120;
  const totalPercent = Math.max(0, Math.min(100, ((gameState?.totalTimeLeft || 0) / totalRoundMax) * 100));

  return (
    <div className="theater-overlay">
      {/* Top Floating Theater Bar */}
      <div className="theater-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="brand-logo" style={{ fontSize: '28px' }}>🚀</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', letterSpacing: '1px' }}>
              ANTIGRAVITY THEATER
            </div>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
              ✦ Dhaanish Ahmed Institute of Technology, Coimbatore ✦
            </div>
          </div>
        </div>

        {/* Live Scores Carousel Strip */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {Array.from({ length: settings?.totalTeams || 4 }).map((_, i) => {
            const name = teamNames[i] || `Team ${i + 1}`;
            const color = teamColors[i] || '#3b82f6';
            const score = gameState?.scores?.[i] || 0;
            const isActive = gameState?.currentTeamIndex === i;

            return (
              <div 
                key={i} 
                className="theater-score-pill"
                style={{ 
                  borderColor: isActive ? color : 'rgba(255,255,255,0.15)', 
                  background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(15, 23, 42, 0.65)',
                  boxShadow: isActive ? `0 0 16px ${color}88` : 'none',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span className="team-avatar" style={{ background: color, width: '22px', height: '22px', fontSize: '11px', fontWeight: 900 }}>
                  {i + 1}
                </span>
                <span style={{ fontWeight: 800, fontSize: '13px', color: '#fff' }}>{name}</span>
                <span style={{ color: '#f59e0b', fontWeight: 900, fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                  {score} pts
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn btn-outline btn-sm" onClick={onClose} style={{ background: '#fff', color: '#0f172a', fontWeight: 800 }}>
            ✕ Exit (ESC)
          </button>
        </div>
      </div>

      {/* Main Giant Question Arena */}
      <div className="theater-body">
        <div className="theater-card" style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '36px' }}>
          
          {/* Question Metadata Strip */}
          <div className="q-meta-strip" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="radar-team-num" style={{ background: currentTeamColor, width: '32px', height: '32px', fontSize: '16px' }}>
                {currentTeamIdx + 1}
              </span>
              <span className="q-index-highlight" style={{ fontSize: '22px', color: currentTeamColor }}>
                {currentTeamName} &bull; Question {(gameState?.currentBucketQIndex || 0) + 1} of {bucket.length || 1}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="q-category-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                {currentQ.category || 'General'}
              </span>
              <span className="q-points-badge base" style={{ fontSize: '14px', padding: '6px 12px' }}>
                🎯 +{currentQ.points || settings?.basePoints || 10} pts
              </span>
            </div>
          </div>

          {/* Question Text & Giant Circular Clock */}
          <div className="q-stage-row" style={{ margin: '20px 0 32px 0', alignItems: 'center', gap: '28px' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(22px, 3.2vw, 34px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.35 }}>
                {currentQ.text}
              </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <CircularTimer
                timeLeft={gameState?.questionTimeLeft !== undefined ? gameState.questionTimeLeft : (settings?.questionTime || 20)}
                maxTime={settings?.questionTime || 20}
                isPlaying={gameState?.roundPhase === 'team_round' && !gameState?.isPaused}
              />
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>QUESTION TIME</span>
            </div>
          </div>

          {/* Interactive Giant Options Grid */}
          <div className="options-grid" style={{ gap: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                className="option-card clickable pulse-glow"
                onClick={() => handleOptionClick(i)}
                style={{
                  padding: '20px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div 
                  className="option-prefix" 
                  style={{ 
                    width: '46px', 
                    height: '46px', 
                    fontSize: '20px', 
                    fontWeight: 900,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {['A', 'B', 'C', 'D'][i]}
                </div>
                <div className="option-text" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', flex: 1 }}>
                  {opt}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '4px 8px', borderRadius: '6px' }}>
                  Key [{i + 1}]
                </span>
              </button>
            ))}
          </div>

          {/* Theater Quick Action Bar */}
          <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {gameState?.isPaused ? (
                <button className="btn btn-primary" onClick={resumeQuiz}>▶️ Resume (Space)</button>
              ) : (
                <button className="btn btn-outline" onClick={pauseQuiz}>⏸️ Pause (Space)</button>
              )}
              <button className="btn btn-warning" onClick={skipTeamQuestion}>
                ⏩ Skip Question (S)
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)' }}>
                ⏳ Overall Round Clock: <b style={{ color: currentTeamColor, fontFamily: 'var(--font-mono)' }}>{gameState?.totalTimeLeft || 0}s</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
