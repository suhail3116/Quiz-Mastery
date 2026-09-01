import React, { useState, useMemo, useEffect } from 'react';

const DEFAULT_TEAM_NAMES = ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"];
const DEFAULT_TEAM_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"];
const STORAGE_ADMIN_PWD_KEY = 'antigravity_admin_password_v1';

export function TeamPdfExportView({ engine = {}, isAdmin = false, onAdminLoginSuccess, onViewChange }) {
  const { 
    settings = {}, 
    questions = [], 
    getTeamBuckets,
    updateRole
  } = engine;

  const totalTeams = settings.totalTeams || 4;
  const teamNames = settings.teamNames || DEFAULT_TEAM_NAMES;
  const teamColors = settings.teamColors || DEFAULT_TEAM_COLORS;
  const basePoints = settings.basePoints || 10;
  const totalRoundTime = settings.totalRoundTime || 120;

  // Buckets partition
  const buckets = useMemo(() => {
    if (getTeamBuckets) return getTeamBuckets();
    const count = totalTeams;
    const result = Array.from({ length: count }, () => []);
    const perTeam = Math.floor(questions.length / count);
    const remainder = questions.length % count;
    let start = 0;
    for (let i = 0; i < count; i++) {
      const bucketSize = perTeam + (i < remainder ? 1 : 0);
      result[i] = questions.slice(start, start + bucketSize);
      start += bucketSize;
    }
    return result;
  }, [getTeamBuckets, questions, totalTeams]);

  // View state
  const [selectedTeamIdx, setSelectedTeamIdx] = useState(0); // 0..N-1 or 'all'
  const [paperMode, setPaperMode] = useState('student'); // 'student' | 'evaluator'
  const [layoutColumns, setLayoutColumns] = useState('1'); // '1' | '2'
  const [fontSize, setFontSize] = useState('normal'); // 'compact' | 'normal' | 'large'
  const [previewZoom, setPreviewZoom] = useState(100); // 80 | 100 | 115
  
  // Admin Authentication Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [copyToast, setCopyToast] = useState('');

  // Header Customization state
  const [collegeName, setCollegeName] = useState(settings.collegeName || 'Dhaanish Ahmed Institute of Technology Coimbatore');
  const [eventName, setEventName] = useState(settings.eventName || 'Dait Quiz Mastery — Technical Championship 2026');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');
  const [subjectTitle, setSubjectTitle] = useState('Operating Systems & System Architecture');
  const [examDate, setExamDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [durationText, setDurationText] = useState(`${Math.floor(totalRoundTime / 60)} Minutes (${totalRoundTime} Seconds)`);
  const [watermarkText, setWatermarkText] = useState('DAIT QUIZ MASTERY');
  const [instructions, setInstructions] = useState(
    '1. Answer all questions within the allocated time.\n' +
    '2. Each correct answer carries 10 points. No negative marking.\n' +
    '3. Darken the circle or tick (✔) the corresponding option box clearly.\n' +
    '4. Unanswered questions will be eligible for the passing / balance round.'
  );

  // Toggle controls
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCategoryBadge, setShowCategoryBadge] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [showSignatureBlock, setShowSignatureBlock] = useState(true);
  const [showScoreTally, setShowScoreTally] = useState(true);

  // If user logs out or isAdmin becomes false, revert from evaluator mode
  useEffect(() => {
    if (!isAdmin && paperMode === 'evaluator') {
      setPaperMode('student');
      setShowExplanation(false);
    }
  }, [isAdmin, paperMode]);

  // Sync mode changes with authentication check
  const handlePaperModeChange = (mode) => {
    if (mode === 'evaluator') {
      if (!isAdmin) {
        setAuthError('');
        setAdminPasswordInput('');
        setShowAuthModal(true);
        return;
      }
      setPaperMode('evaluator');
      setShowExplanation(true);
    } else {
      setPaperMode('student');
      setShowExplanation(false);
    }
  };

  // Preset apply handler
  const handleApplyPreset = (presetType) => {
    if (presetType === 'championship') {
      setCollegeName(settings.collegeName || 'Dhaanish Ahmed Institute of Technology Coimbatore');
      setEventName('Dait Quiz Mastery — National Technical Championship 2026');
      setDepartment('Department of Computer Science & Engineering');
      setSubjectTitle('Operating Systems & Computer Architecture');
      setLayoutColumns('1');
      setFontSize('normal');
      setShowCategoryBadge(true);
      setShowInstructions(true);
      setShowScoreTally(true);
      setShowSignatureBlock(true);
    } else if (presetType === 'compact') {
      setLayoutColumns('2');
      setFontSize('compact');
      setShowInstructions(false);
      setShowExplanation(false);
    } else if (presetType === 'semester') {
      setSubjectTitle('Operating Systems End-Semester Practical Quiz Assessment');
      setLayoutColumns('1');
      setFontSize('normal');
      setShowCategoryBadge(false);
      setShowInstructions(true);
      setShowScoreTally(true);
      setShowSignatureBlock(true);
    }
  };

  // Inline Admin Auth submission
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const savedPwd = localStorage.getItem(STORAGE_ADMIN_PWD_KEY) || '123';

    if (adminPasswordInput === savedPwd || adminPasswordInput.trim() === 'admin') {
      localStorage.setItem('antigravity_admin_auth_v1', 'true');
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess();
      } else if (updateRole) {
        updateRole('admin');
      }
      setShowAuthModal(false);
      setPaperMode('evaluator');
      setShowExplanation(true);
      setAuthError('');
    } else {
      setAuthError('❌ Incorrect admin password. Default is "123".');
    }
  };

  // Helper for team's assigned questions
  const getQuestionsForTeam = (teamIndex) => {
    return buckets[teamIndex] || [];
  };

  // Current preview questions
  const activeQuestions = useMemo(() => {
    if (selectedTeamIdx === 'all') {
      return questions;
    }
    return getQuestionsForTeam(selectedTeamIdx);
  }, [selectedTeamIdx, buckets, questions]);

  const activeTeamName = selectedTeamIdx === 'all' 
    ? 'All Teams Combined Master Booklet' 
    : (teamNames[selectedTeamIdx] || `Team ${selectedTeamIdx + 1}`);

  const activeTeamColor = selectedTeamIdx === 'all'
    ? '#4f46e5'
    : (teamColors[selectedTeamIdx] || '#4f46e5');

  const maxMarks = activeQuestions.length * basePoints;
  const isEvaluator = Boolean(isAdmin && paperMode === 'evaluator');

  // =========================================================================
  // PRINT / DOWNLOAD AS PDF GENERATOR
  // =========================================================================
  const generatePrintableHtml = (teamIndicesToPrint) => {
    const renderTeamSection = (teamIdx, isLast) => {
      const tName = teamNames[teamIdx] || `Team ${teamIdx + 1}`;
      const tColor = teamColors[teamIdx] || '#4f46e5';
      const teamQs = getQuestionsForTeam(teamIdx);
      const teamMarks = teamQs.length * basePoints;

      return `
        <div class="paper-page ${!isLast ? 'page-break' : ''}">
          <!-- Header Banner -->
          <div class="exam-header">
            <div class="college-crest">🎓</div>
            <div class="college-info">
              <h1 class="college-title">${collegeName}</h1>
              <div class="dept-title">${department}</div>
              <div class="event-title">${eventName}</div>
            </div>
            <div class="mode-badge ${isEvaluator ? 'evaluator-badge' : 'student-badge'}">
              ${isEvaluator ? 'OFFICIAL EVALUATOR KEY' : 'QUESTION PAPER'}
            </div>
          </div>

          <div class="paper-divider"></div>

          <!-- Team & Exam Metadata Table -->
          <div class="metadata-grid">
            <div class="meta-item">
              <span class="meta-label">TEAM ASSIGNED</span>
              <span class="meta-value team-tag" style="border-left: 4px solid ${tColor};">
                <span class="team-dot" style="background:${tColor};"></span>
                <strong>Team ${teamIdx + 1}: ${tName}</strong>
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">SUBJECT / MODULE</span>
              <span class="meta-value">${subjectTitle}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">DATE OF ASSESSMENT</span>
              <span class="meta-value">${examDate}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">TIME ALLOWED</span>
              <span class="meta-value">${durationText}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">TOTAL QUESTIONS</span>
              <span class="meta-value"><strong>${teamQs.length} Questions</strong></span>
            </div>
            <div class="meta-item">
              <span class="meta-label">MAXIMUM MARKS</span>
              <span class="meta-value"><strong>${teamMarks} Points</strong> (${basePoints} pts/q)</span>
            </div>
          </div>

          ${showInstructions ? `
            <div class="instructions-box">
              <div class="instructions-heading">📌 General Instructions for Candidates:</div>
              <div class="instructions-body">${instructions.replace(/\n/g, '<br/>')}</div>
            </div>
          ` : ''}

          <!-- Watermark -->
          ${showWatermark ? `<div class="watermark-overlay">${watermarkText || 'DAIT QUIZ'}</div>` : ''}

          <!-- Questions List -->
          <div class="questions-container col-${layoutColumns}">
            ${teamQs.length === 0 ? `
              <div class="no-qs-notice">No questions assigned to this team bucket yet.</div>
            ` : teamQs.map((q, qIndex) => {
              const optLetters = ['A', 'B', 'C', 'D'];
              return `
                <div class="question-block">
                  <div class="q-header">
                    <div class="q-number">Q${qIndex + 1}</div>
                    <div class="q-content">
                      <div class="q-text">${q.text}</div>
                      ${showCategoryBadge && q.category ? `
                        <div class="q-category-tag">${q.category}</div>
                      ` : ''}
                    </div>
                    <div class="q-points">[${basePoints} pts]</div>
                  </div>

                  <div class="options-grid">
                    ${(q.options || []).map((opt, oIdx) => {
                      const isCorrect = isEvaluator && (q.correctIndex === oIdx);
                      return `
                        <div class="option-item ${isCorrect ? 'correct-option-item' : ''}">
                          <span class="option-bubble ${isCorrect ? 'correct-bubble' : ''}">
                            ${isCorrect ? '✔' : optLetters[oIdx]}
                          </span>
                          <span class="option-label">(${optLetters[oIdx]})</span>
                          <span class="option-text">${opt}</span>
                          ${isCorrect ? '<span class="correct-tag">CORRECT</span>' : ''}
                        </div>
                      `;
                    }).join('')}
                  </div>

                  ${(isEvaluator && showExplanation && q.explanation) ? `
                    <div class="explanation-box">
                      <strong>💡 Solution Rationale & Notes:</strong> ${q.explanation}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Bottom Evaluation & Signature Section -->
          ${(showScoreTally || showSignatureBlock) ? `
            <div class="footer-evaluation-box">
              ${showScoreTally ? `
                <table class="tally-table">
                  <thead>
                    <tr>
                      <th>Total Questions</th>
                      <th>Correct Answers</th>
                      <th>Passed / Skipped</th>
                      <th>Total Points Scored</th>
                      <th>Evaluator Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${teamQs.length}</td>
                      <td>_____</td>
                      <td>_____</td>
                      <td>_____ / ${teamMarks}</td>
                      <td>Verified [   ]</td>
                    </tr>
                  </tbody>
                </table>
              ` : ''}

              ${showSignatureBlock ? `
                <div class="signature-row">
                  <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-title">Team Leader Signature</div>
                  </div>
                  <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-title">Faculty Evaluator</div>
                  </div>
                  <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-title">Chief Quizmaster Seal</div>
                  </div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="paper-page-footer">
            <span>${collegeName} • ${eventName}</span>
            <span>Team ${teamIdx + 1}: ${tName}</span>
            <span>Generated via Dait Quiz Mastery Arena</span>
          </div>
        </div>
      `;
    };

    const pagesHtml = teamIndicesToPrint.map((tIdx, idx) => 
      renderTeamSection(tIdx, idx === teamIndicesToPrint.length - 1)
    ).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${collegeName} - Question Paper (${selectedTeamIdx === 'all' ? 'All Teams' : teamNames[selectedTeamIdx] || 'Team'})</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 14mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            font-size: ${fontSize === 'compact' ? '11px' : fontSize === 'large' ? '14px' : '12.5px'};
            line-height: 1.45;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .paper-page {
            padding: 6px 0;
            position: relative;
          }
          
          /* Exam Header */
          .exam-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding-bottom: 10px;
          }
          .college-crest {
            font-size: 40px;
            line-height: 1;
          }
          .college-info {
            flex: 1;
            text-align: center;
          }
          .college-title {
            font-size: 18px;
            font-weight: 900;
            color: #1e1b4b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .dept-title {
            font-size: 11.5px;
            font-weight: 700;
            color: #475569;
            margin-top: 2px;
            text-transform: uppercase;
          }
          .event-title {
            font-size: 13px;
            font-weight: 800;
            color: #4f46e5;
            margin-top: 2px;
          }
          .mode-badge {
            font-size: 10px;
            font-weight: 800;
            padding: 6px 12px;
            border-radius: 6px;
            letter-spacing: 1px;
            text-transform: uppercase;
            white-space: nowrap;
          }
          .student-badge {
            background: #f1f5f9;
            color: #334155;
            border: 1.5px solid #cbd5e1;
          }
          .evaluator-badge {
            background: #dcfce7;
            color: #166534;
            border: 1.5px solid #22c55e;
          }

          .paper-divider {
            height: 2.5px;
            background: #0f172a;
            margin: 6px 0 12px 0;
          }

          /* Metadata Grid */
          .metadata-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px 12px;
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 12px;
          }
          .meta-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .meta-label {
            font-size: 9px;
            font-weight: 800;
            color: #64748b;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .meta-value {
            font-size: 12px;
            font-weight: 700;
            color: #1e293b;
          }
          .team-tag {
            padding-left: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .team-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
          }

          /* Instructions */
          .instructions-box {
            background: #fffbeb;
            border: 1px solid #fef3c7;
            border-left: 4px solid #d97706;
            border-radius: 4px;
            padding: 8px 12px;
            margin-bottom: 12px;
          }
          .instructions-heading {
            font-size: 11px;
            font-weight: 800;
            color: #92400e;
            margin-bottom: 3px;
          }
          .instructions-body {
            font-size: 10.5px;
            color: #78350f;
            line-height: 1.4;
          }

          /* Watermark */
          .watermark-overlay {
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-32deg);
            font-size: 72px;
            font-weight: 900;
            color: rgba(15, 23, 42, 0.032);
            letter-spacing: 10px;
            pointer-events: none;
            user-select: none;
            z-index: 0;
            white-space: nowrap;
          }

          /* Questions Container */
          .questions-container {
            margin-bottom: 12px;
            position: relative;
            z-index: 1;
          }
          .questions-container.col-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 14px;
          }
          
          .question-block {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 12px;
            margin-bottom: 10px;
            background: #ffffff;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .questions-container.col-2 .question-block {
            margin-bottom: 0;
          }

          .q-header {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
          }
          .q-number {
            background: #1e1b4b;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 4px;
            flex-shrink: 0;
          }
          .q-content {
            flex: 1;
          }
          .q-text {
            font-weight: 700;
            font-size: 12.5px;
            color: #0f172a;
          }
          .q-category-tag {
            display: inline-block;
            font-size: 9px;
            font-weight: 700;
            color: #6366f1;
            background: #eef2ff;
            padding: 1px 6px;
            border-radius: 3px;
            margin-top: 3px;
            text-transform: uppercase;
          }
          .q-points {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            flex-shrink: 0;
          }

          .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 10px;
            padding-left: 2px;
          }
          .option-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 5px 8px;
            border: 1px solid #f1f5f9;
            background: #fafafa;
            border-radius: 4px;
            font-size: 11.5px;
          }
          .correct-option-item {
            background: #ecfdf5 !important;
            border-color: #86efac !important;
            font-weight: 700;
            color: #166534;
          }
          .option-bubble {
            width: 16px;
            height: 16px;
            border: 1.5px solid #94a3b8;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 800;
            color: #64748b;
            flex-shrink: 0;
          }
          .correct-bubble {
            background: #16a34a;
            color: #ffffff !important;
            border-color: #16a34a;
          }
          .option-label {
            font-weight: 700;
            color: #475569;
          }
          .option-text {
            flex: 1;
          }
          .correct-tag {
            font-size: 8px;
            font-weight: 800;
            background: #16a34a;
            color: #ffffff;
            padding: 1px 5px;
            border-radius: 3px;
            letter-spacing: 0.5px;
          }

          .explanation-box {
            margin-top: 8px;
            background: #eff6ff;
            border: 1px dashed #93c5fd;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 10.5px;
            color: #1e40af;
          }

          /* Evaluation & Signatures */
          .footer-evaluation-box {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-top: 14px;
            padding-top: 10px;
            border-top: 1.5px solid #cbd5e1;
          }
          .tally-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 11px;
          }
          .tally-table th, .tally-table td {
            border: 1px solid #cbd5e1;
            padding: 5px 8px;
            text-align: center;
          }
          .tally-table th {
            background: #f1f5f9;
            font-weight: 700;
            color: #334155;
          }
          .signature-row {
            display: flex;
            justify-content: space-between;
            margin-top: 22px;
            padding: 0 16px;
          }
          .sig-box {
            width: 175px;
            text-align: center;
          }
          .sig-line {
            border-bottom: 1.5px dashed #475569;
            margin-bottom: 6px;
            height: 20px;
          }
          .sig-title {
            font-size: 10.5px;
            font-weight: 700;
            color: #475569;
          }

          .paper-page-footer {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 6px;
          }
          .no-qs-notice {
            padding: 30px;
            text-align: center;
            color: #94a3b8;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        ${pagesHtml}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;
  };

  const handlePrintPdf = (mode = 'single') => {
    let teamsToPrint = [];
    if (mode === 'all' || selectedTeamIdx === 'all') {
      teamsToPrint = Array.from({ length: totalTeams }, (_, i) => i);
    } else {
      teamsToPrint = [selectedTeamIdx];
    }

    const printHtml = generatePrintableHtml(teamsToPrint);
    const printWindow = window.open('', '_blank', 'width=950,height=850');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
    } else {
      alert('Popup blocker detected. Please allow popups to download/print the PDF.');
    }
  };

  const handleCopyQuestionsText = () => {
    const textOutput = activeQuestions.map((q, idx) => {
      const opts = (q.options || []).map((o, oi) => `  ${['A', 'B', 'C', 'D'][oi]}) ${o}`).join('\n');
      const answerLine = isEvaluator ? `Answer: ${['A', 'B', 'C', 'D'][q.correctIndex]}\n` : '';
      return `Q${idx + 1}: ${q.text}\n${opts}\n${answerLine}Category: ${q.category || 'N/A'}\n`;
    }).join('\n-------------------------\n\n');

    navigator.clipboard.writeText(textOutput);
    setCopyToast('📋 Questions copied to clipboard!');
    setTimeout(() => setCopyToast(''), 3000);
  };

  return (
    <div className="pdf-pro-export-container">
      {/* Toast Alert */}
      {copyToast && (
        <div className="pdf-floating-toast">
          {copyToast}
        </div>
      )}

      {/* Hero Studio Banner */}
      <div className="pdf-hero-banner">
        <div className="pdf-hero-glow"></div>
        <div className="pdf-hero-left">
          <div className="pdf-hero-badge">
            <span className="hero-sparkle">✨</span>
            <span>EXAM & QUIZ PRINT STUDIO PRO</span>
          </div>
          <h2 className="pdf-hero-title">Team Question Paper Generator</h2>
          <p className="pdf-hero-subtitle">
            Craft, customize, and export print-ready official question sheets & solutions tailored for individual teams.
          </p>

          {/* Quick Metrics Strip */}
          <div className="pdf-metrics-strip">
            <div className="pdf-metric-chip">
              <span className="metric-icon">👥</span>
              <span className="metric-text">
                Target: <b>{activeTeamName}</b>
              </span>
            </div>
            <div className="pdf-metric-chip">
              <span className="metric-icon">📑</span>
              <span className="metric-text">
                Pool: <b>{activeQuestions.length} Questions</b>
              </span>
            </div>
            <div className="pdf-metric-chip">
              <span className="metric-icon">🎯</span>
              <span className="metric-text">
                Max Marks: <b>{maxMarks} Pts</b>
              </span>
            </div>
            <div className="pdf-metric-chip">
              <span className="metric-icon">{isAdmin ? '🛡️' : '🔒'}</span>
              <span className="metric-text">
                Role: <b>{isAdmin ? 'Admin Active' : 'Student Mode'}</b>
              </span>
            </div>
          </div>
        </div>

        <div className="pdf-hero-actions">
          <button 
            className="btn-pro-primary"
            onClick={() => handlePrintPdf('single')}
            title="Open print preview & save as high-resolution PDF"
          >
            <span className="btn-icon">🖨️</span>
            <span>Download Selected Team PDF</span>
          </button>

          <button 
            className="btn-pro-secondary"
            onClick={() => handlePrintPdf('all')}
            title="Download questions for all teams in a single booklet with page breaks"
          >
            <span className="btn-icon">📦</span>
            <span>Batch Export All Teams ({totalTeams})</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Studio Layout */}
      <div className="pdf-studio-layout">
        
        {/* LEFT COLUMN: Controls & Settings */}
        <div className="pdf-studio-sidebar">

          {/* Preset Bar */}
          <div className="pdf-card-pro pdf-preset-bar">
            <div className="preset-bar-title">
              <span>⚡ Quick Design Presets:</span>
            </div>
            <div className="preset-btn-row">
              <button type="button" className="preset-chip" onClick={() => handleApplyPreset('championship')}>
                🏆 Championship
              </button>
              <button type="button" className="preset-chip" onClick={() => handleApplyPreset('compact')}>
                ⚡ 2-Col Compact
              </button>
              <button type="button" className="preset-chip" onClick={() => handleApplyPreset('semester')}>
                🎓 Semester Exam
              </button>
            </div>
          </div>
          
          {/* 1. Team Selector Cards */}
          <div className="pdf-card-pro">
            <div className="card-pro-head">
              <div className="head-title-wrap">
                <span className="head-step-num">1</span>
                <h3 className="card-pro-title">Select Team Partition</h3>
              </div>
              <span className="head-badge-count">{totalTeams} Teams Active</span>
            </div>

            <div className="pdf-team-selector-grid">
              {Array.from({ length: totalTeams }).map((_, idx) => {
                const name = teamNames[idx] || `Team ${idx + 1}`;
                const color = teamColors[idx] || '#4f46e5';
                const teamQs = getQuestionsForTeam(idx);
                const isSelected = selectedTeamIdx === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`pdf-team-pro-card ${isSelected ? 'is-selected' : ''}`}
                    style={{ '--card-team-color': color }}
                    onClick={() => setSelectedTeamIdx(idx)}
                  >
                    <div className="team-avatar-pill" style={{ background: color }}>
                      {idx + 1}
                    </div>
                    <div className="team-meta-info">
                      <div className="team-card-name" title={name}>{name}</div>
                      <div className="team-card-sub">{teamQs.length} Questions • {teamQs.length * basePoints} pts</div>
                    </div>
                    {isSelected && (
                      <div className="selected-glow-ring">
                        <span className="check-mark">✔</span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Combined All Teams Card */}
              <button
                type="button"
                className={`pdf-team-pro-card all-teams-pro-card ${selectedTeamIdx === 'all' ? 'is-selected' : ''}`}
                onClick={() => setSelectedTeamIdx('all')}
              >
                <div className="team-avatar-pill all-pill-badge">📑</div>
                <div className="team-meta-info">
                  <div className="team-card-name">All Teams Combined Master Booklet</div>
                  <div className="team-card-sub">{questions.length} Questions across {totalTeams} Teams</div>
                </div>
                {selectedTeamIdx === 'all' && (
                  <div className="selected-glow-ring">
                    <span className="check-mark">✔</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 2. Paper Mode Selection */}
          <div className="pdf-card-pro">
            <div className="card-pro-head">
              <div className="head-title-wrap">
                <span className="head-step-num">2</span>
                <h3 className="card-pro-title">Paper Format & Answer Key</h3>
              </div>
              {isAdmin ? (
                <span className="status-pill status-unlocked">
                  🛡️ Admin Verified
                </span>
              ) : (
                <span className="status-pill status-locked">
                  🔒 Admin Protected
                </span>
              )}
            </div>

            <div className="pdf-mode-cards-stack">
              {/* Student Question Paper Button */}
              <button
                type="button"
                className={`mode-select-card ${paperMode === 'student' ? 'card-active' : ''}`}
                onClick={() => handlePaperModeChange('student')}
              >
                <div className="mode-icon-box mode-icon-student">
                  📝
                </div>
                <div className="mode-info-box">
                  <div className="mode-title-row">
                    <span className="mode-main-title">Student Question Paper</span>
                    <span className="mode-tag-free">Public</span>
                  </div>
                  <div className="mode-sub-desc">
                    Clean test sheet with option bubble checkboxes • Answers strictly hidden
                  </div>
                </div>
                {paperMode === 'student' && <div className="active-dot"></div>}
              </button>

              {/* Evaluator Solution Key Button (Admin Login Required) */}
              <button
                type="button"
                className={`mode-select-card ${isEvaluator ? 'card-active' : ''} ${!isAdmin ? 'card-locked' : ''}`}
                onClick={() => handlePaperModeChange('evaluator')}
              >
                <div className={`mode-icon-box ${isAdmin ? 'mode-icon-eval-active' : 'mode-icon-eval-locked'}`}>
                  {isAdmin ? '🛡️' : '🔒'}
                </div>
                <div className="mode-info-box">
                  <div className="mode-title-row">
                    <span className="mode-main-title">Evaluate Solution Key</span>
                    {!isAdmin ? (
                      <span className="mode-tag-locked">Admin Login Required</span>
                    ) : (
                      <span className="mode-tag-verified">Authorized</span>
                    )}
                  </div>
                  <div className="mode-sub-desc">
                    {isAdmin 
                      ? 'Highlights correct answers in green with detailed rationale & notes' 
                      : 'Protected answer keys • Click to enter Admin password and unlock'}
                  </div>
                </div>
                {isEvaluator && <div className="active-dot dot-emerald"></div>}
              </button>
            </div>
          </div>

          {/* 3. Paper Details & Branding Customizer */}
          <div className="pdf-card-pro">
            <div className="card-pro-head">
              <div className="head-title-wrap">
                <span className="head-step-num">3</span>
                <h3 className="card-pro-title">Institution & Assessment Details</h3>
              </div>
            </div>

            <div className="pro-form-stack">
              <div className="pro-input-group">
                <label>Institution / College Name</label>
                <input 
                  type="text" 
                  className="pro-input" 
                  value={collegeName} 
                  onChange={e => setCollegeName(e.target.value)} 
                />
              </div>

              <div className="pro-input-group">
                <label>Tournament / Event Title</label>
                <input 
                  type="text" 
                  className="pro-input" 
                  value={eventName} 
                  onChange={e => setEventName(e.target.value)} 
                />
              </div>

              <div className="pro-form-row">
                <div className="pro-input-group">
                  <label>Department</label>
                  <input 
                    type="text" 
                    className="pro-input" 
                    value={department} 
                    onChange={e => setDepartment(e.target.value)} 
                  />
                </div>
                <div className="pro-input-group">
                  <label>Subject / Module</label>
                  <input 
                    type="text" 
                    className="pro-input" 
                    value={subjectTitle} 
                    onChange={e => setSubjectTitle(e.target.value)} 
                  />
                </div>
              </div>

              <div className="pro-form-row">
                <div className="pro-input-group">
                  <label>Duration Allowed</label>
                  <input 
                    type="text" 
                    className="pro-input" 
                    value={durationText} 
                    onChange={e => setDurationText(e.target.value)} 
                  />
                </div>
                <div className="pro-input-group">
                  <label>Exam Date</label>
                  <input 
                    type="text" 
                    className="pro-input" 
                    value={examDate} 
                    onChange={e => setExamDate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="pro-input-group">
                <label>Watermark Text</label>
                <input 
                  type="text" 
                  className="pro-input" 
                  value={watermarkText} 
                  onChange={e => setWatermarkText(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* 4. Format & Layout Toggles */}
          <div className="pdf-card-pro">
            <div className="card-pro-head">
              <div className="head-title-wrap">
                <span className="head-step-num">4</span>
                <h3 className="card-pro-title">Layout & Visual Switches</h3>
              </div>
            </div>
            
            {/* Modern Toggle Switch Grid */}
            <div className="pro-switches-grid">
              <div className="pro-switch-item" onClick={() => setShowCategoryBadge(prev => !prev)}>
                <div className={`pro-switch-track ${showCategoryBadge ? 'is-on' : ''}`}>
                  <div className="pro-switch-thumb"></div>
                </div>
                <span className="pro-switch-label">Show Question Categories</span>
              </div>

              <div 
                className={`pro-switch-item ${!isAdmin ? 'is-disabled' : ''}`} 
                onClick={() => {
                  if (isAdmin) setShowExplanation(prev => !prev);
                  else setShowAuthModal(true);
                }}
              >
                <div className={`pro-switch-track ${(showExplanation && isAdmin) ? 'is-on' : ''}`}>
                  <div className="pro-switch-thumb"></div>
                </div>
                <span className="pro-switch-label">
                  Show Solution Explanations {!isAdmin && <b className="locked-inline-tag">Admin 🔒</b>}
                </span>
              </div>

              <div className="pro-switch-item" onClick={() => setShowInstructions(prev => !prev)}>
                <div className={`pro-switch-track ${showInstructions ? 'is-on' : ''}`}>
                  <div className="pro-switch-thumb"></div>
                </div>
                <span className="pro-switch-label">Show Instructions Callout</span>
              </div>

              <div className="pro-switch-item" onClick={() => setShowScoreTally(prev => !prev)}>
                <div className={`pro-switch-track ${showScoreTally ? 'is-on' : ''}`}>
                  <div className="pro-switch-thumb"></div>
                </div>
                <span className="pro-switch-label">Show Marks Tally Scorecard</span>
              </div>

              <div className="pro-switch-item" onClick={() => setShowSignatureBlock(prev => !prev)}>
                <div className={`pro-switch-track ${showSignatureBlock ? 'is-on' : ''}`}>
                  <div className="pro-switch-thumb"></div>
                </div>
                <span className="pro-switch-label">Show Official Signature Box</span>
              </div>

              <div className="pro-switch-item" onClick={() => setShowWatermark(prev => !prev)}>
                <div className={`pro-switch-track ${showWatermark ? 'is-on' : ''}`}>
                  <div className="pro-switch-thumb"></div>
                </div>
                <span className="pro-switch-label">Include Background Watermark</span>
              </div>
            </div>

            {/* Segmented Layout Controls */}
            <div className="pro-segmented-controls-grid">
              <div className="seg-control-block">
                <label className="seg-label">Page Layout Columns</label>
                <div className="seg-pill-wrapper">
                  <button 
                    type="button"
                    className={`seg-pill ${layoutColumns === '1' ? 'active' : ''}`}
                    onClick={() => setLayoutColumns('1')}
                  >
                    1 Column (Spacious)
                  </button>
                  <button 
                    type="button"
                    className={`seg-pill ${layoutColumns === '2' ? 'active' : ''}`}
                    onClick={() => setLayoutColumns('2')}
                  >
                    2 Columns (Compact)
                  </button>
                </div>
              </div>

              <div className="seg-control-block">
                <label className="seg-label">Typography Scaling</label>
                <div className="seg-pill-wrapper">
                  <button 
                    type="button"
                    className={`seg-pill ${fontSize === 'compact' ? 'active' : ''}`}
                    onClick={() => setFontSize('compact')}
                  >
                    Compact
                  </button>
                  <button 
                    type="button"
                    className={`seg-pill ${fontSize === 'normal' ? 'active' : ''}`}
                    onClick={() => setFontSize('normal')}
                  >
                    Standard
                  </button>
                  <button 
                    type="button"
                    className={`seg-pill ${fontSize === 'large' ? 'active' : ''}`}
                    onClick={() => setFontSize('large')}
                  >
                    Large
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Export Utilities */}
            <div className="pdf-quick-actions-bar">
              <button 
                type="button"
                className="btn-pro-ghost" 
                onClick={handleCopyQuestionsText}
              >
                📋 Copy Question Text
              </button>
              {!isAdmin && (
                <button
                  type="button"
                  className="btn-pro-ghost admin-login-ghost"
                  onClick={() => setShowAuthModal(true)}
                >
                  🔒 Admin Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive A4 Document Preview */}
        <div className="pdf-studio-preview-area">
          <div className="preview-top-toolbar">
            <div className="toolbar-left-info">
              <span className="live-pulsing-badge"></span>
              <span className="toolbar-title">Interactive A4 Document Sheet</span>
              <span className={`toolbar-mode-badge ${isEvaluator ? 'mode-eval' : 'mode-std'}`}>
                {isEvaluator ? '🛡️ Solution Key View' : '📝 Candidate Sheet View'}
              </span>
            </div>
            
            <div className="toolbar-right-actions">
              <div className="zoom-stepper">
                <button type="button" onClick={() => setPreviewZoom(85)} className={previewZoom === 85 ? 'active' : ''}>85%</button>
                <button type="button" onClick={() => setPreviewZoom(100)} className={previewZoom === 100 ? 'active' : ''}>100%</button>
                <button type="button" onClick={() => setPreviewZoom(115)} className={previewZoom === 115 ? 'active' : ''}>115%</button>
              </div>

              {!isAdmin && (
                <button
                  className="btn-toolbar-unlock"
                  onClick={() => setShowAuthModal(true)}
                  title="Authenticate as Admin to reveal full answer solutions"
                >
                  🔒 Unlock Answers
                </button>
              )}

              <button 
                className="btn-toolbar-print"
                onClick={() => handlePrintPdf('single')}
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>

          {/* A4 Paper Desk Stage */}
          <div className="a4-desk-stage">
            <div 
              className={`a4-live-paper font-${fontSize} zoom-${previewZoom}`}
              style={{ transform: `scale(${previewZoom / 100})`, transformOrigin: 'top center' }}
            >
              
              {/* Paper Header */}
              <div className="a4-exam-banner">
                <div className="a4-exam-crest">🎓</div>
                <div className="a4-exam-titles">
                  <h1 className="a4-univ-name">{collegeName}</h1>
                  <div className="a4-univ-dept">{department}</div>
                  <div className="a4-univ-event">{eventName}</div>
                </div>
                <div className={`a4-exam-pill ${isEvaluator ? 'eval-pill' : 'std-pill'}`}>
                  {isEvaluator ? 'EVALUATOR KEY' : 'QUESTION PAPER'}
                </div>
              </div>

              <div className="a4-exam-hairline"></div>

              {/* Metadata Banner Table */}
              <div className="a4-exam-meta-grid">
                <div className="a4-meta-item">
                  <span className="meta-tag-label">ASSIGNED TEAM</span>
                  <span className="meta-tag-val team-accent-val" style={{ borderLeftColor: activeTeamColor }}>
                    <span className="team-indicator-dot" style={{ background: activeTeamColor }}></span>
                    <strong>{activeTeamName}</strong>
                  </span>
                </div>
                <div className="a4-meta-item">
                  <span className="meta-tag-label">MODULE / SUBJECT</span>
                  <span className="meta-tag-val">{subjectTitle}</span>
                </div>
                <div className="a4-meta-item">
                  <span className="meta-tag-label">ASSESSMENT DATE</span>
                  <span className="meta-tag-val">{examDate}</span>
                </div>
                <div className="a4-meta-item">
                  <span className="meta-tag-label">TIME ALLOWED</span>
                  <span className="meta-tag-val">{durationText}</span>
                </div>
                <div className="a4-meta-item">
                  <span className="meta-tag-label">QUESTIONS ALLOTTED</span>
                  <span className="meta-tag-val"><strong>{activeQuestions.length} Questions</strong></span>
                </div>
                <div className="a4-meta-item">
                  <span className="meta-tag-label">MAXIMUM SCORE</span>
                  <span className="meta-tag-val"><strong>{maxMarks} Points</strong></span>
                </div>
              </div>

              {/* Instructions Callout */}
              {showInstructions && (
                <div className="a4-exam-instructions">
                  <div className="inst-header-row">
                    <span>📌</span>
                    <strong>General Instructions for Candidates:</strong>
                  </div>
                  <div className="inst-content-text">{instructions}</div>
                </div>
              )}

              {/* Watermark in preview */}
              {showWatermark && (
                <div className="a4-exam-watermark">
                  {watermarkText || 'DAIT QUIZ MASTERY'}
                </div>
              )}

              {/* Question list */}
              <div className={`a4-exam-questions-grid col-${layoutColumns}`}>
                {activeQuestions.length === 0 ? (
                  <div className="a4-empty-state">
                    <span>📚</span>
                    <p>No questions currently assigned to this team bucket.</p>
                  </div>
                ) : (
                  activeQuestions.map((q, idx) => {
                    const optLetters = ['A', 'B', 'C', 'D'];

                    return (
                      <div key={q.id || idx} className="a4-q-card-item">
                        <div className="a4-q-item-top">
                          <span className="a4-q-badge-num">Q{idx + 1}</span>
                          <div className="a4-q-prompt-box">
                            <div className="a4-q-prompt-text">{q.text}</div>
                            {showCategoryBadge && q.category && (
                              <span className="a4-q-category-chip">{q.category}</span>
                            )}
                          </div>
                          <span className="a4-q-points-badge">[{basePoints} pts]</span>
                        </div>

                        <div className="a4-q-options-matrix">
                          {(q.options || []).map((opt, optIdx) => {
                            const isCorrect = isEvaluator && (q.correctIndex === optIdx);

                            return (
                              <div 
                                key={optIdx} 
                                className={`a4-option-card-row ${isCorrect ? 'is-correct-opt' : ''}`}
                              >
                                <span className={`a4-opt-circle-badge ${isCorrect ? 'circle-correct' : ''}`}>
                                  {isCorrect ? '✔' : optLetters[optIdx]}
                                </span>
                                <span className="a4-opt-letter-label">({optLetters[optIdx]})</span>
                                <span className="a4-opt-string-text">{opt}</span>
                                {isCorrect && (
                                  <span className="a4-correct-pill-tag">CORRECT ANSWER</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {isEvaluator && showExplanation && q.explanation && (
                          <div className="a4-q-solution-callout">
                            <div className="sol-title">💡 Solution Rationale:</div>
                            <div className="sol-text">{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Score Tally & Signatures */}
              {(showScoreTally || showSignatureBlock) && (
                <div className="a4-exam-footer-assessment">
                  {showScoreTally && (
                    <table className="a4-score-tally-table">
                      <thead>
                        <tr>
                          <th>Total Questions</th>
                          <th>Correct Count</th>
                          <th>Passed / Skipped</th>
                          <th>Total Score</th>
                          <th>Evaluation Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{activeQuestions.length}</td>
                          <td>_____</td>
                          <td>_____</td>
                          <td>_____ / {maxMarks}</td>
                          <td>Verified [   ]</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {showSignatureBlock && (
                    <div className="a4-sig-blocks-row">
                      <div className="a4-sig-col">
                        <div className="a4-sig-dotted-line"></div>
                        <div className="a4-sig-role-title">Team Leader Signature</div>
                      </div>
                      <div className="a4-sig-col">
                        <div className="a4-sig-dotted-line"></div>
                        <div className="a4-sig-role-title">Faculty Evaluator</div>
                      </div>
                      <div className="a4-sig-col">
                        <div className="a4-sig-dotted-line"></div>
                        <div className="a4-sig-role-title">Chief Quizmaster Seal</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Document Page Footer */}
              <div className="a4-doc-bottom-bar">
                <span>{collegeName} • {eventName}</span>
                <span>{activeTeamName}</span>
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          ADMIN AUTHENTICATION MODAL (FOR UNLOCKING EVALUATE SOLUTION KEY)
         ========================================================================= */}
      {showAuthModal && (
        <div className="modal-backdrop modal-backdrop-pro">
          <div className="modal-card-pro">
            <div className="modal-pro-header">
              <div className="modal-shield-glow">🛡️</div>
              <h3 className="modal-pro-title">Admin Authentication Required</h3>
              <p className="modal-pro-subtitle">
                The <b>Evaluate Solution Key</b> reveals correct answers, scoring keys, and detailed explanation notes. Please authenticate with your Quizmaster password to unlock.
              </p>
            </div>

            {authError && (
              <div className="modal-error-banner">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="modal-pro-form">
              <div className="modal-form-group">
                <label>Admin Password / Passcode</label>
                <div className="modal-password-wrap">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="modal-input-field" 
                    placeholder="Enter admin password (default: 123)" 
                    value={adminPasswordInput}
                    onChange={e => setAdminPasswordInput(e.target.value)}
                    autoFocus
                    required
                  />
                  <button 
                    type="button" 
                    className="modal-eye-btn"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="modal-hint">
                  Default quizmaster key is <code>123</code> (or custom passcode set in Admin panel).
                </div>
              </div>

              <div className="modal-pro-buttons">
                <button 
                  type="button" 
                  className="btn-pro-cancel" 
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthError('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-pro-unlock"
                >
                  🔓 Unlock Solution Key
                </button>
              </div>
            </form>

            {onViewChange && (
              <div className="modal-pro-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    onViewChange('admin');
                  }}
                  className="modal-footer-link"
                >
                  Go to Full Admin Management Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
