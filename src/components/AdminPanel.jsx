import React, { useState, useEffect } from 'react';
import { PRESET_QUESTION_BANKS } from '../data/presets';
import { QuestionModal } from './QuestionModal';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function AdminPanel({ engine = {}, onLogout, onNavigateToTeams }) {
  const { 
    settings = {}, 
    updateSettings, 
    questions = [], 
    updateQuestions, 
    gameState = {}, 
    updateTeamScore, 
    setTeamScore, 
    resetQuiz 
  } = engine;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  // Settings form state
  const [totalTeams, setTotalTeams] = useState(settings.totalTeams || 4);
  const [questionTime, setQuestionTime] = useState(settings.questionTime || 20);
  const [totalRoundTime, setTotalRoundTime] = useState(settings.totalRoundTime || 120);
  const [balanceQuestionTime, setBalanceQuestionTime] = useState(settings.balanceQuestionTime || 15);
  const [buzzerQuestionTime, setBuzzerQuestionTime] = useState(settings.buzzerQuestionTime || 15);
  const [sheetReviewTime, setSheetReviewTime] = useState(settings.sheetReviewTime || 30);
  const [basePoints, setBasePoints] = useState(settings.basePoints || 10);
  const [passPoints, setPassPoints] = useState(settings.passPoints || 5);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);
  const [teamNames, setTeamNames] = useState(settings.teamNames || DEFAULT_TEAM_NAMES);
  const [teamColors, setTeamColors] = useState(settings.teamColors || DEFAULT_TEAM_COLORS);
  const [collegeName, setCollegeName] = useState(settings.collegeName || 'Dhaanish Ahmed Institute of Technology Coimbatore');
  const [eventName, setEventName] = useState(settings.eventName || 'Dait Quiz Mastery');

  const [presetToast, setPresetToast] = useState('');
  const scores = gameState?.scores || [0, 0, 0, 0];

  // Keep local form in sync if external settings change
  useEffect(() => {
    setTotalTeams(settings.totalTeams || 4);
    setQuestionTime(settings.questionTime || 20);
    setTotalRoundTime(settings.totalRoundTime || 120);
    setBalanceQuestionTime(settings.balanceQuestionTime || 15);
    setBuzzerQuestionTime(settings.buzzerQuestionTime || 15);
    setSheetReviewTime(settings.sheetReviewTime || 30);
    setBasePoints(settings.basePoints || 10);
    setPassPoints(settings.passPoints || 5);
    setSoundEnabled(settings.soundEnabled ?? true);
    setTeamNames(settings.teamNames || DEFAULT_TEAM_NAMES);
    setTeamColors(settings.teamColors || DEFAULT_TEAM_COLORS);
    setCollegeName(settings.collegeName || 'Dhaanish Ahmed Institute of Technology Coimbatore');
    setEventName(settings.eventName || 'Dait Quiz Mastery');
  }, [settings]);

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    updateSettings({
      totalTeams: parseInt(totalTeams, 10),
      questionTime: parseInt(questionTime, 10),
      totalRoundTime: parseInt(totalRoundTime, 10),
      balanceQuestionTime: parseInt(balanceQuestionTime, 10),
      buzzerQuestionTime: parseInt(buzzerQuestionTime, 10),
      sheetReviewTime: parseInt(sheetReviewTime, 10),
      basePoints: parseInt(basePoints, 10),
      passPoints: parseInt(passPoints, 10),
      soundEnabled,
      teamNames,
      teamColors,
      collegeName,
      eventName
    });
    setPresetToast('✅ All tournament settings & all-tabs timing configuration saved!');
    setTimeout(() => setPresetToast(''), 3500);
  };

  const handleApplyTimingPreset = (qT, rT, bT, buzzT, sheetT, presetName) => {
    const numQT = parseInt(qT, 10);
    const numRT = parseInt(rT, 10);
    const numBT = parseInt(bT, 10);
    const numBuzz = parseInt(buzzT, 10);
    const numSheet = parseInt(sheetT, 10);

    setQuestionTime(numQT);
    setTotalRoundTime(numRT);
    setBalanceQuestionTime(numBT);
    setBuzzerQuestionTime(numBuzz);
    setSheetReviewTime(numSheet);

    updateSettings({
      questionTime: numQT,
      totalRoundTime: numRT,
      balanceQuestionTime: numBT,
      buzzerQuestionTime: numBuzz,
      sheetReviewTime: numSheet
    });

    setPresetToast(`⚡ ${presetName} Preset Applied! (${numQT}s Arena Q / ${numRT}s Round / ${numBuzz}s Buzzer)`);
    setTimeout(() => setPresetToast(''), 3500);
  };

  const handleLoadPreset = (key) => {
    if (PRESET_QUESTION_BANKS[key]) {
      const bank = PRESET_QUESTION_BANKS[key];
      updateQuestions([...bank.questions]);
      updateSettings(bank.settings);
      setTotalTeams(bank.settings.totalTeams);
      setQuestionTime(bank.settings.questionTime || 20);
      setTotalRoundTime(bank.settings.totalRoundTime || 120);
      setBalanceQuestionTime(bank.settings.balanceQuestionTime || 15);
      setTeamNames(bank.settings.teamNames);
      setTeamColors(bank.settings.teamColors);
      resetQuiz();
      alert(`Loaded Curriculum Bank: ${bank.name} (${bank.questions.length} Qs)`);
    }
  };

  const handleSaveQuestion = (qData) => {
    const newQs = [...questions];
    if (editingIndex >= 0) {
      newQs[editingIndex] = qData;
    } else {
      newQs.push(qData);
    }
    updateQuestions(newQs);
  };

  const handleDeleteQuestion = (idx) => {
    if (confirm(`Delete Question #${idx + 1}?`)) {
      const newQs = [...questions];
      newQs.splice(idx, 1);
      updateQuestions(newQs);
    }
  };

  const handleTeamNameChange = (index, value) => {
    const next = [...teamNames];
    next[index] = value;
    setTeamNames(next);
  };

  const handleTeamColorChange = (index, value) => {
    const next = [...teamColors];
    next[index] = value;
    setTeamColors(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Admin Top Session Banner with Logout & Reset Tournament */}
      <div className="radar-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #eef2ff, #ffffff)', border: '1.5px solid #c7d2fe', padding: '16px 24px', boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
            🛡️
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '18px', color: '#1e1b4b' }}>Quizmaster & Admin Command Center</div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 800 }}>
              🟢 Active Authenticated Session on this Computer &bull; Realtime Cloud Database Connected
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {onLogout && (
            <button 
              className="btn btn-danger pulse-glow" 
              onClick={onLogout}
              style={{ fontWeight: 800, padding: '10px 20px', borderRadius: 'var(--radius-full)' }}
            >
              🚪 Log Out Admin
            </button>
          )}

          <button 
            className="btn btn-warning" 
            onClick={() => {
              if (confirm('Are you sure you want to reset the entire tournament, scores, and round progress?')) {
                resetQuiz();
                alert('Tournament has been reset successfully!');
              }
            }}
            style={{ fontWeight: 800, padding: '10px 20px', borderRadius: 'var(--radius-full)' }}
            title="Reset all scores, rounds, and balance questions"
          >
            🔄 Reset Tournament
          </button>
        </div>
      </div>

      {/* 2. Live Scores Overview & Point Adjuster Strip */}
      <div className="admin-panel-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Live Tournament Scores & Scoreboard Adjuster</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Real-time scores visible on this Admin screen. Adjust points directly on the fly.
              </p>
            </div>
          </div>

          <span className="badge badge-info" style={{ fontWeight: 800 }}>
            {totalTeams} Active Teams
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: '14px' }}>
          {Array.from({ length: totalTeams }).map((_, i) => {
            const tName = teamNames[i] || `Team ${i + 1}`;
            const tColor = teamColors[i] || '#4f46e5';
            const tScore = scores[i] || 0;

            return (
              <div 
                key={i} 
                style={{ 
                  background: 'var(--bg-card)', 
                  border: `2px solid ${tColor}`, 
                  borderRadius: '16px', 
                  padding: '16px', 
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="radar-team-num" style={{ background: tColor, width: '26px', height: '26px', fontSize: '12px' }}>
                      {i + 1}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>{tName}</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: tColor, fontFamily: 'var(--font-mono)' }}>
                    {tScore} pts
                  </span>
                </div>

                {/* Score Adjuster Buttons */}
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    className="btn btn-xs btn-outline" 
                    onClick={() => updateTeamScore && updateTeamScore(i, 10)}
                    title="Add 10 points"
                    style={{ fontWeight: 800, color: '#10b981', borderColor: '#10b981' }}
                  >
                    +10
                  </button>
                  <button 
                    className="btn btn-xs btn-outline" 
                    onClick={() => updateTeamScore && updateTeamScore(i, 5)}
                    title="Add 5 points"
                    style={{ fontWeight: 800, color: '#0284c7', borderColor: '#0284c7' }}
                  >
                    +5
                  </button>
                  <button 
                    className="btn btn-xs btn-outline" 
                    onClick={() => updateTeamScore && updateTeamScore(i, -5)}
                    title="Subtract 5 points"
                    style={{ fontWeight: 800, color: '#ef4444', borderColor: '#ef4444' }}
                  >
                    -5
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. All-Tabs Timing Controls & Configuration Grid */}
      <div className="admin-grid">
        {/* Left Column: All-Tabs Timers & Speed Presets */}
        <div className="admin-panel-card">
          <div className="admin-panel-title">
            <span>⏱️ All-Tabs Timing Configuration</span>
          </div>

          {/* Quick Timing Speed Presets with Active State & Toast */}
          <div className="form-group" style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>⚡ Master Timing Presets</label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>Applies to all tabs</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button 
                type="button"
                className={`btn btn-xs ${parseInt(questionTime, 10) === 10 && parseInt(totalRoundTime, 10) === 60 ? 'btn-primary pulse-glow' : 'btn-outline'}`}
                style={parseInt(questionTime, 10) === 10 && parseInt(totalRoundTime, 10) === 60 ? { background: '#f59e0b', borderColor: '#d97706', color: '#fff', fontWeight: 800 } : {}}
                onClick={() => handleApplyTimingPreset(10, 60, 10, 10, 15, 'Speed')}
                title="10s Q / 60s Round / 10s Buzzer"
              >
                ⚡ Speed (10s/60s)
              </button>
              <button 
                type="button"
                className={`btn btn-xs ${parseInt(questionTime, 10) === 20 && parseInt(totalRoundTime, 10) === 120 ? 'btn-primary pulse-glow' : 'btn-outline'}`}
                style={parseInt(questionTime, 10) === 20 && parseInt(totalRoundTime, 10) === 120 ? { background: '#4f46e5', borderColor: '#4338ca', color: '#fff', fontWeight: 800 } : {}}
                onClick={() => handleApplyTimingPreset(20, 120, 15, 15, 30, 'Standard')}
                title="20s Q / 120s Round / 15s Buzzer"
              >
                🎯 Standard (20s/120s)
              </button>
              <button 
                type="button"
                className={`btn btn-xs ${parseInt(questionTime, 10) === 30 && parseInt(totalRoundTime, 10) === 180 ? 'btn-primary pulse-glow' : 'btn-outline'}`}
                style={parseInt(questionTime, 10) === 30 && parseInt(totalRoundTime, 10) === 180 ? { background: '#10b981', borderColor: '#059669', color: '#fff', fontWeight: 800 } : {}}
                onClick={() => handleApplyTimingPreset(30, 180, 20, 20, 45, 'Relaxed')}
                title="30s Q / 180s Round / 20s Buzzer"
              >
                ⏳ Relaxed (30s/180s)
              </button>
            </div>
            
            {presetToast && (
              <div style={{ marginTop: '10px', padding: '8px 14px', background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '8px', color: '#047857', fontSize: '12px', fontWeight: 800 }}>
                {presetToast}
              </div>
            )}
          </div>

          <form onSubmit={handleSaveSettings}>
            
            {/* Section A: Arena Mode Timers */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🎮</span>
                <span>Arena Mode Timers</span>
              </div>

              {/* 1. Per-Question Time */}
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>⏱️ Per-Question Time (Seconds)</label>
                  <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 800 }}>Auto-skips when 0</span>
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={questionTime}
                  onChange={(e) => setQuestionTime(e.target.value)}
                  min="5"
                  max="120"
                  required
                />
              </div>

              {/* 2. Total Team Round Time */}
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>⏳ Total Team Round Time (Seconds)</label>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>End of Team Round</span>
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={totalRoundTime}
                  onChange={(e) => setTotalRoundTime(e.target.value)}
                  min="30"
                  max="600"
                  required
                />
              </div>

              {/* 3. Balance Rebound Question Time */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>🔄 Balance Rebound Clock (Seconds)</label>
                  <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 800 }}>Bonus Steal Clock</span>
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={balanceQuestionTime}
                  onChange={(e) => setBalanceQuestionTime(e.target.value)}
                  min="5"
                  max="60"
                  required
                />
              </div>
            </div>

            {/* Section B: Buzzer Mode Timers */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span>
                <span>Buzzer Arena Mode Timers</span>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>🔔 Buzzer Question Reaction Window (Seconds)</label>
                  <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800 }}>Buzz Response Time</span>
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={buzzerQuestionTime}
                  onChange={(e) => setBuzzerQuestionTime(e.target.value)}
                  min="5"
                  max="60"
                  required
                />
              </div>
            </div>

            {/* Section C: Questions Sheet Mode Timers */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📚</span>
                <span>Questions Sheet Mode Timers</span>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>📑 Sheet Deliberation & Review Time (Seconds)</label>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>Sheet Time Limit</span>
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={sheetReviewTime}
                  onChange={(e) => setSheetReviewTime(e.target.value)}
                  min="10"
                  max="300"
                  required
                />
              </div>
            </div>

            {/* Save Button */}
            <button 
              type="submit" 
              className="btn btn-primary btn-lg pulse-glow" 
              style={{ width: '100%', padding: '14px', fontWeight: 800, borderRadius: 'var(--radius-full)' }}
            >
              💾 Save All Timers & Configuration
            </button>
          </form>
        </div>

        {/* Right Column: Teams, Institution Branding & Point Rules */}
        <div className="admin-panel-card">
          <div className="admin-panel-title">
            <span>👥 Team Management & Institution Details</span>
          </div>

          <form onSubmit={handleSaveSettings}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Total Competing Teams (2 - 6)</label>
              <select
                className="form-select"
                value={totalTeams}
                onChange={(e) => setTotalTeams(parseInt(e.target.value, 10))}
              >
                <option value="2">2 Teams</option>
                <option value="3">3 Teams</option>
                <option value="4">4 Teams</option>
                <option value="5">5 Teams</option>
                <option value="6">6 Teams</option>
              </select>
            </div>

            {/* Team Names & Color Palette */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Team Names & Branding Colors</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: totalTeams }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="radar-team-num" style={{ background: teamColors[i] || '#4f46e5' }}>{i + 1}</span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flex: 1 }}
                      value={teamNames[i] || ''}
                      onChange={(e) => handleTeamNameChange(i, e.target.value)}
                      placeholder={`Team ${i + 1} Name`}
                      required
                    />
                    <input
                      type="color"
                      value={teamColors[i] || '#4f46e5'}
                      onChange={(e) => handleTeamColorChange(i, e.target.value)}
                      style={{ width: '40px', height: '38px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      title="Select Team Color"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Institution & Event Info */}
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Institution Name</label>
              <input
                type="text"
                className="form-input"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Dhaanish Ahmed Institute of Technology"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Event Championship Title</label>
              <input
                type="text"
                className="form-input"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Annual National Technical Quiz Championship 2026"
              />
            </div>

            {/* Points Configuration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🎯 Base Points</label>
                <input
                  type="number"
                  className="form-input"
                  value={basePoints}
                  onChange={(e) => setBasePoints(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">🔄 Pass / Rebound</label>
                <input
                  type="number"
                  className="form-input"
                  value={passPoints}
                  onChange={(e) => setPassPoints(e.target.value)}
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', padding: '14px', fontWeight: 800, borderRadius: 'var(--radius-full)' }}
            >
              💾 Save Team & Branding Settings
            </button>
          </form>
        </div>
      </div>

      {/* 4. Question Bank Management */}
      <div className="admin-panel-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>📚 Tournament Question Bank ({questions.length} Questions)</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Live questions loaded in Supabase Cloud PostgreSQL database.
            </p>
          </div>

          <button 
            className="btn btn-primary pulse-glow" 
            onClick={() => { setEditingIndex(-1); setModalOpen(true); }}
          >
            ➕ Add New Question
          </button>
        </div>

        {/* Questions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Question Text</th>
                <th>Category</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Solution</th>
                <th style={{ width: '140px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.slice(0, 15).map((q, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800 }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{q.text}</td>
                  <td><span className="badge badge-info">{q.category || 'OS'}</span></td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: '#10b981' }}>
                    {['A', 'B', 'C', 'D'][q.correctIndex]}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button 
                        className="btn btn-xs btn-outline" 
                        onClick={() => { setEditingIndex(idx); setModalOpen(true); }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-xs btn-danger" 
                        onClick={() => handleDeleteQuestion(idx)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {questions.length > 15 && (
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing first 15 of {questions.length} questions in bank.
            </div>
          )}
        </div>
      </div>

      {/* Modal for editing / adding questions */}
      {modalOpen && (
        <QuestionModal
          question={editingIndex >= 0 ? questions[editingIndex] : null}
          onSave={handleSaveQuestion}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
