import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '540px', width: '100%', background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '36px 28px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', marginBottom: '8px' }}>
              Antigravity Quiz Arena
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
              An unexpected display hiccup occurred with cached browser data. Click below to refresh with clean settings.
            </p>

            <button
              onClick={this.handleHardReset}
              style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '999px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}
            >
              🔄 Refresh & Clean Recover
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
