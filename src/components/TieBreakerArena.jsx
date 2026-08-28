import React, { useState, useEffect } from 'react';
import { CircularTimer } from './CircularTimer';

export function TieBreakerArena({ engine, tiedTeams, onResolved }) {
  const { settings, questions, updateTeamScore, sounds, confetti } = engine;
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(tiedTeams[0] || 0);

  const currentQ = questions[qIndex] || questions[0];

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (sounds) sounds.playWrong();
            return 0;
          }
          if (prev <= 4 && sounds) sounds.playWarning();
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, timeLeft, sounds]);

  const handleCorrectAnswer = () => {
    if (sounds) sounds.playVictory();
    if (confetti?.createBurst) confetti.createBurst();
    updateTeamScore(selectedTeam, 10);
    alert(`🎉 ${settings.teamNames[selectedTeam] || 'Team ' + (selectedTeam + 1)} scores the winning sudden death point!`);
    onResolved();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '780px', padding: '32px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>⚔️</span>
            <div>
              <h2 className="modal-title" style={{ color: '#e11d48' }}>SUDDEN DEATH TIE-BREAKER</h2>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                10-Second Rapid Fire Question to determine the tournament champion
              </div>
            </div>
          </div>
        </div>

        <div className="arena-card" style={{ marginTop: '16px' }}>
          <div className="q-stage-row">
            <div className="q-text-box">
              <span className="q-category-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>
                ⚔️ Sudden Death Question
              </span>
              <h3 className="q-text">{currentQ.text}</h3>
            </div>
            <CircularTimer timeLeft={timeLeft} maxTime={10} isPlaying={!isPaused && timeLeft > 0} />
          </div>

          {/* Options */}
          <div className="options-grid">
            {currentQ.options.map((opt, i) => (
              <div key={i} className="option-card" style={{ cursor: 'default' }}>
                <div className="option-prefix">{['A', 'B', 'C', 'D'][i]}</div>
                <div className="option-text">{opt}</div>
              </div>
            ))}
          </div>

          {/* Adjudication */}
          <div style={{ marginTop: '20px', background: 'var(--bg-subtle)', padding: '16px', borderRadius: '12px' }}>
            <label className="form-label">Select Answering Team:</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select className="form-select" value={selectedTeam} onChange={e => setSelectedTeam(parseInt(e.target.value, 10))}>
                {tiedTeams.map(t => (
                  <option key={t} value={t}>
                    👥 {settings.teamNames[t] || `Team ${t + 1}`}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleCorrectAnswer}>
                ✅ Award Win Point (+10 pts)
              </button>
              <button className="btn btn-outline" onClick={() => {
                setQIndex(prev => prev + 1);
                setTimeLeft(10);
              }}>
                ⏩ Next Tie Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
