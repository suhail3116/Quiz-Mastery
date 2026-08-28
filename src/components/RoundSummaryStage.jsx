import React, { useState } from 'react';

export function RoundSummaryStage({ 
  settings, 
  gameState, 
  onStartBalanceRound, 
  onSkipBalanceRound 
}) {
  const currentTeamIdx = gameState.currentTeamIndex;
  const currentTeamName = settings.teamNames[currentTeamIdx] || `Team ${currentTeamIdx + 1}`;
  const currentColor = settings.teamColors[currentTeamIdx] || '#3b82f6';

  const totalAssigned = gameState.bucketResults.length;
  const correctCount = gameState.bucketResults.filter(r => r.outcome === 'correct').length;
  const missedCount = gameState.balanceQuestions.length;
  const pointsEarned = correctCount * settings.basePoints;

  // Default target team for balance rebound
  const availableTeams = [];
  for (let i = 0; i < settings.totalTeams; i++) {
    if (i !== currentTeamIdx) {
      availableTeams.push({
        index: i,
        name: settings.teamNames[i] || `Team ${i + 1}`,
        color: settings.teamColors[i] || '#3b82f6'
      });
    }
  }

  const [selectedTargetTeam, setSelectedTargetTeam] = useState(
    availableTeams.length > 0 ? availableTeams[0].index : 0
  );

  return (
    <div className="admin-panel-card" style={{ maxWidth: '900px', margin: '0 auto', gap: '24px' }}>
      {/* Header Summary */}
      <div className="idle-stage" style={{ padding: '30px 20px', border: 'none', background: 'transparent' }}>
        <div className="idle-icon">📊</div>
        <h2 className="idle-title" style={{ fontSize: '28px' }}>
          {currentTeamName}'s Round Completed!
        </h2>
        <p className="idle-desc" style={{ marginBottom: '16px' }}>
          Performance breakdown for this round. Answers for unanswered and skipped questions are strictly hidden for the balance round.
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '600px', margin: '0 auto 20px auto' }}>
          <div className="team-score-card" style={{ flexDirection: 'column', padding: '14px', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correct Answers</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#10b981' }}>{correctCount} / {totalAssigned}</div>
          </div>
          <div className="team-score-card" style={{ flexDirection: 'column', padding: '14px', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points Gained</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#fbbf24' }}>+{pointsEarned} pts</div>
          </div>
          <div className="team-score-card" style={{ flexDirection: 'column', padding: '14px', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Balance Questions</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#f87171' }}>{missedCount} Qs</div>
          </div>
        </div>
      </div>

      {/* Admin Balance Questions Assignment Strip */}
      {missedCount > 0 ? (
        <div className="radar-section" style={{ background: 'rgba(31, 41, 55, 0.7)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <div className="radar-title-row">
            <div className="radar-title" style={{ color: '#fbbf24' }}>
              <span>⚡ Admin: Pass {missedCount} Balance Questions to Another Team</span>
            </div>
            <span className="badge badge-warning">Pass Points: +{settings.passPoints} pts per correct</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label className="form-label">Select Target Team to Attempt Balance Pool:</label>
              <select 
                className="form-select" 
                value={selectedTargetTeam}
                onChange={(e) => setSelectedTargetTeam(parseInt(e.target.value, 10))}
              >
                {availableTeams.map(t => (
                  <option key={t.index} value={t.index}>
                    👥 {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <button 
                className="btn btn-primary btn-lg pulse-glow"
                onClick={() => onStartBalanceRound(selectedTargetTeam)}
              >
                🚀 Launch Balance Round
              </button>
              <button 
                className="btn btn-outline"
                onClick={onSkipBalanceRound}
              >
                ⏩ Skip Balance & Next Team
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ color: '#10b981', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>
            🌟 Perfect Round! No balance questions remaining.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onSkipBalanceRound}>
            🚀 Proceed to Next Team's Set
          </button>
        </div>
      )}

      {/* List of Balance Questions (Answers strictly hidden) */}
      {missedCount > 0 && (
        <div>
          <div className="admin-panel-title">
            <span>🔒 Balance Questions in Pool ({missedCount})</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Answers Hidden Until Balance Round</span>
          </div>

          <div className="admin-q-list" style={{ maxHeight: '350px' }}>
            {gameState.balanceQuestions.map((q, idx) => (
              <div key={idx} className="admin-question-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div className="admin-q-header">
                  <div className="admin-q-tags">
                    <span className="badge badge-warning">Balance Q{idx + 1}</span>
                    <span className="badge badge-secondary">{q.category || 'OS'}</span>
                    <span className="badge badge-info">+{settings.passPoints} pts</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>🔒 Answer Hidden</span>
                </div>
                <p className="admin-q-text">{q.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
