import React, { useState, useEffect, useRef } from 'react';
import { CircularTimer } from './CircularTimer';

export function QuestionsView({ engine, isAdmin }) {
  const { 
    settings = {}, 
    questions = [], 
    gameState = {}, 
    getTeamBuckets, 
    updateTeamScore, 
    sounds, 
    confetti 
  } = engine;

  const buckets = getTeamBuckets ? getTeamBuckets() : [];
  const totalTeams = settings.totalTeams || 4;

  // Track which teams have completed their main question chance
  const [completedMainTeams, setCompletedMainTeams] = useState(() => {
    const saved = localStorage.getItem('antigravity_completed_sheet_teams');
    return saved ? JSON.parse(saved) : {};
  });

  // Quiz Lifecycle State on Questions Page:
  // 'quiz_ready' | 'quiz_running' | 'quiz_submitted' | 'balance_running' | 'balance_summary'
  const [quizStatus, setQuizStatus] = useState('quiz_ready');
  
  // Find first available unfinished team
  const getFirstAvailableTeam = () => {
    for (let i = 0; i < totalTeams; i++) {
      if (!completedMainTeams[i]) return i;
    }
    return 0;
  };

  const [activeSheetTeam, setActiveSheetTeam] = useState(getFirstAvailableTeam());
  const [sheetTimeLeft, setSheetTimeLeft] = useState(settings.totalRoundTime || 120);
  const [sheetAnswers, setSheetAnswers] = useState({}); // { [questionId]: optionIdx }
  const [sheetResults, setSheetResults] = useState(null);

  // Privacy Curtain & Hidability
  const [isPrivacyMaskActive, setIsPrivacyMaskActive] = useState(false);
  const [revealedQuestionIds, setRevealedQuestionIds] = useState({}); // { [qId]: boolean }

  // In-Page Balance / Pass Round State
  const [balanceActiveTeam, setBalanceActiveTeam] = useState(1);
  const [balancePool, setBalancePool] = useState([]); // Remaining unsolved balance questions
  const [balanceQIndex, setBalanceQIndex] = useState(0);
  const [balanceTimeLeft, setBalanceTimeLeft] = useState(settings.balanceQuestionTime || 15);
  const [balanceRoundResults, setBalanceRoundResults] = useState([]);
  const [attemptedBalanceTeams, setAttemptedBalanceTeams] = useState([]);

  const sheetTimerRef = useRef(null);
  const balanceTimerRef = useRef(null);

  // Sync timers with settings
  useEffect(() => {
    if (quizStatus === 'quiz_ready') {
      setSheetTimeLeft(settings.totalRoundTime || 120);
    }
  }, [settings.totalRoundTime, quizStatus]);

  useEffect(() => {
    const handleReset = () => {
      setCompletedMainTeams({});
      setQuizStatus('quiz_ready');
      setActiveSheetTeam(0);
      setSheetAnswers({});
      setSheetResults(null);
      setBalancePool([]);
      setBalanceRoundResults([]);
      localStorage.removeItem('antigravity_completed_sheet_teams');
    };
    window.addEventListener('antigravity_tournament_reset', handleReset);
    return () => window.removeEventListener('antigravity_tournament_reset', handleReset);
  }, []);

  // 1. Timer for Main Sheet Quiz
  useEffect(() => {
    if (quizStatus === 'quiz_running') {
      sheetTimerRef.current = setInterval(() => {
        setSheetTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(sheetTimerRef.current);
            setTimeout(() => {
              handleSubmitSheet();
            }, 50);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sheetTimerRef.current) clearInterval(sheetTimerRef.current);
    }

    return () => {
      if (sheetTimerRef.current) clearInterval(sheetTimerRef.current);
    };
  }, [quizStatus, sheetAnswers]);

  // 2. Timer for In-Page Balance Round
  useEffect(() => {
    if (quizStatus === 'balance_running') {
      balanceTimerRef.current = setInterval(() => {
        setBalanceTimeLeft(prev => {
          if (prev <= 1) {
            if (sounds) sounds.playWrong();
            handleBalanceAnswer(null, 'timeout');
            return settings.balanceQuestionTime || 15;
          }
          if (prev <= 5 && sounds) {
            sounds.playWarning();
          } else if (sounds) {
            sounds.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (balanceTimerRef.current) clearInterval(balanceTimerRef.current);
    }

    return () => {
      if (balanceTimerRef.current) clearInterval(balanceTimerRef.current);
    };
  }, [quizStatus, balanceQIndex, balancePool, balanceActiveTeam, settings.balanceQuestionTime]);

  const currentTeamName = settings.teamNames?.[activeSheetTeam] || `Team ${activeSheetTeam + 1}`;
  const currentTeamColor = settings.teamColors?.[activeSheetTeam] || '#4f46e5';
  const currentBucket = buckets[activeSheetTeam] || [];

  // ==========================================
  // MAIN SHEET ACTIONS
  // ==========================================
  const handleStartLiveQuiz = (teamIdx) => {
    if (completedMainTeams[teamIdx]) {
      alert('This team has already completed its main question set!');
      return;
    }
    setActiveSheetTeam(teamIdx);
    setSheetTimeLeft(settings.totalRoundTime || 120);
    setSheetAnswers({});
    setSheetResults(null);
    setBalancePool([]);
    setBalanceRoundResults([]);
    setAttemptedBalanceTeams([]);
    setRevealedQuestionIds({});
    setQuizStatus('quiz_running');
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (quizStatus !== 'quiz_running') return;
    setSheetAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const toggleQuestionReveal = (qId) => {
    setRevealedQuestionIds(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // GRANT & SUBMIT SHEET
  const handleSubmitSheet = () => {
    if (sheetTimerRef.current) clearInterval(sheetTimerRef.current);

    let correct = 0;
    const missed = [];

    currentBucket.forEach((q) => {
      const selected = sheetAnswers[q.id];
      const isCorrect = selected === q.correctIndex;

      if (isCorrect) {
        correct += 1;
      } else {
        missed.push(q);
      }
    });

    const ptsEarned = correct * (settings.basePoints || 10);
    if (updateTeamScore) updateTeamScore(activeSheetTeam, ptsEarned);

    if (correct > 0) {
      if (sounds) sounds.playVictory();
      if (confetti?.createBurst) confetti.createBurst();
    } else {
      if (sounds) sounds.playWrong();
    }

    // Mark activeSheetTeam as completed in main set
    const updatedCompleted = { ...completedMainTeams, [activeSheetTeam]: true };
    setCompletedMainTeams(updatedCompleted);
    localStorage.setItem('antigravity_completed_sheet_teams', JSON.stringify(updatedCompleted));

    setSheetResults({
      total: currentBucket.length,
      correct,
      missedCount: missed.length,
      points: ptsEarned
    });

    // Populate Balance pool with missed questions for pass questions
    setBalancePool(missed);
    setAttemptedBalanceTeams([activeSheetTeam]);
    
    // Choose next pass recipient (ALL other teams are allowed to answer pass questions!)
    const defaultReboundTeam = (activeSheetTeam + 1) % totalTeams;
    setBalanceActiveTeam(defaultReboundTeam);
    setQuizStatus('quiz_submitted');
  };

  // Start In-Page Balance / Pass Round
  const handleStartBalanceRound = (targetTeamIdx) => {
    if (!balancePool || balancePool.length === 0) {
      alert('All questions were solved! No balance questions to pass.');
      return;
    }
    const team = targetTeamIdx !== undefined ? targetTeamIdx : balanceActiveTeam;
    setBalanceActiveTeam(team);
    setBalanceQIndex(0);
    setBalanceTimeLeft(settings.balanceQuestionTime || 15);
    setBalanceRoundResults([]);
    setQuizStatus('balance_running');
    if (sounds) sounds.playBounce();
  };

  // Submit Answer in In-Page Balance Round
  const handleBalanceAnswer = (optIdx, type) => {
    if (balancePool.length === 0) return;
    const currentQ = balancePool[balanceQIndex];
    if (!currentQ) return;

    const isCorrect = optIdx === currentQ.correctIndex;
    const passPts = settings.passPoints || 5;

    if (isCorrect) {
      if (updateTeamScore) updateTeamScore(balanceActiveTeam, passPts);
      if (sounds) sounds.playCorrect();
      if (confetti?.createBurst) confetti.createBurst();
    } else {
      if (sounds) sounds.playWrong();
    }

    const record = {
      question: currentQ,
      answeringTeam: balanceActiveTeam,
      selectedOption: optIdx,
      outcome: isCorrect ? 'correct' : (type === 'timeout' ? 'timeout' : 'wrong'),
      points: isCorrect ? passPts : 0
    };

    const newResults = [...balanceRoundResults, record];
    setBalanceRoundResults(newResults);

    const nextIdx = balanceQIndex + 1;

    if (nextIdx >= balancePool.length) {
      const correctQIds = new Set(
        newResults.filter(r => r.outcome === 'correct').map(r => r.question.id)
      );
      const remainingUnsolved = balancePool.filter(q => !correctQIds.has(q.id));

      const updatedAttempted = Array.from(
        new Set([...attemptedBalanceTeams, balanceActiveTeam])
      );

      setBalancePool(remainingUnsolved);
      setAttemptedBalanceTeams(updatedAttempted);

      const nextCandidate = (balanceActiveTeam + 1) % totalTeams;
      setBalanceActiveTeam(nextCandidate);

      setQuizStatus('balance_summary');
    } else {
      setBalanceQIndex(nextIdx);
      setBalanceTimeLeft(settings.balanceQuestionTime || 15);
    }
  };

  // Skip Question in Balance Round
  const handleSkipBalanceQuestion = () => {
    if (balancePool.length === 0) return;
    const currentQ = balancePool[balanceQIndex];
    if (!currentQ) return;

    if (sounds?.playClick) sounds.playClick();

    const record = {
      question: currentQ,
      answeringTeam: balanceActiveTeam,
      selectedOption: null,
      outcome: 'skipped',
      points: 0
    };

    const newResults = [...balanceRoundResults, record];
    setBalanceRoundResults(newResults);

    const nextIdx = balanceQIndex + 1;

    if (nextIdx >= balancePool.length) {
      const correctQIds = new Set(
        newResults.filter(r => r.outcome === 'correct').map(r => r.question.id)
      );
      const remainingUnsolved = balancePool.filter(q => !correctQIds.has(q.id));

      const updatedAttempted = Array.from(
        new Set([...attemptedBalanceTeams, balanceActiveTeam])
      );

      setBalancePool(remainingUnsolved);
      setAttemptedBalanceTeams(updatedAttempted);

      const nextCandidate = (balanceActiveTeam + 1) % totalTeams;
      setBalanceActiveTeam(nextCandidate);

      setQuizStatus('balance_summary');
    } else {
      setBalanceQIndex(nextIdx);
      setBalanceTimeLeft(settings.balanceQuestionTime || 15);
    }
  };

  // Move to Next Team's Question Set (Filtering out completed teams!)
  const handleNextTeamSet = () => {
    // Find next uncompleted team
    let nextTeam = null;
    for (let i = 0; i < totalTeams; i++) {
      if (!completedMainTeams[i]) {
        nextTeam = i;
        break;
      }
    }

    if (nextTeam === null) {
      alert('All teams have completed their main question sets!');
      setQuizStatus('quiz_ready');
    } else {
      setActiveSheetTeam(nextTeam);
      setSheetTimeLeft(settings.totalRoundTime || 120);
      setSheetAnswers({});
      setSheetResults(null);
      setBalancePool([]);
      setBalanceRoundResults([]);
      setQuizStatus('quiz_ready');
    }
  };

  const answeredCount = Object.keys(sheetAnswers).length;
  const optLabels = ['A', 'B', 'C', 'D'];

  // Calculate remaining uncompleted teams for main rounds
  const uncompletedTeamIndices = Array.from({ length: totalTeams })
    .map((_, i) => i)
    .filter(i => !completedMainTeams[i]);

  // ==========================================
  // 1. READY STATE: Team Select & Launch
  // ==========================================
  if (quizStatus === 'quiz_ready') {
    const isAllFinished = uncompletedTeamIndices.length === 0;

    return (
      <div className="admin-panel-card" style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>
        <div className="idle-icon">📋</div>
        <h2 className="idle-title" style={{ fontSize: '30px', marginBottom: '8px' }}>
          Team Multi-Question Arena
        </h2>
        <p className="idle-desc" style={{ marginBottom: '28px' }}>
          Select an active team to start their main question set. Once a team completes and submits, they are removed from main selection, but <b>remain eligible to answer pass questions</b>!
        </p>

        {/* Privacy & Hidability Setting */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'var(--bg-subtle)', padding: '8px 18px', borderRadius: 'var(--radius-full)', marginBottom: '24px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800 }}>🔒 Simultaneous Privacy Mask:</span>
          <button 
            className={`btn btn-xs ${isPrivacyMaskActive ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setIsPrivacyMaskActive(prev => !prev)}
          >
            {isPrivacyMaskActive ? '🛡️ Mask Enabled (Hidden)' : '👁️ Mask Disabled (Visible)'}
          </button>
        </div>

        {/* Team Selection Cards (Only uncompleted teams are selectable for main round) */}
        {isAllFinished ? (
          <div style={{ padding: '24px', background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#065f46', margin: '0 0 6px 0' }}>
              All Teams Have Completed Their Main Rounds!
            </h3>
            <p style={{ fontSize: '14px', color: '#047857', margin: 0 }}>
              All {totalTeams} teams have completed their chances. Pass questions and final scoreboard remain fully active.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: '14px', marginBottom: '32px' }}>
            {uncompletedTeamIndices.map((i) => {
              const name = settings.teamNames?.[i] || `Team ${i + 1}`;
              const color = settings.teamColors?.[i] || '#4f46e5';
              const isSelected = activeSheetTeam === i;
              const bCount = buckets[i]?.length || 0;

              return (
                <div
                  key={i}
                  className="radar-node"
                  style={{
                    border: isSelected ? `2.5px solid ${color}` : '1.5px solid var(--border-color)',
                    background: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    padding: '18px 14px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transform: isSelected ? 'translateY(-3px)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setActiveSheetTeam(i)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="radar-team-num" style={{ background: color }}>{i + 1}</span>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>{name}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {bCount} Questions Assigned
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isAllFinished && (
          <button
            className="btn btn-primary btn-lg pulse-glow"
            style={{ padding: '16px 40px', fontSize: '18px', borderRadius: 'var(--radius-full)' }}
            onClick={() => handleStartLiveQuiz(activeSheetTeam)}
          >
            🚀 Start Live Sheet Quiz for {currentTeamName} ({currentBucket.length} Questions)
          </button>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. LIVE RUNNING SHEET VIEW
  // ==========================================
  if (quizStatus === 'quiz_running') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Active Header with Timer & Grant & Submit Button */}
        <div className="radar-section" style={{ borderColor: currentTeamColor, background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', padding: '18px 24px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: currentTeamColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900 }}>
              {activeSheetTeam + 1}
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                {currentTeamName}
              </h3>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Answered <b>{answeredCount}</b> of <b>{currentBucket.length}</b> Questions
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <CircularTimer
              timeLeft={sheetTimeLeft}
              maxTime={settings.totalRoundTime || 120}
              isPlaying={true}
            />

            {/* Grant & Submit Button */}
            <button
              className="btn btn-primary btn-lg pulse-glow"
              onClick={handleSubmitSheet}
              style={{ padding: '12px 28px', fontWeight: 900, borderRadius: '999px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
            >
              🎯 Grant & Submit Sheet Answers
            </button>
          </div>
        </div>

        {/* All Questions Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {currentBucket.map((q, idx) => {
            const selectedOpt = sheetAnswers[q.id];
            const isMasked = isPrivacyMaskActive && !revealedQuestionIds[q.id];

            return (
              <div key={q.id || idx} className="arena-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="q-index-highlight" style={{ background: currentTeamColor, color: '#fff' }}>
                      Question #{idx + 1}
                    </span>
                    <span className="q-category-badge">{q.category || 'General OS'}</span>
                  </div>

                  <div>
                    {selectedOpt !== undefined ? (
                      <span className="badge badge-success" style={{ fontWeight: 800 }}>
                        ✓ Option {optLabels[selectedOpt]} Selected
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#f59e0b' }}>
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Masked vs Revealed Content */}
                {isMasked ? (
                  <div className="privacy-curtain-box" onClick={() => toggleQuestionReveal(q.id)}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔒</div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Question Content Masked for Privacy
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Click to unmask and view Question #{idx + 1}
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="q-sheet-text" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '14px' }}>
                      {q.text}
                    </h3>

                    {/* Options */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedOpt === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`option-card ${isSelected ? 'selected-sheet-opt' : ''}`}
                            style={{
                              padding: '12px 14px',
                              border: isSelected ? `2px solid ${currentTeamColor}` : '1.5px solid var(--border-color)',
                              background: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-card)',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSelectOption(q.id, oIdx)}
                          >
                            <div className="option-prefix" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                              {optLabels[oIdx]}
                            </div>
                            <div className="option-text" style={{ fontSize: '13px' }}>{opt}</div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. SHEET SUBMITTED / RESULTS STAGE
  // ==========================================
  if (quizStatus === 'quiz_submitted') {
    // All other teams (including teams whose main chance is completed!) are allowed to receive pass questions!
    const availablePassTeams = Array.from({ length: totalTeams })
      .map((_, i) => i)
      .filter(i => i !== activeSheetTeam);

    return (
      <div className="admin-panel-card" style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', padding: '36px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '6px' }}>
          {currentTeamName} &bull; Round Submitted!
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Sheet answers scored successfully! {currentTeamName}'s main chance is now complete.
        </p>

        {/* Score Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
          <div className="radar-section" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800 }}>ACCURACY</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#10b981' }}>
              {sheetResults?.correct} / {sheetResults?.total}
            </div>
          </div>

          <div className="radar-section" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800 }}>POINTS EARNED</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: currentTeamColor }}>
              +{sheetResults?.points} pts
            </div>
          </div>

          <div className="radar-section" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800 }}>MISSED PASS POOL</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#ef4444' }}>
              {balancePool.length} Qs
            </div>
          </div>
        </div>

        {/* Next Step Actions: PASS QUESTIONS (All other teams can answer!) */}
        {balancePool.length > 0 ? (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>
              ⚡ Pass {balancePool.length} Missed Questions to Another Team (+{settings.passPoints || 5} pts)
            </h4>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Select which team answers the pass questions. <b>All teams are allowed to answer pass questions!</b>
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              {availablePassTeams.map((pTeamIdx) => {
                const pName = settings.teamNames?.[pTeamIdx] || `Team ${pTeamIdx + 1}`;
                const pColor = settings.teamColors?.[pTeamIdx] || '#4f46e5';

                return (
                  <button
                    key={pTeamIdx}
                    className="btn btn-primary pulse-glow"
                    onClick={() => handleStartBalanceRound(pTeamIdx)}
                    style={{ background: pColor, borderColor: pColor, fontWeight: 900, borderRadius: '999px', padding: '10px 20px' }}
                  >
                    👉 Pass to {pName}
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={handleNextTeamSet}
              style={{ fontWeight: 800 }}
            >
              ⏩ Skip Pass Round & Next Team Set
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-lg pulse-glow"
            onClick={handleNextTeamSet}
            style={{ padding: '14px 36px', fontWeight: 900, borderRadius: '999px' }}
          >
            ⏩ Next Team Question Set
          </button>
        )}
      </div>
    );
  }

  // ==========================================
  // 4. IN-PAGE BALANCE ROUND
  // ==========================================
  if (quizStatus === 'balance_running') {
    const currentQ = balancePool[balanceQIndex];
    if (!currentQ) return null;

    const balanceTeamName = settings.teamNames?.[balanceActiveTeam] || `Team ${balanceActiveTeam + 1}`;
    const balanceColor = settings.teamColors?.[balanceActiveTeam] || '#059669';

    return (
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Balance Round Header */}
        <div className="radar-section" style={{ borderColor: balanceColor, background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="badge badge-success" style={{ fontSize: '13px', padding: '4px 12px' }}>
                🔄 PASS QUESTION ROUND: {balanceTeamName}
              </span>
              <div style={{ fontSize: '13px', color: '#065f46', marginTop: '4px', fontWeight: 700 }}>
                Answer Missed Question for <b>+{settings.passPoints || 5} Bonus Points</b>
              </div>
            </div>
            <CircularTimer
              timeLeft={balanceTimeLeft}
              maxTime={settings.balanceQuestionTime || 15}
              isPlaying={true}
            />
          </div>
        </div>

        {/* Balance Question Card */}
        <div className="arena-card">
          <div className="q-meta-strip">
            <span className="q-index-highlight">Pass Question {balanceQIndex + 1} of {balancePool.length}</span>
            <span className="q-category-badge">{currentQ.category || 'OS'}</span>
            <span className="q-points-badge pass">🌟 +{settings.passPoints || 5} pass pts</span>
          </div>

          <h2 className="q-text" style={{ margin: '18px 0 24px 0' }}>{currentQ.text}</h2>

          {/* Options */}
          <div className="options-grid">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                className="option-card clickable"
                onClick={() => handleBalanceAnswer(i, 'answered')}
              >
                <div className="option-prefix">{optLabels[i]}</div>
                <div className="option-text">{opt}</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Key [{i + 1}]</span>
              </button>
            ))}
          </div>

          <div className="controls-bar" style={{ marginTop: '24px' }}>
            <button className="btn btn-warning" onClick={handleSkipBalanceQuestion}>
              ⏩ Skip (S)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. BALANCE SUMMARY STAGE
  // ==========================================
  if (quizStatus === 'balance_summary') {
    const nextCandidate = (balanceActiveTeam + 1) % totalTeams;
    const canPassFurther = balancePool.length > 0 && attemptedBalanceTeams.length < totalTeams;

    return (
      <div className="admin-panel-card" style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', padding: '36px 24px' }}>
        <div style={{ fontSize: '44px', marginBottom: '8px' }}>🔄</div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
          Pass Round Results
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Remaining Unsolved Pass Questions: <b>{balancePool.length}</b>
        </p>

        {canPassFurther ? (
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg pulse-glow"
              onClick={() => handleStartBalanceRound(nextCandidate)}
            >
              🔄 Pass Further to {settings.teamNames?.[nextCandidate] || `Team ${nextCandidate + 1}`} ({balancePool.length} Qs)
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={handleNextTeamSet}
            >
              ⏩ Advance to Next Team Set
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-lg pulse-glow"
            onClick={handleNextTeamSet}
          >
            ⏩ Next Team Round Set
          </button>
        )}
      </div>
    );
  }

  return null;
}
