import React, { useState } from 'react';

export function LifelineBar({ 
  lifelines, 
  onUseLifeline, 
  isDoubleDownActive, 
  disabled 
}) {
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [pollStats, setPollStats] = useState(null);

  const handleAudiencePoll = () => {
    if (disabled || lifelines.audiencePollUsed) return;
    
    // Generate realistic audience percentage votes
    const votes = [Math.floor(Math.random() * 25) + 45, Math.floor(Math.random() * 20) + 10, Math.floor(Math.random() * 15) + 5, 0];
    votes[3] = 100 - (votes[0] + votes[1] + votes[2]);
    
    setPollStats(votes);
    setPollModalOpen(true);
    onUseLifeline('audiencePoll');
  };

  return (
    <div className="lifelines-container">
      <div className="lifelines-title">⚡ Tournament Lifelines:</div>
      
      <div className="lifelines-strip">
        {/* 1. 50:50 Lifeline */}
        <button
          className={`lifeline-btn ${lifelines.fiftyFiftyUsed ? 'used' : ''}`}
          onClick={() => onUseLifeline('fiftyFifty')}
          disabled={disabled || lifelines.fiftyFiftyUsed}
          title="Eliminates 2 wrong choices"
        >
          <span className="lifeline-icon">🌓</span>
          <span className="lifeline-name">50:50</span>
          {lifelines.fiftyFiftyUsed && <span className="used-tag">USED</span>}
        </button>

        {/* 2. +15s Time Freeze */}
        <button
          className={`lifeline-btn ${lifelines.timeFreezeUsed ? 'used' : ''}`}
          onClick={() => onUseLifeline('timeFreeze')}
          disabled={disabled || lifelines.timeFreezeUsed}
          title="Adds +15s to deliberation clock"
        >
          <span className="lifeline-icon">❄️</span>
          <span className="lifeline-name">+15s Freeze</span>
          {lifelines.timeFreezeUsed && <span className="used-tag">USED</span>}
        </button>

        {/* 3. Double Down Bet (+20 / -10 pts) */}
        <button
          className={`lifeline-btn ${isDoubleDownActive ? 'active-wager' : (lifelines.doubleDownUsed ? 'used' : '')}`}
          onClick={() => onUseLifeline('doubleDown')}
          disabled={disabled || lifelines.doubleDownUsed}
          title="Double or Nothing: +20 pts if correct, -10 pts if wrong"
        >
          <span className="lifeline-icon">🔥</span>
          <span className="lifeline-name">Double Down</span>
          {isDoubleDownActive ? <span className="wager-tag">2X ACTIVE</span> : (lifelines.doubleDownUsed && <span className="used-tag">USED</span>)}
        </button>

        {/* 4. Audience Poll */}
        <button
          className={`lifeline-btn ${lifelines.audiencePollUsed ? 'used' : ''}`}
          onClick={handleAudiencePoll}
          disabled={disabled || lifelines.audiencePollUsed}
          title="Audience live vote simulation"
        >
          <span className="lifeline-icon">📊</span>
          <span className="lifeline-name">Audience Poll</span>
          {lifelines.audiencePollUsed && <span className="used-tag">USED</span>}
        </button>
      </div>

      {/* Audience Poll Modal */}
      {pollModalOpen && (
        <div className="modal-backdrop" onClick={() => setPollModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📊 Auditorium Audience Poll</h3>
              <button className="modal-close" onClick={() => setPollModalOpen(false)}>×</button>
            </div>
            <div style={{ padding: '10px 0' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Live aggregated votes from auditorium spectators:
              </p>
              {['A', 'B', 'C', 'D'].map((opt, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, marginBottom: '4px' }}>
                    <span>Option {opt}</span>
                    <span style={{ color: 'var(--primary)' }}>{pollStats?.[i]}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'var(--bg-subtle)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${pollStats?.[i]}%`, 
                        height: '100%', 
                        background: i === 0 ? 'linear-gradient(90deg, #4f46e5, #06b6d4)' : 'var(--border-color)',
                        borderRadius: '99px',
                        transition: 'width 0.6s ease-out'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => setPollModalOpen(false)}>
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
