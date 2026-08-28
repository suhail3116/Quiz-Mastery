import React, { useState } from 'react';
import { CertificateModal } from './CertificateModal';
import { TieBreakerArena } from './TieBreakerArena';

export function VictoryPodium({ settings, gameState, onReset, onViewLeaderboard, engine, isAdmin }) {
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [tieBreakerOpen, setTieBreakerOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);

  const count = settings.totalTeams || 4;
  const teams = Array.from({ length: count }).map((_, i) => ({
    index: i,
    name: settings.teamNames[i] || `Team ${i + 1}`,
    color: settings.teamColors[i] || '#3b82f6',
    score: gameState.scores[i] || 0
  })).sort((a, b) => b.score - a.score);

  const winner = teams[0];
  const runnerUp = teams[1];
  const third = teams[2];

  // Check if tie exists between top 2
  const hasTie = teams.length > 1 && teams[0].score === teams[1].score;
  const tiedTeamIndices = teams.filter(t => t.score === teams[0].score).map(t => t.index);

  const handleOpenCertificate = (team, rank) => {
    setSelectedWinner({ team: team.name, score: team.score, rank });
    setCertModalOpen(true);
  };

  return (
    <div className="complete-stage">
      <div className="complete-icon">🏆</div>
      <h2 className="complete-title">TOURNAMENT CHAMPIONSHIP RESULTS</h2>
      <p className="complete-desc">
        Congratulations to all participating teams! The final scores have been recorded.
      </p>

      {/* Tie Alert */}
      {hasTie && (
        <div className="radar-section" style={{ background: 'linear-gradient(135deg, #fee2e2, #fff1f2)', borderColor: '#ef4444', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>⚔️</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 900, color: '#991b1b', fontSize: '16px' }}>Tie Detected for 1st Place!</div>
                <div style={{ fontSize: '12px', color: '#7f1d1d' }}>Multiple teams finished with equal points ({teams[0].score} pts).</div>
              </div>
            </div>
            <button className="btn btn-danger btn-lg pulse-glow" onClick={() => setTieBreakerOpen(true)}>
              ⚔️ Launch Sudden Death Tie-Breaker
            </button>
          </div>
        </div>
      )}

      {/* 3D Visual Podium */}
      <div className="podium-wrapper">
        {/* 2nd Place */}
        {runnerUp && (
          <div className="podium-step step-2">
            <div className="podium-team">{runnerUp.name}</div>
            <div className="podium-score">{runnerUp.score} pts</div>
            <div className="podium-pillar" style={{ background: runnerUp.color }}>2</div>
            <button 
              className="btn btn-xs btn-outline" 
              style={{ marginTop: '8px' }}
              onClick={() => handleOpenCertificate(runnerUp, 2)}
            >
              📜 Certificate
            </button>
          </div>
        )}

        {/* 1st Place Champion */}
        {winner && (
          <div className="podium-step step-1">
            <div style={{ fontSize: '28px', marginBottom: '-4px' }}>👑</div>
            <div className="podium-team" style={{ fontSize: '17px', fontWeight: 900 }}>{winner.name}</div>
            <div className="podium-score" style={{ fontSize: '16px' }}>{winner.score} pts</div>
            <div className="podium-pillar" style={{ background: winner.color }}>1</div>
            <button 
              className="btn btn-sm btn-primary pulse-glow" 
              style={{ marginTop: '8px' }}
              onClick={() => handleOpenCertificate(winner, 1)}
            >
              📜 1st Place Certificate
            </button>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="podium-step step-3">
            <div className="podium-team">{third.name}</div>
            <div className="podium-score">{third.score} pts</div>
            <div className="podium-pillar" style={{ background: third.color }}>3</div>
            <button 
              className="btn btn-xs btn-outline" 
              style={{ marginTop: '8px' }}
              onClick={() => handleOpenCertificate(third, 3)}
            >
              📜 Certificate
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="controls-bar" style={{ marginTop: '36px' }}>
        <button className="btn btn-primary btn-lg" onClick={() => handleOpenCertificate(winner, 1)}>
          🎓 Print Champion Certificate
        </button>
        <button className="btn btn-outline btn-lg" onClick={onViewLeaderboard}>
          📊 Full Scoreboard & Analytics
        </button>
        {isAdmin && (
          <button className="btn btn-danger btn-lg" onClick={() => {
            if (confirm('Reset tournament scores and launch fresh championship?')) onReset();
          }}>
            🔄 Reset Tournament
          </button>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedWinner && (
        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          winnerTeam={selectedWinner.team}
          rank={selectedWinner.rank}
          score={selectedWinner.score}
          totalTeams={count}
          settings={settings}
        />
      )}

      {/* Tie Breaker Modal */}
      {tieBreakerOpen && engine && (
        <TieBreakerArena
          engine={engine}
          tiedTeams={tiedTeamIndices}
          onResolved={() => setTieBreakerOpen(false)}
        />
      )}
    </div>
  );
}
