/**
 * Antigravity Quiz App - Main UI Coordinator & Arena View Controller
 */

class AppController {
  constructor(state, eng, adm, snd, conf) {
    this.state = state;
    this.engine = eng;
    this.admin = adm;
    this.sounds = snd;
    this.confetti = conf;
    this.currentView = 'arena'; // 'login' | 'arena' | 'admin' | 'leaderboard'
  }

  init() {
    this.confetti.init();
    this.admin.init();
    this.bindGlobalEvents();

    // Subscribe to state updates to re-render UI automatically
    this.state.subscribe((type, data) => this.handleStateChange(type, data));

    // Initial render
    this.renderRoleBadge();
    this.renderArena();
    this.renderScoreboard();
  }

  bindGlobalEvents() {
    // Navigation tabs
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-view-target');
        this.switchView(target);
      });
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger when typing in inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state.gameState.status === 'playing') {
          this.engine.pauseQuiz();
        } else if (this.state.gameState.status === 'paused') {
          this.engine.resumeQuiz();
        }
      } else if (e.key === 's' || e.key === 'S') {
        if (this.state.gameState.status === 'playing') {
          this.engine.skipQuestion();
        }
      } else if (e.key === 'n' || e.key === 'N') {
        if (['answered', 'exhausted'].includes(this.state.gameState.status)) {
          this.engine.nextQuestion();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        const nextState = !this.sounds.enabled;
        this.sounds.setEnabled(nextState);
        const toggle = document.getElementById('settingSoundToggle');
        if (toggle) toggle.checked = nextState;
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        if (this.state.gameState.status === 'playing') {
          const optIdx = parseInt(e.key, 10) - 1;
          this.selectOption(optIdx);
        }
      }
    });
  }

  switchView(viewName) {
    this.currentView = viewName;
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('[data-view-target]').forEach(el => el.classList.remove('active'));

    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) targetEl.classList.add('active');

    const navBtn = document.querySelector(`[data-view-target="${viewName}"]`);
    if (navBtn) navBtn.classList.add('active');

    if (viewName === 'arena') {
      this.renderArena();
      this.renderScoreboard();
    } else if (viewName === 'admin') {
      this.admin.renderSettingsForm();
      this.admin.renderQuestionList();
      this.admin.renderScoreOverrides();
    } else if (viewName === 'leaderboard') {
      this.renderLeaderboardView();
    }
  }

  setRole(roleName) {
    this.state.setUserRole(roleName);
    this.renderRoleBadge();
    this.switchView('arena');
  }

  renderRoleBadge() {
    const badge = document.getElementById('currentRoleBadge');
    if (!badge) return;

    const role = this.state.userRole;
    if (role === 'admin') {
      badge.innerHTML = '🛡️ Quizmaster (Admin)';
      badge.className = 'role-badge role-admin';
    } else if (role.startsWith('team')) {
      const tIdx = parseInt(role.replace('team', ''), 10) - 1;
      const tName = this.state.settings.teamNames[tIdx] || `Team ${tIdx + 1}`;
      badge.innerHTML = `👥 ${this.escapeHtml(tName)}`;
      badge.className = 'role-badge role-team';
    } else {
      badge.innerHTML = '📺 Arena Projector';
      badge.className = 'role-badge role-projector';
    }
  }

  handleStateChange(type, data) {
    this.renderScoreboard();
    if (this.currentView === 'arena') {
      this.renderArena();
    } else if (this.currentView === 'leaderboard') {
      this.renderLeaderboardView();
    } else if (this.currentView === 'admin') {
      this.admin.renderScoreOverrides();
    }
  }

  renderScoreboard() {
    const container = document.getElementById('headerScoreboard');
    if (!container) return;

    const s = this.state.settings;
    const g = this.state.gameState;
    const count = s.totalTeams;

    let html = '';
    for (let i = 0; i < count; i++) {
      const name = s.teamNames[i] || `Team ${i + 1}`;
      const color = s.teamColors[i] || '#3b82f6';
      const score = g.scores[i] || 0;
      const isActive = g.status === 'playing' && g.activeTeamIndex === i;

      html += `
        <div class="team-score-card ${isActive ? 'active-turn' : ''}" style="--team-color: ${color}">
          <div class="team-avatar" style="background: ${color}">
            ${i + 1}
          </div>
          <div class="team-info">
            <div class="team-name">${this.escapeHtml(name)}</div>
            <div class="team-points">${score} <span class="pts-label">pts</span></div>
          </div>
          ${isActive ? '<div class="turn-pulse-indicator"></div>' : ''}
        </div>
      `;
    }

    container.innerHTML = html;
  }

  renderArena() {
    const g = this.state.gameState;
    const s = this.state.settings;
    const questions = this.state.questions;

    // Arena container views
    const idleScreen = document.getElementById('arenaIdleScreen');
    const activeScreen = document.getElementById('arenaActiveScreen');
    const completeScreen = document.getElementById('arenaCompleteScreen');

    if (g.status === 'idle') {
      if (idleScreen) idleScreen.style.display = 'block';
      if (activeScreen) activeScreen.style.display = 'none';
      if (completeScreen) completeScreen.style.display = 'none';
      return;
    } else if (g.status === 'completed') {
      if (idleScreen) idleScreen.style.display = 'none';
      if (activeScreen) activeScreen.style.display = 'none';
      if (completeScreen) completeScreen.style.display = 'block';
      this.renderCompleteScreen();
      return;
    }

    if (idleScreen) idleScreen.style.display = 'none';
    if (activeScreen) activeScreen.style.display = 'block';
    if (completeScreen) completeScreen.style.display = 'none';

    const currentQ = questions[g.currentQuestionIndex];
    if (!currentQ) return;

    // 1. Question Meta & Header
    const qIndexEl = document.getElementById('arenaQIndex');
    const qTotalEl = document.getElementById('arenaQTotal');
    const qCategoryEl = document.getElementById('arenaQCategory');
    const qPointsEl = document.getElementById('arenaQPoints');
    const qTextEl = document.getElementById('arenaQText');

    if (qIndexEl) qIndexEl.innerText = `Question ${g.currentQuestionIndex + 1}`;
    if (qTotalEl) qTotalEl.innerText = `of ${questions.length}`;
    if (qCategoryEl) qCategoryEl.innerText = currentQ.category || 'General';

    if (qPointsEl) {
      if (g.isBounced) {
        qPointsEl.innerHTML = `⚡ ${g.currentPoints} pts <span class="passed-badge">Passed (+${g.currentPoints})</span>`;
        qPointsEl.className = 'q-points-badge bounced';
      } else {
        qPointsEl.innerHTML = `🎯 ${g.currentPoints} pts (Base)`;
        qPointsEl.className = 'q-points-badge base';
      }
    }

    if (qTextEl) qTextEl.innerText = currentQ.text;

    // 2. Antigravity Bouncing Radar Bar
    this.renderBouncingRadar();

    // 3. Circular Timer
    this.renderCircularTimer();

    // 4. Options Grid
    this.renderOptionsGrid(currentQ);

    // 5. Feedback / Explanation Banner
    this.renderFeedbackBanner(currentQ);

    // 6. Arena Controls Bar
    this.renderArenaControls();
  }

  renderBouncingRadar() {
    const container = document.getElementById('bouncingRadar');
    if (!container) return;

    const s = this.state.settings;
    const g = this.state.gameState;
    const totalTeams = s.totalTeams;

    let html = '';
    for (let i = 0; i < totalTeams; i++) {
      const name = s.teamNames[i] || `Team ${i + 1}`;
      const color = s.teamColors[i] || '#3b82f6';
      const isStart = g.startingTeamIndex === i;
      const isActive = g.activeTeamIndex === i;
      const hasAttempted = g.attemptedTeams.includes(i);
      const isMissed = hasAttempted && !isActive;

      let statusBadge = '';
      let cardClass = 'radar-node';

      if (isActive) {
        cardClass += ' active-turn';
        statusBadge = '<span class="radar-status on-clock">ON CLOCK ⚡</span>';
      } else if (isMissed) {
        cardClass += ' missed';
        statusBadge = '<span class="radar-status missed">MISSED ❌</span>';
      } else {
        cardClass += ' waiting';
        statusBadge = '<span class="radar-status waiting">WAITING ⏳</span>';
      }

      html += `
        <div class="${cardClass}" style="--node-color: ${color}">
          <div class="radar-node-header">
            <span class="radar-team-num" style="background: ${color}">${i + 1}</span>
            <span class="radar-team-name">${this.escapeHtml(name)}</span>
            ${isStart ? '<span class="radar-start-badge" title="Original Target Team">👑 Start</span>' : ''}
          </div>
          ${statusBadge}
        </div>
      `;

      if (i < totalTeams - 1) {
        const arrowClass = hasAttempted ? 'radar-arrow bounce-active' : 'radar-arrow';
        html += `<div class="${arrowClass}">➔</div>`;
      }
    }

    container.innerHTML = html;
  }

  renderCircularTimer() {
    const timerValEl = document.getElementById('timerVal');
    const timerCircle = document.getElementById('timerProgressCircle');
    const timerContainer = document.getElementById('timerWidget');
    if (!timerValEl || !timerCircle) return;

    const g = this.state.gameState;
    const maxTime = g.currentDuration || 30;
    const timeLeft = Math.max(0, g.timeLeft !== undefined ? g.timeLeft : maxTime);

    timerValEl.innerText = timeLeft;

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / maxTime;
    const offset = circumference - progress * circumference;

    timerCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    timerCircle.style.strokeDashoffset = offset;

    // Color morphing
    if (timerContainer) {
      if (timeLeft <= 5 && g.status === 'playing') {
        timerContainer.className = 'timer-widget warning-pulse';
        timerCircle.style.stroke = '#ef4444';
      } else if (timeLeft <= 10) {
        timerContainer.className = 'timer-widget urgency-medium';
        timerCircle.style.stroke = '#f59e0b';
      } else {
        timerContainer.className = 'timer-widget normal';
        timerCircle.style.stroke = '#06b6d4';
      }
    }
  }

  renderOptionsGrid(currentQ) {
    const container = document.getElementById('arenaOptionsGrid');
    if (!container) return;

    const g = this.state.gameState;
    const optLabels = ['A', 'B', 'C', 'D'];
    const isAnswered = g.status === 'answered' || g.status === 'exhausted' || g.isAnswerRevealed;
    const canInteract = g.status === 'playing';

    let html = '';
    currentQ.options.forEach((opt, idx) => {
      let optionClass = 'option-card';
      const isSelected = g.selectedOption === idx;
      const isCorrect = idx === currentQ.correctIndex;

      if (isAnswered) {
        if (isCorrect) {
          optionClass += ' correct-option';
        } else if (isSelected) {
          optionClass += ' wrong-option';
        } else {
          optionClass += ' disabled-option';
        }
      } else if (canInteract) {
        optionClass += ' clickable';
      }

      html += `
        <button class="${optionClass}" 
                onclick="app.selectOption(${idx})" 
                ${!canInteract ? 'disabled' : ''}>
          <div class="option-prefix">${optLabels[idx]}</div>
          <div class="option-text">${this.escapeHtml(opt)}</div>
          ${isAnswered && isCorrect ? '<div class="option-icon">✅</div>' : ''}
          ${isAnswered && isSelected && !isCorrect ? '<div class="option-icon">❌</div>' : ''}
        </button>
      `;
    });

    container.innerHTML = html;
  }

  selectOption(idx) {
    if (this.state.gameState.status !== 'playing') return;
    this.engine.submitAnswer(idx);
  }

  renderFeedbackBanner(currentQ) {
    const container = document.getElementById('arenaFeedbackBanner');
    if (!container) return;

    const g = this.state.gameState;
    const s = this.state.settings;

    if (g.status === 'answered' && g.answerOutcome === 'correct') {
      const winnerName = s.teamNames[g.activeTeamIndex] || `Team ${g.activeTeamIndex + 1}`;
      container.innerHTML = `
        <div class="feedback-box correct-box">
          <div class="feedback-title">🎉 CORRECT ANSWER!</div>
          <div class="feedback-desc">
            <b>${this.escapeHtml(winnerName)}</b> earned <b>+${g.currentPoints} points</b>!
          </div>
          ${currentQ.explanation ? `<div class="feedback-explanation">💡 <b>Explanation:</b> ${this.escapeHtml(currentQ.explanation)}</div>` : ''}
        </div>
      `;
      container.style.display = 'block';
    } else if (g.status === 'exhausted') {
      container.innerHTML = `
        <div class="feedback-box exhausted-box">
          <div class="feedback-title">⚠️ ALL TEAMS MISSED! (Question Exhausted)</div>
          <div class="feedback-desc">
            The correct answer was <b>Option ${['A', 'B', 'C', 'D'][currentQ.correctIndex]}: ${this.escapeHtml(currentQ.options[currentQ.correctIndex])}</b>. No points awarded.
          </div>
          ${currentQ.explanation ? `<div class="feedback-explanation">💡 <b>Explanation:</b> ${this.escapeHtml(currentQ.explanation)}</div>` : ''}
        </div>
      `;
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
      container.innerHTML = '';
    }
  }

  renderArenaControls() {
    const container = document.getElementById('arenaControlsBar');
    if (!container) return;

    const g = this.state.gameState;
    const isPlaying = g.status === 'playing';
    const isPaused = g.status === 'paused';
    const isFinishedRound = g.status === 'answered' || g.status === 'exhausted';

    let html = '';

    if (isPlaying) {
      html += `
        <button class="btn btn-outline" onclick="engine.pauseQuiz()">⏸️ Pause (Space)</button>
        <button class="btn btn-warning" onclick="engine.skipQuestion()">⏩ Skip / Bounce (S)</button>
        <button class="btn btn-ghost" onclick="engine.revealAnswerManual()">👁️ Reveal Answer</button>
      `;
    } else if (isPaused) {
      html += `
        <button class="btn btn-primary" onclick="engine.resumeQuiz()">▶️ Resume (Space)</button>
        <button class="btn btn-warning" onclick="engine.skipQuestion()">⏩ Skip / Bounce (S)</button>
      `;
    } else if (isFinishedRound) {
      html += `
        <button class="btn btn-primary btn-lg pulse-glow" onclick="engine.nextQuestion()">
          Next Question ➔ (N)
        </button>
      `;
    }

    container.innerHTML = html;
  }

  renderCompleteScreen() {
    const s = this.state.settings;
    const g = this.state.gameState;
    const count = s.totalTeams;

    // Rank teams by score
    const ranked = [];
    for (let i = 0; i < count; i++) {
      ranked.push({
        index: i,
        name: s.teamNames[i] || `Team ${i + 1}`,
        color: s.teamColors[i] || '#3b82f6',
        score: g.scores[i] || 0
      });
    }
    ranked.sort((a, b) => b.score - a.score);

    const podiumContainer = document.getElementById('podiumDisplay');
    if (podiumContainer) {
      let podiumHtml = '<div class="podium-wrapper">';
      
      // 2nd Place
      if (ranked[1]) {
        podiumHtml += `
          <div class="podium-step step-2">
            <div class="podium-team">${this.escapeHtml(ranked[1].name)}</div>
            <div class="podium-score">${ranked[1].score} pts</div>
            <div class="podium-pillar" style="background: ${ranked[1].color}">
              <div class="podium-rank">2</div>
            </div>
          </div>
        `;
      }
      
      // 1st Place (Champion)
      if (ranked[0]) {
        podiumHtml += `
          <div class="podium-step step-1">
            <div class="podium-crown">👑</div>
            <div class="podium-team champion">${this.escapeHtml(ranked[0].name)}</div>
            <div class="podium-score">${ranked[0].score} pts</div>
            <div class="podium-pillar" style="background: ${ranked[0].color}">
              <div class="podium-rank">1</div>
            </div>
          </div>
        `;
      }

      // 3rd Place
      if (ranked[2]) {
        podiumHtml += `
          <div class="podium-step step-3">
            <div class="podium-team">${this.escapeHtml(ranked[2].name)}</div>
            <div class="podium-score">${ranked[2].score} pts</div>
            <div class="podium-pillar" style="background: ${ranked[2].color}">
              <div class="podium-rank">3</div>
            </div>
          </div>
        `;
      }

      podiumHtml += '</div>';
      podiumContainer.innerHTML = podiumHtml;
    }
  }

  renderLeaderboardView() {
    const s = this.state.settings;
    const g = this.state.gameState;
    const container = document.getElementById('leaderboardTableBody');
    if (!container) return;

    const ranked = [];
    for (let i = 0; i < s.totalTeams; i++) {
      ranked.push({
        index: i,
        name: s.teamNames[i] || `Team ${i + 1}`,
        color: s.teamColors[i] || '#3b82f6',
        score: g.scores[i] || 0
      });
    }
    ranked.sort((a, b) => b.score - a.score);

    let html = '';
    ranked.forEach((team, rank) => {
      const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`;
      html += `
        <tr class="leaderboard-row ${rank === 0 ? 'leader' : ''}">
          <td class="rank-cell"><b>${medal}</b></td>
          <td class="team-cell">
            <span class="team-dot" style="background: ${team.color}"></span>
            <b>${this.escapeHtml(team.name)}</b>
          </td>
          <td class="score-cell"><b>${team.score} pts</b></td>
        </tr>
      `;
    });

    container.innerHTML = html;

    // Render Round Logs
    const logContainer = document.getElementById('roundHistoryLogs');
    if (logContainer) {
      const history = g.roundHistory || [];
      if (history.length === 0) {
        logContainer.innerHTML = '<p class="text-muted">No completed rounds yet.</p>';
      } else {
        let logHtml = '<div class="history-list">';
        history.forEach((h, idx) => {
          const outcomeBadge = h.outcome === 'correct' 
            ? `<span class="badge badge-success">Won by ${this.escapeHtml(s.teamNames[h.winningTeam] || 'Team ' + (h.winningTeam + 1))} (+${h.pointsAwarded} pts)</span>`
            : '<span class="badge badge-danger">Exhausted / Unanswered</span>';

          logHtml += `
            <div class="history-card">
              <div class="history-q-title"><b>Round ${idx + 1}:</b> ${this.escapeHtml(h.questionText)}</div>
              <div class="history-q-meta">
                ${outcomeBadge}
                ${h.bounced ? '<span class="badge badge-warning">⚡ Antigravity Bounced</span>' : '<span class="badge badge-info">Direct Answer</span>'}
              </div>
            </div>
          `;
        });
        logHtml += '</div>';
        logContainer.innerHTML = logHtml;
      }
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

const app = new AppController(stateManager, engine, admin, sounds, confetti);

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
