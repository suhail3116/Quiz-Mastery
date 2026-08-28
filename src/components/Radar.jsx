import React from 'react';

export function Radar({ settings, gameState }) {
  const totalTeams = settings.totalTeams || 4;

  return (
    <div className="radar-section">
      <div className="radar-title-row">
        <div className="radar-title">
          <span>🌀 Antigravity Trajectory Path</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Question passes sequentially if unanswered
        </div>
      </div>
      <div className="radar-strip">
        {Array.from({ length: totalTeams }).map((_, i) => {
          const name = settings.teamNames[i] || `Team ${i + 1}`;
          const color = settings.teamColors[i] || '#3b82f6';
          const isStart = gameState.startingTeamIndex === i;
          const isActive = gameState.activeTeamIndex === i;
          const hasAttempted = gameState.attemptedTeams.includes(i);
          const isMissed = hasAttempted && !isActive;

          let statusBadge = null;
          let cardClass = 'radar-node';

          if (isActive) {
            cardClass += ' active-turn';
            statusBadge = <span className="radar-status on-clock">ON CLOCK ⚡</span>;
          } else if (isMissed) {
            cardClass += ' missed';
            statusBadge = <span className="radar-status missed">MISSED ❌</span>;
          } else {
            cardClass += ' waiting';
            statusBadge = <span className="radar-status waiting">WAITING ⏳</span>;
          }

          return (
            <React.Fragment key={i}>
              <div className={cardClass} style={{ '--node-color': color }}>
                <div className="radar-node-header">
                  <span className="radar-team-num" style={{ background: color }}>{i + 1}</span>
                  <span className="radar-team-name">{name}</span>
                  {isStart && <span className="radar-start-badge" title="Original Starting Team">👑 Start</span>}
                </div>
                {statusBadge}
              </div>
              {i < totalTeams - 1 && (
                <div className={`radar-arrow ${hasAttempted ? 'bounce-active' : ''}`}>➔</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
