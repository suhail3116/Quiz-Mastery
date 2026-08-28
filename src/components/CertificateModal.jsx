import React from 'react';

export function CertificateModal({ isOpen, onClose, winnerTeam, rank = 1, score, totalTeams, settings = {} }) {
  if (!isOpen) return null;

  const collegeName = settings.collegeName || 'Dhaanish Ahmed Institute of Technology Coimbatore';
  const eventName = settings.eventName || 'Dait Quiz Mastery';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const rankTitles = {
    1: 'FIRST PLACE CHAMPION (GOLD WINNER)',
    2: 'FIRST RUNNER UP (SILVER AWARD)',
    3: 'SECOND RUNNER UP (BRONZE AWARD)'
  };
  const rankDisplay = rankTitles[rank] || `RANK #${rank} DISTINCTION`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1150,height=820');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate of Excellence - ${winnerTeam || 'Championship Team'}</title>
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
              color: #1e1b4b;
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
              <div class="cert-dept">Department of Computer Science & Engineering &bull; National Technical Championship</div>
            </div>

            <div>
              <div class="cert-title-badge">CERTIFICATE OF EXCELLENCE & ACHIEVEMENT</div>
              <p class="cert-presented">This is to proudly certify that the esteemed technical members of</p>
              
              <div class="cert-winner-name">${winnerTeam || 'Championship Team'}</div>

              <p class="cert-desc">
                have demonstrated supreme technical mastery, intellectual acumen, and exemplary problem-solving skills in the inter-collegiate grand quiz tournament <b>${eventName} 2026</b>, competing across advanced Operating Systems, System Architecture, and Computer Science domains.
              </p>

              <div class="cert-stats-row">
                <span class="cert-stat-pill">🏆 Standing: <b>${rankDisplay}</b></span>
                <span class="cert-stat-pill">🎯 Official Score: <b>${score} Points</b></span>
                <span class="cert-stat-pill">⚡ Distinction: <b>High Technical Acumen</b></span>
              </div>
            </div>

            <div class="cert-footer">
              <div class="cert-sign-col">
                <div style="font-size: 13px; font-weight: 800; color: #0f172a; min-height: 22px;">${currentDate}</div>
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content certificate-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '920px', width: '95%', padding: '24px' }}>
        
        {/* Certificate Frame Preview */}
        <div 
          id="certificate-print-area" 
          style={{
            border: '10px double #d97706',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px 36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            color: '#1e293b'
          }}
        >
          <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
              {collegeName}
            </h2>
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '3px', color: '#d97706', textTransform: 'uppercase', marginTop: '2px' }}>
              COIMBATORE, TAMIL NADU
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '3px' }}>
              Department of Computer Science & Engineering &bull; National Technical Championship
            </div>
          </div>

          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fef08a', padding: '5px 22px', borderRadius: '999px', fontSize: '14px', fontWeight: 900, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', border: '1px solid #d97706' }}>
            CERTIFICATE OF EXCELLENCE & ACHIEVEMENT
          </div>
          
          <p style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', margin: '0 0 10px 0' }}>
            This is to proudly certify that the esteemed technical members of
          </p>

          <div style={{ fontSize: '32px', fontWeight: 900, color: '#1e1b4b', borderBottom: '3px solid #d97706', display: 'inline-block', padding: '0 32px 6px 32px', marginBottom: '14px', fontFamily: 'Georgia, serif' }}>
            {winnerTeam || 'Championship Team'}
          </div>

          <p style={{ fontSize: '14px', color: '#334155', maxWidth: '720px', margin: '0 auto 12px auto', lineHeight: '1.6' }}>
            have demonstrated supreme technical mastery, intellectual acumen, and exemplary problem-solving skills in the inter-collegiate grand quiz tournament <b>{eventName} 2026</b>, competing across advanced Operating Systems and Computer Science domains.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', margin: '12px 0 20px 0', flexWrap: 'wrap' }}>
            <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
              🏆 Standing: <b>{rankDisplay}</b>
            </span>
            <span style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
              🎯 Score: <b>{score} Points</b>
            </span>
            <span style={{ background: '#ecfdf5', border: '1px solid #10b981', color: '#065f46', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
              ⚡ High Technical Distinction
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 24px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center', width: '150px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', minHeight: '20px' }}>{currentDate}</div>
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

        {/* Action Controls */}
        <div className="modal-actions" style={{ justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
          <button className="btn btn-primary btn-lg pulse-glow" onClick={handlePrint} style={{ padding: '12px 32px', fontWeight: 900, borderRadius: '999px' }}>
            🖨️ Print / Save PDF Certificate
          </button>
          <button className="btn btn-outline btn-lg" onClick={onClose} style={{ borderRadius: '999px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
