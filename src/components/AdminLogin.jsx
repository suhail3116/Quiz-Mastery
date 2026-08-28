import React, { useState } from 'react';

const STORAGE_ADMIN_PWD_KEY = 'antigravity_admin_password_v1';
const VERIFY_PHONE_NUMBER = '9043356776';

export function AdminLogin({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'change_password'
  
  // Login fields
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  
  // Change password fields
  const [verifyNo, setVerifyNo] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getSavedPassword = () => {
    return localStorage.getItem(STORAGE_ADMIN_PWD_KEY) || '123';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const savedPwd = getSavedPassword();

    if (username.trim().toLowerCase() === 'admin' && password === savedPwd) {
      localStorage.setItem('antigravity_admin_auth_v1', 'true');
      onLoginSuccess();
    } else {
      setErrorMsg('❌ Invalid Admin username or password.');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (verifyNo.trim() !== VERIFY_PHONE_NUMBER) {
      setErrorMsg('❌ Invalid verification number! Please enter the registered authorization number (9043356776).');
      return;
    }

    if (!newPassword || newPassword.length < 1) {
      setErrorMsg('Please enter a valid new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    // Save updated password
    localStorage.setItem(STORAGE_ADMIN_PWD_KEY, newPassword);
    setSuccessMsg('✅ Password successfully changed! You can now log in with your new password.');
    setPassword('');
    setVerifyNo('');
    setNewPassword('');
    setConfirmPassword('');
    setMode('login');
  };

  return (
    <div className="admin-panel-card" style={{ maxWidth: '520px', margin: '40px auto', padding: '36px', boxShadow: 'var(--shadow-lg)', border: '2px solid #c7d2fe' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#fff', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)' }}>
          🛡️
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', marginBottom: '6px' }}>
          {mode === 'login' ? 'Quizmaster Admin Access' : 'Change Master Password'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {mode === 'login' 
            ? 'Enter credentials to authorize Admin controls on this computer. Other computers stay in Spectator / Projector mode until authorized.' 
            : 'Enter the registered verification number (9043356776) to set a new password.'}
        </p>
      </div>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #ef4444', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginBottom: '18px' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', color: '#047857', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, marginBottom: '18px' }}>
          {successMsg}
        </div>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Admin Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <button 
                type="button" 
                onClick={() => { setMode('change_password'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              autoFocus
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg pulse-glow" 
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800, borderRadius: 'var(--radius-full)' }}
          >
            🔓 Authorize & Unlock Admin Controls
          </button>
        </form>
      ) : (
        <form onSubmit={handleChangePassword}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Registered Phone Number</label>
            <input 
              type="text" 
              className="form-input" 
              value={verifyNo}
              onChange={(e) => setVerifyNo(e.target.value)}
              placeholder="e.g. 9043356776"
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label">Confirm New Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ flex: 1, fontWeight: 800 }}
            >
              💾 Save New Password
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-lg" 
              onClick={() => { setMode('login'); setErrorMsg(''); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Device Isolation Explainer Note */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🔒</span>
        <span><b>Device-Isolated Security:</b> Only computers that enter the password gain Admin rights. All other auditorium devices stay in Spectator mode.</span>
      </div>
    </div>
  );
}
