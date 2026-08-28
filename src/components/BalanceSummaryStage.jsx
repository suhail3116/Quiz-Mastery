import React, { useState } from 'react';

export function BalanceSummaryStage({ 
  settings, 
  gameState, 
  onStartBalanceRound, 
  onNextTeamRound 
}) {
  const targetTeamIdx = gameState.balanceTargetTeam;
  const targetTeamName = settings.teamNames[targetTeamIdx] || `Team ${targetTeamIdx + 1}`;
  
  // All balance attempts in this tournament session
  const allBalanceResults = gameState.balanceResults || [];
  const recentTeamResults = allBalanceResults.filter(r => r.answeringTeam === targetTeamIdx);
  
  // Correct questions in this specific attempt
  const solvedInThisAttempt = recentTeamResults.filter(r => r.outcome === 'correct');
  const missedInThisAttempt = recentTeamResults.filter(r => r.outcome !== 'correct');
  
  const correctCount = solvedInThisAttempt.length;
  const attemptedCount = recentTeamResults.length;
  const pointsEarned = correctCount * settings.passPoints;

  // Remaining questions in the balance pool (all answered questions have been removed)
  const remainingBalanceQuestions = gameState.balanceQuestions || [];
  const remainingCount = remainingBalanceQuestions.length;
  const allSolved = remainingCount === 0;

  const nextMainTeamIdx = gameState.currentTeamIndex + 1;
  const nextMainTeamName = settings.teamNames[nextMainTeamIdx] || `Team ${nextMainTeamIdx + 1}`;
  const isFinalTournamentRound = nextMainTeamIdx >= settings.totalTeams;

  // Eligible teams for next bounce
  const mainPlayingTeam = gameState.currentTeamIndex;
  const attemptedTeams = gameState.attemptedBalanceTeams || [targetTeamIdx];
  
  const eligibleTeams = [];
  for (let i = 0; i < settings.totalTeams; i++) {
    if (i !== mainPlayingTeam) {
      eligibleTeams.push({
        index: i,
        name: settings.teamNames[i] || `Team ${i + 1}`,
        color: settings.teamColors[i] || '#3b82f6',
        alreadyAttempted: attemptedTeams.includes(i)
      });
    }
  }

  const defaultNextTeam = eligibleTeams.find(t => !t.alreadyAttempted)?.index ?? eligibleTeams[0]?.index ?? 0;
  const [selectedNextTeam, setSelectedNextTeam] = useState(defaultNextTeam);

  return (
    <div className="admin-panel-card" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '32px' }}>
      
      {/* Performance Header */}
      <div className="idle-icon">{allSolved ? '🎉' : '⚡'}</div>
      <h2 className="idle-title" style={{ fontSize: '28px', marginBottom: '8px' }}>
        {targetTeamName}'s Balance Round Results
      </h2>
      <p className="idle-desc" style={{ marginBottom: '24px' }}>
        <b>{targetTeamName}</b> answered <b>{correctCount} / {attemptedCount}</b> questions correctly (+{pointsEarned} pts).
      </p>

      {/* CASE 1: All questions were answered and removed! */}
      {allSolved ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#34d399', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
            🌟 ALL BALANCE QUESTIONS ANSWERED & REMOVED!
          </h3>
          <p style={{ color: 'var(--text-main)', fontSize: '15px', marginBottom: '18px' }}>
            All balance questions have been resolved and removed from the pool. Ready to launch the next team's question set!
          </p>
          <button className="btn btn-primary btn-lg pulse-glow" onClick={onNextTeamRound}>
            {isFinalTournamentRound 
              ? '🏆 View Final Tournament Leaderboard' 
              : `🚀 Start ${nextMainTeamName}'s Question Set`}
          </button>
        </div>
      ) : (
        /* CASE 2: Answered questions are removed, but some still remain missed! */
        <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <div>
              <h3 style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 800 }}>
                ⚠️ {remainingCount} Balance Question{remainingCount > 1 ? 's' : ''} Remaining (Answered Questions Removed)
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {correctCount > 0 && <span>✅ {correctCount} question{correctCount > 1 ? 's were' : ' was'} solved and removed. </span>}
                Answers for remaining {remainingCount} questions remain hidden. Admin can pass them to another team.
              </div>
            </div>
            <span className="badge badge-warning">+{settings.passPoints} pts available</span>
          </div>

          {/* Admin selector for passing remaining questions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '16px' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label className="form-label">Pass Remaining {remainingCount} Question{remainingCount > 1 ? 's' : ''} to Team:</label>
              <select
                className="form-select"
                value={selectedNextTeam}
                onChange={(e) => setSelectedNextTeam(parseInt(e.target.value, 10))}
              >
                {eligibleTeams.map(t => (
                  <option key={t.index} value={t.index}>
                    👥 {t.name} {t.alreadyAttempted ? '(Already Attempted)' : '⭐ (Fresh)'}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <button
                className="btn btn-warning btn-lg pulse-glow"
                onClick={() => onStartBalanceRound(selectedNextTeam)}
              >
                🎯 Pass to {settings.teamNames[selectedNextTeam] || `Team ${selectedNextTeam + 1}`}
              </button>
              <button
                className="btn btn-outline"
                onClick={onNextTeamRound}
              >
                {isFinalTournamentRound 
                  ? '🏆 End & View Leaderboard' 
                  : `⏩ Move to ${nextMainTeamName}'s Set`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Answered and Removed Questions Section */}
      {solvedInThisAttempt.length > 0 && (
        <div style={{ textAlign: 'left', marginTop: '24px', marginBottom: '20px' }}>
          <div className="admin-panel-title">
            <span style={{ color: '#34d399' }}>✅ Solved & Removed Questions ({solvedInThisAttempt.length})</span>
            <span className="badge badge-success">+{solvedInThisAttempt.length * settings.passPoints} pts awarded</span>
          </div>
          <div className="admin-q-list" style={{ maxHeight: '200px' }}>
            {solvedInThisAttempt.map((res, idx) => (
              <div key={idx} className="admin-question-card" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="admin-q-header">
                  <span className="badge badge-success">Solved by {targetTeamName}</span>
                  <span className="badge badge-secondary">{res.question.category || 'OS'}</span>
                </div>
                <p className="admin-q-text">{res.question.text}</p>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '13px' }}>
                  ✅ Correct: {res.question.options[res.question.correctIndex]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Unsolved Questions Section (Answers Hidden) */}
      {!allSolved && (
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <div className="admin-panel-title">
            <span style={{ color: '#fbbf24' }}>🔒 Remaining Unsolved Questions in Pool ({remainingCount})</span>
            <span style={{ fontSize: '12px', color: '#fbbf24' }}>Answers Strictly Hidden</span>
          </div>
          <div className="admin-q-list" style={{ maxHeight: '220px' }}>
            {remainingBalanceQuestions.map((q, idx) => (
              <div key={idx} className="admin-question-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div className="admin-q-header">
                  <span className="badge badge-warning">Remaining Q{idx + 1}</span>
                  <span className="badge badge-secondary">{q.category || 'OS'}</span>
                  <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>🔒 Hidden</span>
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
