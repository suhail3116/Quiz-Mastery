import React, { useState } from 'react';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];

export function LeaderboardView({ settings = {}, gameState = {} }) {
  const teamNames = settings?.teamNames || DEFAULT_TEAM_NAMES;
  const teamColors = settings?.teamColors || DEFAULT_TEAM_COLORS;
  const scores = gameState?.scores || [0, 0, 0, 0];
  const count = settings?.totalTeams || teamNames.length || 4;

  const [selectedCertTeam, setSelectedCertTeam] = useState(0);

  // Build ranked team array
  const teams = Array.from({ length: count }).map((_, idx) => ({
    index: idx,
    name: teamNames[idx] || `Team ${idx + 1}`,
    color: teamColors[idx] || '#4f46e5',
    score: scores[idx] || 0
  }));

  const rankedTeams = [...teams].sort((a, b) => b.score - a.score);

  const collegeName = settings?.collegeName || 'Dhaanish Ahmed Institute of Technology Coimbatore';
  const departmentName = 'Department of Computer Science & Engineering';
  const eventName = settings?.eventName || 'Dait Quiz Mastery';
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const activeTeamName = teamNames[selectedCertTeam] || `Team ${selectedCertTeam + 1}`;
  const activeTeamColor = teamColors[selectedCertTeam] || '#4f46e5';
  const activeTeamScore = scores[selectedCertTeam] || 0;
  const activeRankIndex = rankedTeams.findIndex(t => t.index === selectedCertTeam);
  const rankNumber = activeRankIndex !== -1 ? activeRankIndex + 1 : 1;

  const rankTitles = {
    1: 'FIRST PLACE CHAMPION (GOLD WINNER)',
    2: 'FIRST RUNNER UP (SILVER AWARD)',
    3: 'SECOND RUNNER UP (BRONZE AWARD)'
  };
  const rankDisplay = rankTitles[rankNumber] || `RANK #${rankNumber} DISTINCTION`;

  // Print ONLY the Certificate using a dedicated clean print window
  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank', 'width=1150,height=820');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate of Excellence - ${activeTeamName}</title>
          <style>
            @page {
              size: landscape;
              margin: 0;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Segoe UI', -apple-system, system-ui, Roboto, sans-serif;
              background: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
            }
            .cert-box {
              width: 100%;
              max-width: 1050px;
              height: 700px;
              border: 12px double #d97706;
              background: #ffffff;
              border-radius: 18px;
              padding: 36px 48px;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              box-shadow: 0 12px 36px rgba(0,0,0,0.12);
              position: relative;
            }
            .cert-header {
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 12px;
              margin-bottom: 14px;
            }
            .cert-college {
              font-size: 24px;
              font-weight: 900;
              color: #1e1b4b;
              letter-spacing: 1.5px;
              text-transform: uppercase;
            }
            .cert-location {
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 3px;
              color: #d97706;
              text-transform: uppercase;
              margin-top: 2px;
            }
            .cert-dept {
              font-size: 13px;
              font-weight: 700;
              color: #475569;
              margin-top: 4px;
            }
            .cert-title-badge {
              display: inline-block;
              background: linear-gradient(135deg, #1e1b4b, #312e81);
              color: #fef08a;
              padding: 6px 28px;
              border-radius: 999px;
              font-size: 16px;
              font-weight: 900;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin: 10px 0 8px 0;
              border: 1px solid #d97706;
            }
            .cert-presented {
              font-size: 14px;
              color: #64748b;
              font-style: italic;
              margin-bottom: 10px;
            }
            .cert-winner-name {
              font-size: 36px;
              font-weight: 900;
              color: ${activeTeamColor};
              border-bottom: 3px solid #d97706;
              display: inline-block;
              padding: 0 40px 6px 40px;
              margin-bottom: 14px;
              font-family: Georgia, serif;
            }
            .cert-desc {
              font-size: 14px;
              color: #334155;
              max-width: 780px;
              margin: 0 auto 12px auto;
              line-height: 1.6;
            }
            .cert-stats-row {
              display: flex;
              justify-content: center;
              gap: 20px;
              margin: 10px 0 16px 0;
            }
            .cert-stat-pill {
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 6px 16px;
              border-radius: 999px;
              font-size: 13px;
              font-weight: 800;
              color: #0f172a;
            }
            .cert-footer {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding: 0 24px;
              margin-top: auto;
            }
            .cert-sign-col {
              text-align: center;
              width: 170px;
            }
            .cert-sign-line {
              border-top: 1.5px solid #64748b;
              margin-top: 6px;
              padding-top: 4px;
              font-size: 11px;
              font-weight: 700;
              color: #64748b;
              text-transform: uppercase;
            }
            .cert-seal {
              width: 74px;
              height: 74px;
              border-radius: 50%;
              background: radial-gradient(circle, #f59e0b 20%, #d97706 80%, #b45309 100%);
              color: #ffffff;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 16px rgba(217, 119, 6, 0.45);
              border: 2px solid #ffffff;
            }
            @media print {
              body {
                background: #ffffff !important;
                padding: 0 !important;
              }
              .cert-box {
                box-shadow: none !important;
                height: 100vh !important;
                max-width: 100% !important;
                border-radius: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <div class="cert-header">
              <div class="cert-college">${collegeName}</div>
              <div class="cert-location">COIMBATORE, TAMIL NADU</div>
              <div class="cert-dept">${departmentName} &bull; National Technical Championship</div>
            </div>

            <div>
              <div class="cert-title-badge">CERTIFICATE OF EXCELLENCE & ACHIEVEMENT</div>
              <p class="cert-presented">This is to proudly certify that the esteemed technical members of</p>
              
              <div class="cert-winner-name">${activeTeamName}</div>

              <p class="cert-desc">
                have demonstrated supreme technical mastery, intellectual acumen, and exemplary problem-solving skills in the inter-collegiate grand quiz tournament <b>${eventName} 2026</b>, competing across advanced Operating Systems, System Architecture, and Computer Science domains.
              </p>

              <div class="cert-stats-row">
                <span class="cert-stat-pill">🏆 Standing: <b>${rankDisplay}</b></span>
                <span class="cert-stat-pill">🎯 Official Score: <b>${activeTeamScore} Points</b></span>
                <span class="cert-stat-pill">⚡ Distinction: <b>High Technical Acumen</b></span>
              </div>
            </div>

            <div class="cert-footer">
              <div class="cert-sign-col">
                <div style="font-size: 13px; font-weight: 800; color: #0f172a; min-height: 22px;">${dateStr}</div>
                <div class="cert-sign-line">Date of Award</div>
              </div>

              <div class="cert-seal">
                <span style="font-size: 22px;">🏆</span>
                <span style="font-size: 8px; font-weight: 900; letter-spacing: 0.5px;">OFFICIAL</span>
              </div>

              <div class="cert-sign-col">
                <div style="min-height: 22px;"></div>
                <div class="cert-sign-line">Authorized Signature</div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 3D Visual Podium */}
      <div className="admin-panel-card no-print" style={{ textAlign: 'center', padding: '36px 24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '6px' }}>🏆 Tournament Leaderboard</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Live audited rankings synchronized across all devices
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '18px', height: '240px', marginBottom: '24px' }}>
          {/* 2nd Place */}
          {rankedTeams[1] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '160px' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>🥈</div>
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px', color: rankedTeams[1].color }}>
                {rankedTeams[1].name}
              </div>
              <div style={{ fontWeight: 900, fontSize: '16px', marginBottom: '8px' }}>
                {rankedTeams[1].score} pts
              </div>
              <div style={{ width: '100%', height: '110px', background: 'linear-gradient(180deg, #94a3b8, #64748b)', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '24px', boxShadow: 'var(--shadow-md)' }}>
                2
              </div>
            </div>
          )}

          {/* 1st Place */}
          {rankedTeams[0] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '180px' }}>
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>👑</div>
              <div style={{ fontWeight: 900, fontSize: '16px', marginBottom: '4px', color: rankedTeams[0].color }}>
                {rankedTeams[0].name}
              </div>
              <div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '8px', color: '#f59e0b' }}>
                {rankedTeams[0].score} pts
              </div>
              <div style={{ width: '100%', height: '160px', background: 'linear-gradient(180deg, #f59e0b, #d97706)', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '32px', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)' }}>
                1
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {rankedTeams[2] && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '160px' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>🥉</div>
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px', color: rankedTeams[2].color }}>
                {rankedTeams[2].name}
              </div>
              <div style={{ fontWeight: 900, fontSize: '16px', marginBottom: '8px' }}>
                {rankedTeams[2].score} pts
              </div>
              <div style={{ width: '100%', height: '80px', background: 'linear-gradient(180deg, #d97706, #b45309)', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '20px', boxShadow: 'var(--shadow-md)' }}>
                3
              </div>
            </div>
          )}
        </div>

        {/* Full Team Ranks Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Team Name</th>
                <th style={{ textAlign: 'right' }}>Total Points</th>
                <th style={{ textAlign: 'center', width: '140px' }}>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {rankedTeams.map((t, rIdx) => (
                <tr key={t.index} style={{ background: rIdx === 0 ? 'rgba(245, 158, 11, 0.08)' : undefined }}>
                  <td style={{ fontWeight: 900 }}>
                    {rIdx === 0 ? '🥇 1st' : rIdx === 1 ? '🥈 2nd' : rIdx === 2 ? '🥉 3rd' : `#${rIdx + 1}`}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="radar-team-num" style={{ background: t.color }}>{t.index + 1}</span>
                      <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 900, fontSize: '16px', color: t.color }}>
                    {t.score} pts
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn btn-xs btn-outline"
                      onClick={() => setSelectedCertTeam(t.index)}
                    >
                      📜 Select Cert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gold-Trimmed Printable Certificate Preview */}
      <div className="admin-panel-card" style={{ padding: '32px' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900 }}>📜 Certificate of Excellence & Achievement</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Official verified certificate for <b>{activeTeamName}</b>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedCertTeam}
              onChange={(e) => setSelectedCertTeam(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: count }).map((_, i) => (
                <option key={i} value={i}>
                  {teamNames[i] || `Team ${i + 1}`} ({scores[i] || 0} pts)
                </option>
              ))}
            </select>

            <button className="btn btn-primary pulse-glow" onClick={handlePrintCertificate}>
              🖨️ Print Certificate Only
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas Box */}
        <div 
          id="certificate-print-area" 
          style={{
            border: '10px double #d97706',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '36px 40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}
        >
          <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              {collegeName}
            </h2>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '3px', color: '#d97706', textTransform: 'uppercase', marginTop: '2px' }}>
              COIMBATORE, TAMIL NADU
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '3px' }}>
              {departmentName} &bull; National Technical Championship
            </div>
          </div>

          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fef08a', padding: '5px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', border: '1px solid #d97706' }}>
            CERTIFICATE OF EXCELLENCE & ACHIEVEMENT
          </div>

          <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', margin: '0 0 10px 0' }}>
            This is to proudly certify that the esteemed technical members of
          </p>

          <div style={{ fontSize: '34px', fontWeight: 900, color: activeTeamColor, borderBottom: '3px solid #d97706', display: 'inline-block', padding: '0 36px 6px 36px', marginBottom: '14px', fontFamily: 'Georgia, serif' }}>
            {activeTeamName}
          </div>

          <p style={{ fontSize: '14px', color: '#334155', maxWidth: '740px', margin: '0 auto 12px auto', lineHeight: '1.6' }}>
            have demonstrated supreme technical mastery, intellectual acumen, and exemplary problem-solving skills in the inter-collegiate grand quiz tournament <b>{eventName} 2026</b>, competing across advanced Operating Systems, System Architecture, and Computer Science domains.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', margin: '12px 0 20px 0', flexWrap: 'wrap' }}>
            <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
              🏆 Standing: <b>{rankDisplay}</b>
            </span>
            <span style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
              🎯 Score: <b>{activeTeamScore} Points</b>
            </span>
            <span style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
              ⚡ High Technical Distinction
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 24px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center', width: '150px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', minHeight: '20px' }}>{dateStr}</div>
              <div style={{ borderTop: '1.5px solid #64748b', marginTop: '4px', paddingTop: '2px', fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Date of Award</div>
            </div>

            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'radial-gradient(circle, #f59e0b 20%, #d97706 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)' }}>
              🏆
            </div>

            <div style={{ textAlign: 'center', width: '150px' }}>
              <div style={{ minHeight: '20px' }}></div>
              <div style={{ borderTop: '1.5px solid #64748b', marginTop: '4px', paddingTop: '2px', fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Authorized Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
