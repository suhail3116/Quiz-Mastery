import React, { useState, useEffect } from 'react';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function TeamsEditView({ engine = {} }) {
  const { settings = {}, updateSettings } = engine;
  const count = settings?.totalTeams || 4;
  const currentNames = settings?.teamNames || DEFAULT_TEAM_NAMES;
  const teamColors = settings?.teamColors || DEFAULT_TEAM_COLORS;

  const [names, setNames] = useState(currentNames);
  
  // Track which teams have been saved (saved teams disappear from editable list)
  const [savedTeams, setSavedTeams] = useState(() => {
    const stored = localStorage.getItem('antigravity_saved_teams_map');
    return stored ? JSON.parse(stored) : {};
  });

  const [saveToast, setSaveToast] = useState('');

  useEffect(() => {
    setNames(settings?.teamNames || DEFAULT_TEAM_NAMES);
  }, [settings?.teamNames]);

  useEffect(() => {
    const handleReset = () => {
      setSavedTeams({});
      setNames(DEFAULT_TEAM_NAMES);
      localStorage.removeItem('antigravity_saved_teams_map');
    };
    window.addEventListener('antigravity_tournament_reset', handleReset);
    return () => window.removeEventListener('antigravity_tournament_reset', handleReset);
  }, []);

  const handleNameChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  // Separate Per-Team Save Handler: Team name is saved and disappears from list!
  const handleSaveIndividualTeam = (index) => {
    const updated = [...names];
    updateSettings({ teamNames: updated });
    
    // Mark as saved -> team disappears from the active list!
    const newSaved = { ...savedTeams, [index]: true };
    setSavedTeams(newSaved);
    localStorage.setItem('antigravity_saved_teams_map', JSON.stringify(newSaved));

    const savedName = updated[index] || `Team ${index + 1}`;
    setSaveToast(`✅ Team ${index + 1} "${savedName}" saved and removed from editing list!`);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Unlock / Re-edit Handler
  const handleReEditTeam = (index) => {
    const newSaved = { ...savedTeams, [index]: false };
    setSavedTeams(newSaved);
    localStorage.setItem('antigravity_saved_teams_map', JSON.stringify(newSaved));
  };

  const handleResetTeam = (index) => {
    const updated = [...names];
    updated[index] = DEFAULT_TEAM_NAMES[index] || `Team ${index + 1}`;
    setNames(updated);
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    updateSettings({ teamNames: names });
    
    // Save all teams
    const allSaved = {};
    for (let i = 0; i < count; i++) allSaved[i] = true;
    setSavedTeams(allSaved);
    localStorage.setItem('antigravity_saved_teams_map', JSON.stringify(allSaved));

    setSaveToast('✅ All team names saved and locked!');
    setTimeout(() => setSaveToast(''), 3500);
  };

  const handleResetAllToEdit = () => {
    setSavedTeams({});
    localStorage.removeItem('antigravity_saved_teams_map');
  };

  // Calculate unsaved teams that still need name typing
  const unsavedTeamIndices = Array.from({ length: count })
    .map((_, i) => i)
    .filter(i => !savedTeams[i]);

  const savedTeamIndices = Array.from({ length: count })
    .map((_, i) => i)
    .filter(i => savedTeams[i]);

  const isAllSaved = unsavedTeamIndices.length === 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="radar-section" style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', color: '#fff', padding: '24px 30px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#fff', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)' }}>
          👥
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 6px 0', color: '#fff' }}>
          Edit Tournament Team Names
        </h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
          Enter custom names for each team. When you click <b>Save</b>, that team is saved and <b>removed from the list</b>!
        </p>
      </div>

      {/* Team Names Form Card */}
      <div className="admin-panel-card" style={{ padding: '32px' }}>
        
        {/* Toast Notice */}
        {saveToast && (
          <div style={{ marginBottom: '20px', padding: '12px 18px', background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '12px', color: '#047857', fontSize: '14px', fontWeight: 800, textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            {saveToast}
          </div>
        )}

        {/* 1. All Teams Saved Stage */}
        {isAllSaved ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#065f46', marginBottom: '8px' }}>
              All {count} Team Names Saved & Locked!
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              All team names are synchronized with the live Scoreboard, Arena, Buzzer, and Certificates.
            </p>

            {/* Saved Teams Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
              {Array.from({ length: count }).map((_, i) => {
                const color = teamColors[i] || '#4f46e5';
                const nameValue = names[i] || `Team ${i + 1}`;

                return (
                  <div key={i} style={{ padding: '14px', background: '#f8fafc', border: `1.5px solid ${color}`, borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 900, margin: '0 auto 8px auto' }}>
                      {i + 1}
                    </div>
                    <div style={{ fontWeight: 900, fontSize: '15px', color: 'var(--text-main)' }}>
                      {nameValue}
                    </div>
                    <span className="badge badge-success" style={{ marginTop: '6px', fontSize: '11px', fontWeight: 800 }}>
                      ✓ Locked
                    </span>
                  </div>
                );
              })}
            </div>

            <button 
              className="btn btn-outline btn-lg"
              onClick={handleResetAllToEdit}
              style={{ fontWeight: 800, borderRadius: '999px' }}
            >
              ✏️ Re-Open / Edit Team Names
            </button>
          </div>
        ) : (
          /* 2. Active Unsaved Teams Editing List (Saved teams are gone from list) */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                Teams Awaiting Name Entry ({unsavedTeamIndices.length} Remaining)
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {savedTeamIndices.length} of {count} Saved
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {unsavedTeamIndices.map((i) => {
                const color = teamColors[i] || '#4f46e5';
                const nameValue = names[i] !== undefined ? names[i] : (DEFAULT_TEAM_NAMES[i] || `Team ${i + 1}`);

                return (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '14px', 
                      padding: '16px 20px', 
                      background: 'var(--bg-subtle)', 
                      border: `1.5px solid ${color}40`, 
                      borderRadius: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Team Number Avatar */}
                    <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, flexShrink: 0, boxShadow: `0 4px 12px ${color}40` }}>
                      {i + 1}
                    </div>

                    {/* Team Name Input */}
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Team {i + 1} Display Name
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={nameValue}
                        onChange={(e) => handleNameChange(i, e.target.value)}
                        placeholder={`Enter Team ${i + 1} Name`}
                        style={{ fontWeight: 700, fontSize: '15px' }}
                        required
                      />
                    </div>

                    {/* Separate Save Button: saves & removes from list */}
                    <button
                      type="button"
                      className="btn btn-sm btn-primary pulse-glow"
                      onClick={() => handleSaveIndividualTeam(i)}
                      style={{ background: color, borderColor: color, fontWeight: 900, borderRadius: '999px', padding: '8px 18px', alignSelf: 'flex-end', marginBottom: '2px' }}
                    >
                      💾 Save Team {i + 1}
                    </button>

                    {/* Reset Button */}
                    <button
                      type="button"
                      className="btn btn-xs btn-outline"
                      onClick={() => handleResetTeam(i)}
                      title="Reset to default name"
                      style={{ alignSelf: 'flex-end', marginBottom: '4px' }}
                    >
                      ↺
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Global Save All Button */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-primary btn-lg pulse-glow"
                onClick={handleSaveAll}
                style={{ padding: '14px 40px', fontWeight: 900, borderRadius: '999px', fontSize: '16px' }}
              >
                💾 Save All Remaining Teams
              </button>
            </div>
          </>
        )}

        {/* 3. Collapsible Saved Teams Section if some are saved */}
        {!isAllSaved && savedTeamIndices.length > 0 && (
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🔒 Saved Teams ({savedTeamIndices.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savedTeamIndices.map((sIdx) => {
                const color = teamColors[sIdx] || '#4f46e5';
                const sName = names[sIdx] || `Team ${sIdx + 1}`;

                return (
                  <div 
                    key={sIdx}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px 18px', 
                      background: '#f8fafc', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px' 
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="radar-team-num" style={{ background: color }}>{sIdx + 1}</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{sName}</span>
                      <span className="badge badge-success" style={{ fontSize: '11px', fontWeight: 800 }}>✓ Saved</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-xs btn-outline"
                      onClick={() => handleReEditTeam(sIdx)}
                      style={{ fontWeight: 800 }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
