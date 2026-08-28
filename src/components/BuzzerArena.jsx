import React, { useState, useEffect } from 'react';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function BuzzerArena({ engine = {}, onViewChange, isAdmin }) {
  const { 
    settings = {}, 
    questions = [], 
    gameState = {}, 
    startBuzzerRound, 
    revealBuzzerAnswer, 
    awardBuzzerPoints, 
    recordBuzzerHit, 
    resetBuzzerCurrentQuestion, 
    nextBuzzerQuestion, 
    lockBuzzerGate, 
    sounds 
  } = engine;

  const teamNames = settings?.teamNames || DEFAULT_TEAM_NAMES;
  const teamColors = settings?.teamColors || DEFAULT_TEAM_COLORS;
  const totalTeams = settings?.totalTeams || 4;

  const buzzer = gameState?.buzzerState || {
    isAuthorized: false,
    currentQIndex: 0,
    questionRevealed: false,
    showAnswer: false,
    buzzerWinner: null,
    buzzLocked: false,
    startTime: 0,
    pointsAwarded: false,
    awardedPoints: 0
  };

  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  const currentQIndex = buzzer.currentQIndex || 0;
  const currentQ = questions[currentQIndex] || questions[0] || {
    text: "Operating Systems Question",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
    category: "General OS"
  };

  // Key mappings for 4 teams: Team 1: '1'/'Q', Team 2: '2'/'W', Team 3: '3'/'E', Team 4: '4'/'R'
  const teamKeys = {
    '1': 0, 'q': 0, 'Q': 0,
    '2': 1, 'w': 1, 'W': 1,
    '3': 2, 'e': 2, 'E': 2,
    '4': 3, 'r': 3, 'R': 3
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (buzzer.isAuthorized && buzzer.questionRevealed && !buzzer.buzzLocked && teamKeys[e.key] !== undefined) {
        const teamIdx = teamKeys[e.key];
        if (teamIdx < totalTeams) {
          handleBuzz(teamIdx);
        }
      }

      // Shortcut 'N' for Next Question only on Admin
      if (isAdmin && buzzer.buzzerWinner && (e.key === 'n' || e.key === 'N')) {
        nextBuzzerQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buzzer.isAuthorized, buzzer.questionRevealed, buzzer.buzzLocked, buzzer.startTime, totalTeams, buzzer.buzzerWinner, isAdmin]);

  const handleAuthorizeAndStart = (e) => {
    if (e) e.preventDefault();
    const cleanKey = accessKeyInput.trim();
    if (cleanKey === '123' || cleanKey === 'admin' || isAdmin) {
      startBuzzerRound(currentQIndex);
      setAuthError('');
    } else {
      setAuthError('❌ Invalid Key! Please enter the correct Admin Authorization Key');
      if (sounds) sounds.playWrong();
    }
  };

  const handleBuzz = (teamIdx) => {
    if (buzzer.buzzLocked || !buzzer.questionRevealed) return;
    const elapsed = ((Date.now() - (buzzer.startTime || Date.now())) / 1000).toFixed(3);
    recordBuzzerHit(teamIdx, elapsed);
  };

  const winnerTeamIdx = buzzer.buzzerWinner?.teamIndex;
  const winnerTeamName = winnerTeamIdx !== undefined ? (teamNames[winnerTeamIdx] || `Team ${winnerTeamIdx + 1}`) : '';
  const winnerTeamColor = winnerTeamIdx !== undefined ? (teamColors[winnerTeamIdx] || '#10b981') : '#10b981';

  // ==========================================
  // 1. PRE-START BUZZER GATE (KEY REQUIRED)
  // ==========================================
  if (!buzzer.isAuthorized) {
    return (
      <div className="admin-panel-card" style={{ maxWidth: '640px', margin: '40px auto', padding: '40px 32px', textAlign: 'center', boxShadow: 'var(--shadow-lg)', border: '2px solid #c7d2fe' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '22px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#fff', fontSize: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)' }}>
          ⚡
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
          Fastest Finger Buzzer Launch Gate
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
          Enter the <b>Quizmaster Master Key</b> to <b>instantly launch the buzzer round and reveal the question</b> simultaneously on all screens via Supabase.
        </p>

        <form onSubmit={handleAuthorizeAndStart} style={{ maxWidth: '380px', margin: '0 auto' }}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '16px' }}>
            <label className="form-label">🔑 Admin Authorization Key</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter Admin Key"
              value={accessKeyInput}
              onChange={(e) => setAccessKeyInput(e.target.value)}
              autoFocus
              required
              style={{ fontSize: '16px', letterSpacing: '2px', textAlign: 'center', padding: '12px' }}
            />
          </div>

          {authError && (
            <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              {authError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg pulse-glow"
              style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800, borderRadius: 'var(--radius-full)' }}
            >
              🚀 Start Buzzer & Reveal Question Now
            </button>

            {isAdmin && (
              <button
                type="button"
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '13px', fontWeight: 700 }}
                onClick={() => startBuzzerRound(currentQIndex)}
              >
                🛡️ Quick Unlock (Active Admin Session)
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => onViewChange('arena')}
            >
              🎮 Return to Main Arena
            </button>
          </div>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--text-muted)' }}>
          🔒 Key entry immediately broadcasts to all projector screens & mobile buzzers in real time.
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHORIZED ACTIVE BUZZER ARENA (REALTIME SYNCED)
  // ==========================================
  return (
    <div className="admin-panel-card" style={{ maxWidth: '1050px', margin: '0 auto', padding: '32px' }}>
      {/* Header Banner */}
      <div className="admin-panel-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900 }}>Fastest Finger Buzzer Arena</div>
            <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
              🟢 Cloud Sync Active &bull; {isAdmin ? '🛡️ Admin Master Control Active' : '📺 Live Audience / Buzzer Device'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Answer Reveal Button ONLY visible to Admin */}
          {isAdmin && (
            <>
              <button 
                className={`btn btn-sm ${buzzer.showAnswer ? 'btn-success' : 'btn-outline'}`}
                onClick={() => revealBuzzerAnswer(!buzzer.showAnswer)}
                title="Toggle correct answer highlight across all connected screens"
              >
                {buzzer.showAnswer ? '✅ Answer Revealed (All Screens)' : '👁️ Reveal Answer (All Screens)'}
              </button>
              <button className="btn btn-primary btn-sm pulse-glow" onClick={nextBuzzerQuestion} title="Broadcast Next Question to all devices">
                ⏩ Next Question
              </button>
              <button className="btn btn-outline btn-sm" onClick={lockBuzzerGate} title="Lock Buzzer Gate">
                🔒 Lock Gate
              </button>
            </>
          )}

          <button className="btn btn-outline btn-sm" onClick={() => onViewChange('arena')}>
            🎮 Arena
          </button>
        </div>
      </div>

      {/* Connection & Next Question Strip */}
      <div className="radar-section" style={{ background: 'linear-gradient(135deg, #eef2ff, #f8fafc)', borderColor: '#c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#fff', padding: '8px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'radial-gradient(circle, #4f46e5 20%, #06b6d4 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '28px' }}>
              📱
            </div>
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--primary)' }}>SCAN TO BUZZ</span>
          </div>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '15px', color: '#1e1b4b', marginBottom: '2px' }}>
              Live Multi-Computer & Phone Buzzer Network
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Keys: <b>[Q / 1]</b>, <b>[W / 2]</b>, <b>[E / 3]</b>, <b>[R / 4]</b> or tap team buzzer pads below.
            </p>
          </div>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {buzzer.buzzLocked && !buzzer.pointsAwarded && (
              <button className="btn btn-outline" onClick={resetBuzzerCurrentQuestion} title="Unlock and re-arm buzzers for this question">
                🔄 Re-arm Buzzers
              </button>
            )}
            <button className="btn btn-primary btn-lg pulse-glow" onClick={nextBuzzerQuestion}>
              ⏩ Next Buzzer Question (All Screens)
            </button>
          </div>
        )}
      </div>

      {/* Buzzer Question Card (Synced in Real Time to All Screens) */}
      <div className="arena-card" style={{ marginTop: '20px' }}>
        <div className="q-meta-strip">
          <span className="q-index-highlight">Buzzer Question #{currentQIndex + 1} of {questions.length}</span>
          <span className="q-category-badge">{currentQ.category || 'General'}</span>
          <span className="q-points-badge base">🎯 +10 pts / -5 penalty</span>
        </div>

        <h2 className="q-text" style={{ margin: '16px 0 24px 0', fontSize: '20px', lineHeight: '1.5' }}>
          {currentQ.text}
        </h2>

        {/* Options Grid (Green Solution illuminates on all screens when Admin reveals!) */}
        <div className="options-grid">
          {currentQ.options.map((opt, i) => {
            const isCorrect = i === currentQ.correctIndex;
            let cardStyle = {
              padding: '14px 16px',
              border: (buzzer.showAnswer && isCorrect) ? '2.5px solid #10b981' : '1.5px solid var(--border-color)',
              background: (buzzer.showAnswer && isCorrect) ? '#ecfdf5' : 'var(--bg-card)',
              boxShadow: (buzzer.showAnswer && isCorrect) ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'var(--shadow-sm)'
            };

            return (
              <div key={i} className="option-card" style={cardStyle}>
                <div className="option-prefix" style={{ background: (buzzer.showAnswer && isCorrect) ? '#10b981' : undefined, color: (buzzer.showAnswer && isCorrect) ? '#fff' : undefined }}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
                <div className="option-text" style={{ fontWeight: (buzzer.showAnswer && isCorrect) ? 800 : 600 }}>
                  {opt}
                </div>
                {buzzer.showAnswer && isCorrect && (
                  <span className="badge badge-success" style={{ background: '#10b981', color: '#fff', fontWeight: 800, padding: '4px 8px' }}>
                    ✓ CORRECT ANSWER
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation Box when Answer Revealed */}
        {buzzer.showAnswer && currentQ.explanation && (
          <div style={{ marginTop: '16px', padding: '12px 18px', background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', border: '1.5px solid #a7f3d0', borderRadius: '12px', fontSize: '13px', color: '#065f46', lineHeight: '1.5' }}>
            <b>💡 Explanation:</b> {currentQ.explanation}
          </div>
        )}

        {/* Live Buzzer Winner Spotlight */}
        {buzzer.buzzerWinner && (
          <div className="radar-section" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderColor: '#10b981', marginTop: '20px', textAlign: 'center', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '40px', marginBottom: '6px' }}>🔔</div>
            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#065f46', marginBottom: '4px' }}>
              {winnerTeamName} BUZZED FIRST!
            </h3>
            <p style={{ fontSize: '15px', color: '#047857', fontWeight: 700, marginBottom: '18px' }}>
              ⚡ Reaction Speed: <b>{buzzer.buzzerWinner.elapsed} seconds</b>
            </p>

            {/* If Admin Computer -> Show Award and Progression Controls */}
            {isAdmin ? (
              !buzzer.pointsAwarded ? (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary btn-lg" 
                    style={{ background: '#10b981', borderColor: '#10b981', padding: '12px 24px', fontWeight: 800 }} 
                    onClick={() => awardBuzzerPoints(true)}
                  >
                    ✅ Award Correct (+10 pts)
                  </button>
                  <button 
                    className="btn btn-danger btn-lg" 
                    style={{ padding: '12px 24px', fontWeight: 800 }}
                    onClick={() => awardBuzzerPoints(false)}
                  >
                    ❌ Award Incorrect (-5 pts)
                  </button>
                  <button 
                    className="btn btn-outline btn-lg" 
                    onClick={resetBuzzerCurrentQuestion}
                  >
                    🔄 Re-arm Buzzers
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: (buzzer.awardedPoints || 0) > 0 ? '#dcfce7' : '#fee2e2', border: (buzzer.awardedPoints || 0) > 0 ? '2px solid #10b981' : '2px solid #ef4444', color: (buzzer.awardedPoints || 0) > 0 ? '#15803d' : '#b91c1c', padding: '10px 28px', borderRadius: '999px', fontWeight: 900, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{(buzzer.awardedPoints || 0) > 0 ? '✅ +10 Points Assigned!' : '❌ -5 Points Penalty Assigned!'}</span>
                    <span style={{ fontSize: '12px', opacity: 0.85, fontWeight: 700 }}>(Score locked &bull; Only 1 credit allowed)</span>
                  </div>

                  <button 
                    className="btn btn-primary btn-lg pulse-glow" 
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', borderColor: 'transparent', padding: '14px 36px', fontSize: '17px', fontWeight: 900, borderRadius: '999px', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)' }}
                    onClick={nextBuzzerQuestion}
                  >
                    ⏩ Next Buzzer Question (All Screens) &rarr;
                  </button>
                </div>
              )
            ) : (
              /* Non-Admin Participant/Audience View */
              <div style={{ padding: '10px', fontSize: '14px', color: '#047857', fontWeight: 700 }}>
                {buzzer.showAnswer ? (
                  <span>✅ Answer illuminated above by Quizmaster</span>
                ) : (
                  <span>⏳ Awaiting Quizmaster decision...</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Team Buzzer Pads (Visible on all devices when nobody has buzzed yet) */}
        {!buzzer.buzzerWinner && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalTeams}, 1fr)`, gap: '12px', marginTop: '20px' }}>
            {Array.from({ length: totalTeams }).map((_, i) => {
              const name = teamNames[i] || `Team ${i + 1}`;
              const color = teamColors[i] || '#4f46e5';

              return (
                <button
                  key={i}
                  className="btn btn-lg pulse-glow"
                  style={{ background: color, borderColor: color, color: '#fff', flexDirection: 'column', padding: '16px 8px' }}
                  onClick={() => handleBuzz(i)}
                >
                  <span style={{ fontSize: '24px' }}>🔔</span>
                  <span style={{ fontWeight: 900, fontSize: '15px' }}>{name}</span>
                  <span style={{ fontSize: '11px', opacity: 0.85 }}>Key [{['Q', 'W', 'E', 'R'][i]}]</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
