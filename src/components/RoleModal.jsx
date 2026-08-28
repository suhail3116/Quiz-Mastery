import React from 'react';

export function RoleModal({ onSelectRole }) {
  return (
    <div className="admin-panel-card" style={{ maxWidth: '550px', margin: '40px auto', textAlign: 'center' }}>
      <div className="brand-logo" style={{ marginBottom: '12px' }}>🔑</div>
      <h2 className="idle-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Select Session Role</h2>
      <p className="text-muted" style={{ marginBottom: '24px' }}>
        Choose how you are interacting with this quiz session. Data automatically syncs across windows.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
        <button
          className="btn btn-outline"
          style={{ padding: '16px', justifyContent: 'flex-start' }}
          onClick={() => onSelectRole('projector')}
        >
          <span style={{ fontSize: '22px', marginRight: '12px' }}>📺</span>
          <div>
            <div style={{ fontWeight: 800, color: '#fff' }}>Arena Projector / Big Screen Mode</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Display full arena with timer, bounce radar, and spectator view</div>
          </div>
        </button>

        <button
          className="btn btn-outline"
          style={{ padding: '16px', justifyContent: 'flex-start' }}
          onClick={() => onSelectRole('admin')}
        >
          <span style={{ fontSize: '22px', marginRight: '12px' }}>🛡️</span>
          <div>
            <div style={{ fontWeight: 800, color: '#fff' }}>Quizmaster / Host Controller</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage timers, question bank, score overrides, and game flow</div>
          </div>
        </button>

        <button
          className="btn btn-outline"
          style={{ padding: '16px', justifyContent: 'flex-start' }}
          onClick={() => onSelectRole('team1')}
        >
          <span style={{ fontSize: '22px', marginRight: '12px' }}>👥</span>
          <div>
            <div style={{ fontWeight: 800, color: '#fff' }}>Team Participant View</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive team answering console</div>
          </div>
        </button>
      </div>
    </div>
  );
}
