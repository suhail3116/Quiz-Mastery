import React, { useState, useEffect } from 'react';
import { CircularTimer } from './CircularTimer';
import { VictoryPodium } from './VictoryPodium';
import { CodeSnippetView } from './CodeSnippetView';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function ArenaView({ engine = {}, onViewChange, isAdmin }) {
  const { 
    settings = {}, 
    questions = [],
    gameState = {}, 
    getTeamBuckets, 
    claimLeagueTeam,
    unclaimLeagueTeam,
    startSimultaneousLeague,
    submitSimultaneousAnswer,
    skipSimultaneousQuestion,
    resetSimultaneousLeague,
    resetQuiz,
    sounds
  } = engine;

  const teamNames = settings?.teamNames || DEFAULT_TEAM_NAMES;
  const teamColors = settings?.teamColors || DEFAULT_TEAM_COLORS;
  const totalTeams = settings?.totalTeams || 4;
  const scores = gameState?.scores || [0, 0, 0, 0];

  const league = gameState?.leagueState || {
    isRoundStarted: false,
    claimedTeams: {},
    teamProgress: []
  };

  const claimedTeams = league.claimedTeams || {};
  const isLeagueRunning = gameState?.roundPhase === 'simultaneous_league' || league.isRoundStarted;

  // Local storage for device's claimed single team (Strictly locked to this system)
  const [myTeamIndex, setMyTeamIndex] = useState(() => {
    const saved = localStorage.getItem('antigravity_my_team_index') || localStorage.getItem('antigravity_claimed_team');
    return saved !== null && saved !== undefined ? parseInt(saved, 10) : null;
  });

  // Admin view toggle: 'my_team' | 'matrix'
  const [adminViewMode, setAdminViewMode] = useState(isAdmin ? 'matrix' : 'my_team');
  const [selectedOptFeedback, setSelectedOptFeedback] = useState(null); // { optIdx, isCorrect }

  // Independent rock-solid countdown timer for this team's screen
  const qTimeSetting = settings?.questionTime || 20;
  const roundTimeSetting = settings?.totalRoundTime || 120;
  
  const [questionSeconds, setQuestionSeconds] = useState(qTimeSetting);
  const [roundSeconds, setRoundSeconds] = useState(roundTimeSetting);

  // All question buckets partitioned per team
  const rawBuckets = getTeamBuckets ? getTeamBuckets() : [];
  const buckets = Array.from({ length: totalTeams }, (_, i) => {
    if (rawBuckets[i] && rawBuckets[i].length > 0) return rawBuckets[i];
    const perTeam = Math.max(1, Math.floor(questions.length / totalTeams));
    return questions.slice(i * perTeam, (i + 1) * perTeam);
  });

  const myProg = (myTeamIndex !== null && league.teamProgress?.[myTeamIndex]) ? league.teamProgress[myTeamIndex] : { currentQIndex: 0, completed: false, correctCount: 0 };
  const currentQIndex = myProg?.currentQIndex || 0;

  // Reset question timer immediately whenever a new question starts!
  useEffect(() => {
    setQuestionSeconds(qTimeSetting);
  }, [currentQIndex, myTeamIndex, qTimeSetting]);

  // Re-arm round seconds if reset or starting
  useEffect(() => {
    if (roundSeconds <= 0) {
      setRoundSeconds(roundTimeSetting);
    }
  }, [roundTimeSetting, myTeamIndex]);

  // Continuous timer countdown effect for active team
  useEffect(() => {
    if (myTeamIndex === null || myProg?.completed) return;

    const timer = setInterval(() => {
      setQuestionSeconds((prevQ) => {
        if (prevQ <= 1) {
          // Question Timeout: auto-skip to next question
          if (sounds?.playWrong) sounds.playWrong();
          if (skipSimultaneousQuestion) skipSimultaneousQuestion(myTeamIndex);
          return qTimeSetting;
        }

        if (sounds) {
          if (prevQ <= 5) sounds.playWarning?.();
          else sounds.playTick?.();
        }

        return prevQ - 1;
      });

      setRoundSeconds((prevR) => {
        if (prevR <= 1) return 0;
        return prevR - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [myTeamIndex, currentQIndex, myProg?.completed, qTimeSetting, sounds, skipSimultaneousQuestion]);

  // Single-Team Claim handler (Locks this device to 1 team)
  const handleSelectTeam = (teamIdx) => {
    // Prevent claiming if already completed
    if (league.teamProgress?.[teamIdx]?.completed) return;

    setMyTeamIndex(teamIdx);
    localStorage.setItem('antigravity_my_team_index', teamIdx.toString());
    setQuestionSeconds(qTimeSetting);
    setRoundSeconds(roundTimeSetting);
    if (claimLeagueTeam) {
      claimLeagueTeam(teamIdx, teamNames[teamIdx]);
    }
  };

  // Switch team handler (ONLY allowed for Admin)
  const handleAdminSwitchTeam = () => {
    if (myTeamIndex !== null && unclaimLeagueTeam) {
      unclaimLeagueTeam(myTeamIndex);
    }
    setMyTeamIndex(null);
    localStorage.removeItem('antigravity_my_team_index');
  };

  // Submit simultaneous answer with quick flash
  const handleSimultaneousSubmit = (optIdx, correctIdx) => {
    if (myTeamIndex === null || selectedOptFeedback !== null) return;
    const isCorrect = optIdx === correctIdx;
    setSelectedOptFeedback({ optIdx, isCorrect });

    setTimeout(() => {
      if (submitSimultaneousAnswer) {
        submitSimultaneousAnswer(myTeamIndex, optIdx, isCorrect);
      }
      setSelectedOptFeedback(null);
      setQuestionSeconds(qTimeSetting);
    }, 450);
  };

  // Skip simultaneous question
  const handleSimultaneousSkip = () => {
    if (myTeamIndex === null) return;
    if (skipSimultaneousQuestion) {
      skipSimultaneousQuestion(myTeamIndex);
    }
    setSelectedOptFeedback(null);
    setQuestionSeconds(qTimeSetting);
  };

  // ==========================================
  // 1. STAGE: VICTORY PODIUM (Round Completed)
  // ==========================================
  if (gameState?.roundPhase === 'completed') {
    return (
      <VictoryPodium
        settings={settings}
        gameState={gameState}
        onReset={resetSimultaneousLeague || resetQuiz}
        isAdmin={isAdmin}
      />
    );
  }

  // ==========================================
  // 2. STAGE: TEAM SELECTION HUB (Single Team Selection)
  // ==========================================
  if (myTeamIndex === null) {
    return (
      <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Cyber League Header */}
        <div className="radar-section" style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', color: '#fff', padding: '28px 32px', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#fff', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' }}>
            🏆
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px', color: '#fff' }}>
            Select Your Single League Team
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 18px auto', lineHeight: '1.6' }}>
            Each computer is allowed to select <b>only one team</b>. Once selected, this system is locked to that team for the tournament!
          </p>

          {/* Active Timing Indicators */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span className="badge badge-info" style={{ background: 'rgba(79, 70, 229, 0.25)', border: '1px solid #6366f1', color: '#c7d2fe', padding: '6px 14px', fontSize: '13px', fontWeight: 800 }}>
              ⏱️ Per-Question Clock: {qTimeSetting}s
            </span>
            <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', color: '#a7f3d0', padding: '6px 14px', fontSize: '13px', fontWeight: 800 }}>
              ⏳ Total Round Clock: {roundTimeSetting}s
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAdmin && (
              <>
                <button
                  className="btn btn-primary btn-lg pulse-glow"
                  onClick={startSimultaneousLeague}
                  style={{ padding: '14px 36px', fontSize: '16px', fontWeight: 900, borderRadius: '999px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)' }}
                >
                  🚀 Launch Simultaneous 4-Team Battle
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  onClick={() => setAdminViewMode('matrix')}
                  style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1', fontWeight: 800 }}
                >
                  📊 Oversee 4-Team Matrix
                </button>
              </>
            )}
          </div>
        </div>

        {/* Team Selection Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`, gap: '18px' }}>
          {Array.from({ length: totalTeams }).map((_, i) => {
            const name = teamNames[i] || `Team ${i + 1}`;
            const color = teamColors[i] || '#4f46e5';
            const isClaimedByOther = claimedTeams[i] !== undefined;
            const teamProg = league.teamProgress?.[i];
            const isFinished = teamProg?.completed === true;

            return (
              <div
                key={i}
                className="admin-panel-card"
                style={{
                  border: isFinished ? '2px solid #ef4444' : `2px solid ${color}`,
                  background: isFinished ? '#fef2f220' : 'var(--bg-card)',
                  borderRadius: '20px',
                  padding: '28px 20px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: isFinished ? 0.7 : (isClaimedByOther ? 0.6 : 1),
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: isFinished ? '#ef4444' : color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 900, margin: '0 auto 16px auto', boxShadow: `0 6px 18px ${color}40` }}>
                  {isFinished ? '⛔' : i + 1}
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px', color: 'var(--text-main)' }}>
                  {name}
                </h3>
                
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  {buckets[i]?.length || 16} Questions &bull; Score: <b>{scores[i] || 0} pts</b>
                </div>

                {/* If team finished -> HIDE selection button and show 'Your chance is finished' */}
                {isFinished ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#fee2e2', border: '1.5px solid #ef4444', color: '#b91c1c', padding: '10px 14px', borderRadius: '999px', fontWeight: 900, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <span>⛔</span>
                      <span>Your chance is finished</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                      Final: {scores[i] || 0} pts recorded
                    </span>
                  </div>
                ) : isClaimedByOther ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#f1f5f9', color: '#64748b', padding: '8px 16px', borderRadius: '999px', fontWeight: 800, fontSize: '12px', border: '1px solid #cbd5e1' }}>
                      🔒 Claimed on System {i + 1}
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary btn-lg pulse-glow"
                    onClick={() => handleSelectTeam(i)}
                    style={{ width: '100%', background: color, borderColor: color, fontWeight: 900, borderRadius: '999px' }}
                  >
                    👉 Select {name}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. STAGE: ADMIN OVERVIEW MATRIX (Admin Privilege Only)
  // ==========================================
  if (isAdmin && adminViewMode === 'matrix') {
    return (
      <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="radar-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', color: '#fff', padding: '20px 28px', borderRadius: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff' }}>
              ⚔️ Live 4-Team Simultaneous Battle Matrix
            </h2>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Round Clock: <b>{roundSeconds}s remaining</b> &bull; Question Timer: <b>{questionSeconds}s</b>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => setAdminViewMode('my_team')}
              style={{ fontWeight: 800 }}
            >
              🎮 Enter Team Quiz View ({teamNames[myTeamIndex] || 'Team 1'})
            </button>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={handleAdminSwitchTeam}
              style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1', fontWeight: 800 }}
            >
              🔄 Reset My Team Selection
            </button>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={resetSimultaneousLeague}
              style={{ fontWeight: 800 }}
            >
              🛑 Reset League
            </button>
          </div>
        </div>

        {/* 4 Team Live Progress Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${totalTeams}, 1fr)`, gap: '16px' }}>
          {Array.from({ length: totalTeams }).map((_, i) => {
            const name = teamNames[i] || `Team ${i + 1}`;
            const color = teamColors[i] || '#4f46e5';
            const score = scores[i] || 0;
            const myBucket = buckets[i] || [];
            const prog = league.teamProgress?.[i] || { currentQIndex: 0, completed: false, correctCount: 0 };
            const pct = myBucket.length > 0 ? Math.min(100, Math.round((prog.currentQIndex / myBucket.length) * 100)) : 0;
            const isFinished = prog.completed === true;

            return (
              <div 
                key={i} 
                className="admin-panel-card" 
                style={{ 
                  border: isFinished ? '2px solid #ef4444' : `2px solid ${color}`, 
                  padding: '24px', 
                  borderRadius: '20px', 
                  textAlign: 'center',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: isFinished ? '#ef4444' : color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, margin: '0 auto 12px auto' }}>
                  {isFinished ? '🏁' : i + 1}
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '6px' }}>{name}</h4>
                <div style={{ fontSize: '28px', fontWeight: 900, color: color, fontFamily: 'var(--font-mono)', margin: '10px 0' }}>
                  {score} pts
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 700 }}>
                  Progress: Q {prog.currentQIndex} / {myBucket.length} ({pct}%)
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: isFinished ? '#10b981' : color, transition: 'width 0.4s ease' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                  {isFinished ? (
                    <span className="badge badge-danger" style={{ fontWeight: 900, padding: '6px 12px' }}>
                      ⛔ CHANCE FINISHED
                    </span>
                  ) : i === myTeamIndex ? (
                    <>
                      <span className="badge badge-success" style={{ fontWeight: 800, padding: '4px 10px' }}>
                        ✓ SELECTED TEAM
                      </span>
                      <button 
                        className="btn btn-xs btn-primary pulse-glow" 
                        onClick={() => setAdminViewMode('my_team')}
                        style={{ background: color, borderColor: color, fontWeight: 900, borderRadius: '999px', padding: '4px 14px' }}
                      >
                        🎮 Play &rarr;
                      </button>
                    </>
                  ) : (
                    <span className="badge badge-info" style={{ fontWeight: 800, padding: '4px 12px' }}>
                      ⚡ LIVE ANSWERING
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. STAGE: ACTIVE TEAM QUIZ ARENA (LOCKED TO SINGLE ASSIGNED TEAM)
  // ==========================================
  const myTeamName = teamNames[myTeamIndex] || `Team ${myTeamIndex + 1}`;
  const myTeamColor = teamColors[myTeamIndex] || '#4f46e5';
  const myTeamScore = scores[myTeamIndex] || 0;

  const myBucket = (buckets[myTeamIndex] && buckets[myTeamIndex].length > 0) ? buckets[myTeamIndex] : questions;
  const currentQ = myBucket[currentQIndex] || myBucket[0] || {
    text: "Operating Systems Question",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
    category: "General OS"
  };

  // If this team has completed all questions -> Locked summary (NO team switching)
  if (myProg.completed || currentQIndex >= myBucket.length) {
    return (
      <div className="admin-panel-card" style={{ maxWidth: '780px', margin: '40px auto', padding: '48px 32px', textAlign: 'center', boxShadow: 'var(--shadow-lg)', border: `2px solid ${myTeamColor}` }}>
        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🏁</div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
          {myTeamName} — Challenge Completed!
        </h2>

        {/* Prominent Your Chance is Finished Banner */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fee2e2', border: '2px solid #ef4444', color: '#991b1b', padding: '8px 24px', borderRadius: '999px', fontWeight: 900, fontSize: '16px', margin: '14px auto' }}>
          <span>⛔</span>
          <span>Your chance is finished</span>
        </div>

        <div style={{ fontSize: '36px', fontWeight: 900, color: myTeamColor, margin: '16px 0', fontFamily: 'var(--font-mono)' }}>
          Final Score: {myTeamScore} pts
        </div>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Questions Completed: <b>{myBucket.length} / {myBucket.length}</b> &bull; Accuracy: <b>{myProg.correctCount} Correct</b>
        </p>

        <div className="radar-section" style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px' }}>
          <span className="badge badge-success" style={{ fontSize: '13px', fontWeight: 800 }}>
            🟢 Points recorded in Supabase PostgreSQL Cloud Database & Admin Panel
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* Cyber League Team Header (Locked to this single team) */}
      <div className="radar-section" style={{ background: `linear-gradient(135deg, ${myTeamColor}15, var(--bg-card))`, border: `2px solid ${myTeamColor}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderRadius: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: myTeamColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 900, boxShadow: `0 6px 16px ${myTeamColor}50` }}>
            {myTeamIndex + 1}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
              {myTeamName} <span style={{ fontSize: '13px', fontWeight: 700, color: myTeamColor }}>(Locked to this System)</span>
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Question <b>{currentQIndex + 1}</b> of <b>{myBucket.length}</b> &bull; ⏳ Overall Round Clock: <b>{roundSeconds}s</b>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Circular Countdown Timer */}
          <CircularTimer
            timeLeft={questionSeconds}
            maxTime={qTimeSetting}
            isPlaying={true}
          />

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>Live Points</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: myTeamColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              {myTeamScore} pts
            </div>
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setAdminViewMode('matrix')}
                title="View all 4 teams progress matrix"
              >
                📊 Matrix
              </button>
              <button className="btn btn-outline btn-sm" onClick={handleAdminSwitchTeam} title="Admin Override Team Switch">
                🔄 Admin Switch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="arena-card" style={{ padding: '32px' }}>
        <div className="q-meta-strip" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="q-index-highlight" style={{ background: myTeamColor, color: '#fff' }}>
              Question #{currentQIndex + 1} of {myBucket.length}
            </span>
            <span className="q-category-badge">{currentQ.category || 'General OS'}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className={`badge ${questionSeconds <= 5 ? 'badge-danger' : 'badge-warning'}`} style={{ fontWeight: 800, padding: '4px 10px' }}>
              ⏱️ {questionSeconds}s
            </span>
            <span className="q-points-badge base">🎯 +10 pts on Correct</span>
          </div>
        </div>

        <h2 className="q-text" style={{ fontSize: '22px', lineHeight: '1.5', margin: '16px 0 24px 0' }}>
          {currentQ.text}
        </h2>

        {currentQ.codeSnippet && (
          <CodeSnippetView snippet={currentQ.codeSnippet} />
        )}

        {/* Interactive Options Grid */}
        <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}>
          {currentQ.options.map((opt, i) => {
            let cardStyle = { textAlign: 'left', cursor: 'pointer', padding: '16px 20px', transition: 'all 0.2s ease' };
            if (selectedOptFeedback && selectedOptFeedback.optIdx === i) {
              cardStyle.border = selectedOptFeedback.isCorrect ? '2.5px solid #10b981' : '2.5px solid #ef4444';
              cardStyle.background = selectedOptFeedback.isCorrect ? '#ecfdf5' : '#fef2f2';
            }

            return (
              <button
                key={i}
                className="option-card"
                onClick={() => handleSimultaneousSubmit(i, currentQ.correctIndex)}
                style={cardStyle}
                disabled={selectedOptFeedback !== null}
              >
                <div className="option-prefix" style={{ background: myTeamColor, color: '#fff' }}>
                  {['A', 'B', 'C', 'D'][i]}
                </div>
                <div className="option-text" style={{ fontSize: '15px', fontWeight: 700 }}>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Timing & Skip Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>
            ⏳ Round Clock: <b>{roundSeconds}s</b>
          </div>

          <button 
            className="btn btn-outline" 
            onClick={handleSimultaneousSkip}
            style={{ fontWeight: 800 }}
          >
            ⏭️ Skip Question (No Points)
          </button>
        </div>
      </div>
    </div>
  );
}
