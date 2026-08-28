import React, { useState, useEffect } from 'react';

export function IntroSplash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 7 Seconds Total Intro Screen Duration (70ms * 100 = 7000ms)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => handleEnter(), 300);
          return 100;
        }
        return prev + 1;
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 500);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Background Cyber Orbit Elements */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', border: '1px dashed rgba(99, 102, 241, 0.25)', animation: 'spin 20s linear infinite', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '780px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Animated Presentation Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(129, 140, 248, 0.35)', borderRadius: '999px', fontSize: '12px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: '24px', boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)' }}>
          ✦ PRESENTED BY ✦
        </div>

        {/* College Name */}
        <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 42px)', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 70%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px', lineHeight: '1.2' }}>
          DHAANISH AHMED INSTITUTE OF TECHNOLOGY
        </h1>

        {/* Location & Department */}
        <div style={{ fontSize: 'clamp(14px, 2.2vw, 18px)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', color: '#38bdf8', marginBottom: '8px' }}>
          COIMBATORE
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '36px' }}>
          Department of Computer Science & Engineering
        </div>

        {/* App Title & Glowing Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 0 25px rgba(79, 70, 229, 0.6)' }}>
            🚀
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff' }}>
              Dait Quiz Mastery
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Dhaanish Ahmed Institute of Technology Coimbatore
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ maxWidth: '380px', margin: '28px auto 18px auto' }}>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #4f46e5, #06b6d4, #10b981)',
                borderRadius: '999px',
                transition: 'width 0.1s ease',
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.8)'
              }} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '1px' }}>
            <span>INITIALIZING TOURNAMENT CLOUD...</span>
            <span style={{ color: '#38bdf8' }}>{progress}%</span>
          </div>
        </div>

        {/* Skip / Enter Button */}
        <button
          onClick={handleEnter}
          style={{
            marginTop: '12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '10px 24px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '1px',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #4f46e5, #06b6d4)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          🚀 ENTER ARENA NOW &rarr;
        </button>

      </div>

      {/* Bottom Corner Developer Credit (As Requested) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '18px',
          right: '24px',
          fontSize: '12px',
          color: '#94a3b8',
          letterSpacing: '0.8px',
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '6px 14px',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        ⚡ Created by <b style={{ color: '#38bdf8', fontWeight: 800 }}>Suhail</b> (CSE III Year)
      </div>
    </div>
  );
}
