import React from 'react';
import { CircularTimer } from './CircularTimer';

export function BalanceRoundStage({ 
  settings, 
  gameState, 
  onSubmitAnswer, 
  onSkipQuestion 
}) {
  const targetTeamIdx = gameState.balanceTargetTeam;
  const targetTeamName = settings.teamNames[targetTeamIdx] || `Team ${targetTeamIdx + 1}`;
  const targetColor = settings.teamColors[targetTeamIdx] || '#d97706';

  const qIndex = gameState.balanceQIndex;
  const totalBalanceQs = gameState.balanceQuestions.length;
  const currentQ = gameState.balanceQuestions[qIndex];

  if (!currentQ) return null;

  const optLabels = ['A', 'B', 'C', 'D'];

  return (
    <div>
      {/* Rebound Header */}
      <div className="radar-section" style={{ background: 'linear-gradient(135deg, #fef3c7, #fffbeb)', borderColor: '#f59e0b', boxShadow: '0 4px 16px rgba(245, 158, 11, 0.15)' }}>
        <div className="radar-title-row">
          <div className="radar-title" style={{ color: '#92400e', fontSize: '17px' }}>
            <span>⚡ Antigravity Balance Rebound: {targetTeamName}</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#b45309', background: '#ffffff', padding: '4px 12px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)' }}>
            ⏱️ {gameState.balanceTimeLeft}s remaining
          </div>
        </div>
        <div style={{ fontSize: '14px', color: '#78350f', marginTop: '4px' }}>
          <b>{targetTeamName}</b> is answering the balance questions for <b>+{settings.passPoints} Pass Points</b> each.
        </div>
      </div>

      {/* Main Balance Question Card */}
      <div className="arena-card">
        <div className="q-meta-strip">
          <div className="q-counter-group">
            <span className="q-index-highlight" style={{ color: '#d97706' }}>Balance Question {qIndex + 1}</span>
            <span className="q-total-label">of {totalBalanceQs}</span>
          </div>
          <div className="q-category-badge">{currentQ.category || 'Operating Systems'}</div>
          <div className="q-points-badge bounced">
            ⚡ +{settings.passPoints} pts (Bonus Pass)
          </div>
        </div>

        <div className="q-stage-row">
          <div className="q-text-box">
            <h2 className="q-text">{currentQ.text}</h2>
          </div>
          {/* Balance Question Countdown Timer */}
          <CircularTimer
            timeLeft={gameState.balanceTimeLeft}
            maxTime={settings.balanceQuestionTime}
            isPlaying={gameState.roundPhase === 'balance_pass' && !gameState.isPaused}
          />
        </div>

        {/* Options Grid with Tactile Badges */}
        <div className="options-grid">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              className="option-card clickable"
              onClick={() => onSubmitAnswer(idx)}
            >
              <div className="option-prefix">{optLabels[idx]}</div>
              <div className="option-text">{opt}</div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                Key [{idx + 1}]
              </span>
            </button>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="controls-bar">
          <button className="btn btn-warning btn-lg pulse-glow" onClick={onSkipQuestion}>
            ⏩ Skip Question (S)
          </button>
        </div>
      </div>
    </div>
  );
}
