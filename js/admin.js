/**
 * Antigravity Admin Controller
 * Question Bank Manager (JSON/CSV Import/Export, Question Editor), Settings, and Live Controls.
 */

class AdminController {
  constructor(state, eng) {
    this.state = state;
    this.engine = eng;
    this.editingQuestionIndex = -1;
  }

  init() {
    this.bindEvents();
    this.renderSettingsForm();
    this.renderQuestionList();
    this.renderScoreOverrides();
  }

  bindEvents() {
    // Settings form submit
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettingsFromForm();
      });
    }

    // JSON / CSV file inputs
    const jsonFileInput = document.getElementById('jsonFileInput');
    if (jsonFileInput) {
      jsonFileInput.addEventListener('change', (e) => this.handleJSONUpload(e));
    }

    const csvFileInput = document.getElementById('csvFileInput');
    if (csvFileInput) {
      csvFileInput.addEventListener('change', (e) => this.handleCSVUpload(e));
    }

    // Question form submit (Modal)
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
      questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveQuestionModal();
      });
    }
  }

  renderSettingsForm() {
    const s = this.state.settings;
    const totalTeamsInput = document.getElementById('settingTotalTeams');
    const baseTimeInput = document.getElementById('settingBaseTime');
    const bounceTimeInput = document.getElementById('settingBounceTime');
    const basePointsInput = document.getElementById('settingBasePoints');
    const passPointsInput = document.getElementById('settingPassPoints');
    const soundToggle = document.getElementById('settingSoundToggle');

    if (totalTeamsInput) totalTeamsInput.value = s.totalTeams;
    if (baseTimeInput) baseTimeInput.value = s.baseTime;
    if (bounceTimeInput) bounceTimeInput.value = s.bounceTime;
    if (basePointsInput) basePointsInput.value = s.basePoints;
    if (passPointsInput) passPointsInput.value = s.passPoints;
    if (soundToggle) soundToggle.checked = s.soundEnabled;

    this.renderTeamNameInputs();
  }

  renderTeamNameInputs() {
    const container = document.getElementById('teamNamesContainer');
    if (!container) return;

    const s = this.state.settings;
    const count = parseInt(document.getElementById('settingTotalTeams')?.value || s.totalTeams, 10);

    let html = '';
    for (let i = 0; i < count; i++) {
      const name = s.teamNames[i] || `Team ${i + 1}`;
      const color = s.teamColors[i] || '#3b82f6';
      html += `
        <div class="team-config-row">
          <input type="color" class="color-picker-input" id="teamColor_${i}" value="${color}">
          <input type="text" class="form-input team-name-input" id="teamName_${i}" value="${name}" placeholder="Team ${i + 1} Name">
        </div>
      `;
    }
    container.innerHTML = html;
  }

  saveSettingsFromForm() {
    const totalTeams = parseInt(document.getElementById('settingTotalTeams').value, 10);
    const baseTime = parseInt(document.getElementById('settingBaseTime').value, 10);
    const bounceTime = parseInt(document.getElementById('settingBounceTime').value, 10);
    const basePoints = parseInt(document.getElementById('settingBasePoints').value, 10);
    const passPoints = parseInt(document.getElementById('settingPassPoints').value, 10);
    const soundEnabled = document.getElementById('settingSoundToggle').checked;

    const teamNames = [];
    const teamColors = [];

    for (let i = 0; i < totalTeams; i++) {
      const nameInput = document.getElementById(`teamName_${i}`);
      const colorInput = document.getElementById(`teamColor_${i}`);
      teamNames.push(nameInput ? nameInput.value.trim() || `Team ${i + 1}` : `Team ${i + 1}`);
      teamColors.push(colorInput ? colorInput.value : '#3b82f6');
    }

    this.state.saveSettings({
      totalTeams,
      baseTime,
      bounceTime,
      basePoints,
      passPoints,
      soundEnabled,
      teamNames,
      teamColors
    });

    sounds.setEnabled(soundEnabled);
    this.renderScoreOverrides();
    alert('Settings updated successfully!');
  }

  renderQuestionList() {
    const container = document.getElementById('adminQuestionList');
    const countBadge = document.getElementById('adminQuestionCount');
    if (!container) return;

    const qList = this.state.questions;
    if (countBadge) countBadge.innerText = `${qList.length} Questions`;

    if (qList.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No questions loaded yet. Use presets, upload JSON/CSV, or click "+ Add Question".</p>
        </div>
      `;
      return;
    }

    let html = '';
    qList.forEach((q, idx) => {
      const optLabels = ['A', 'B', 'C', 'D'];
      const optionsHtml = q.options.map((opt, oIdx) => `
        <span class="option-pill ${oIdx === q.correctIndex ? 'correct' : ''}">
          <b>${optLabels[oIdx]}:</b> ${this.escapeHtml(opt)}
        </span>
      `).join('');

      html += `
        <div class="admin-question-card">
          <div class="admin-q-header">
            <div class="admin-q-tags">
              <span class="badge badge-primary">Q${idx + 1}</span>
              ${q.category ? `<span class="badge badge-secondary">${this.escapeHtml(q.category)}</span>` : ''}
              <span class="badge badge-info">${q.points || this.state.settings.basePoints} pts / ${q.passPoints || this.state.settings.passPoints} pass</span>
              ${q.customTime ? `<span class="badge badge-warning">⏱️ ${q.customTime}s</span>` : ''}
            </div>
            <div class="admin-q-actions">
              <button class="btn btn-sm btn-ghost" onclick="admin.openQuestionModal(${idx})" title="Edit Question">✏️ Edit</button>
              <button class="btn btn-sm btn-ghost text-danger" onclick="admin.deleteQuestion(${idx})" title="Delete Question">🗑️</button>
            </div>
          </div>
          <p class="admin-q-text">${this.escapeHtml(q.text)}</p>
          <div class="admin-q-options">${optionsHtml}</div>
          ${q.explanation ? `<div class="admin-q-exp">💡 <b>Explanation:</b> ${this.escapeHtml(q.explanation)}</div>` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
  }

  openQuestionModal(index = -1) {
    this.editingQuestionIndex = index;
    const modal = document.getElementById('questionModal');
    const title = document.getElementById('questionModalTitle');
    if (!modal) return;

    if (index >= 0 && index < this.state.questions.length) {
      const q = this.state.questions[index];
      if (title) title.innerText = `Edit Question #${index + 1}`;
      document.getElementById('qTextInput').value = q.text || '';
      document.getElementById('qCategoryInput').value = q.category || '';
      document.getElementById('qOpt0Input').value = q.options[0] || '';
      document.getElementById('qOpt1Input').value = q.options[1] || '';
      document.getElementById('qOpt2Input').value = q.options[2] || '';
      document.getElementById('qOpt3Input').value = q.options[3] || '';
      document.getElementById('qCorrectInput').value = q.correctIndex !== undefined ? q.correctIndex : 0;
      document.getElementById('qPointsInput').value = q.points || this.state.settings.basePoints;
      document.getElementById('qPassPointsInput').value = q.passPoints || this.state.settings.passPoints;
      document.getElementById('qCustomTimeInput').value = q.customTime || '';
      document.getElementById('qExplanationInput').value = q.explanation || '';
    } else {
      if (title) title.innerText = 'Add New Question';
      document.getElementById('questionForm').reset();
      document.getElementById('qPointsInput').value = this.state.settings.basePoints;
      document.getElementById('qPassPointsInput').value = this.state.settings.passPoints;
    }

    modal.classList.add('active');
  }

  closeQuestionModal() {
    const modal = document.getElementById('questionModal');
    if (modal) modal.classList.remove('active');
    this.editingQuestionIndex = -1;
  }

  saveQuestionModal() {
    const text = document.getElementById('qTextInput').value.trim();
    const category = document.getElementById('qCategoryInput').value.trim();
    const opt0 = document.getElementById('qOpt0Input').value.trim();
    const opt1 = document.getElementById('qOpt1Input').value.trim();
    const opt2 = document.getElementById('qOpt2Input').value.trim();
    const opt3 = document.getElementById('qOpt3Input').value.trim();
    const correctIndex = parseInt(document.getElementById('qCorrectInput').value, 10);
    const points = parseInt(document.getElementById('qPointsInput').value, 10) || this.state.settings.basePoints;
    const passPoints = parseInt(document.getElementById('qPassPointsInput').value, 10) || this.state.settings.passPoints;
    const customTimeVal = document.getElementById('qCustomTimeInput').value.trim();
    const customTime = customTimeVal ? parseInt(customTimeVal, 10) : null;
    const explanation = document.getElementById('qExplanationInput').value.trim();

    if (!text || !opt0 || !opt1 || !opt2 || !opt3) {
      alert('Please fill out the question and all 4 options!');
      return;
    }

    const qObj = {
      id: this.editingQuestionIndex >= 0 ? this.state.questions[this.editingQuestionIndex].id : `q-${Date.now()}`,
      text,
      category,
      options: [opt0, opt1, opt2, opt3],
      correctIndex,
      points,
      passPoints,
      customTime,
      explanation
    };

    const newQuestions = [...this.state.questions];
    if (this.editingQuestionIndex >= 0) {
      newQuestions[this.editingQuestionIndex] = qObj;
    } else {
      newQuestions.push(qObj);
    }

    this.state.saveQuestions(newQuestions);
    this.renderQuestionList();
    this.closeQuestionModal();
  }

  deleteQuestion(index) {
    if (confirm(`Are you sure you want to delete Question #${index + 1}?`)) {
      const newQuestions = [...this.state.questions];
      newQuestions.splice(index, 1);
      this.state.saveQuestions(newQuestions);
      this.renderQuestionList();
    }
  }

  handleJSONUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.questions && Array.isArray(data.questions)) {
          this.state.saveQuestions(data.questions);
          if (data.settings) {
            this.state.saveSettings(data.settings);
          }
          this.renderSettingsForm();
          this.renderQuestionList();
          alert(`Successfully imported ${data.questions.length} questions from JSON!`);
        } else if (Array.isArray(data)) {
          this.state.saveQuestions(data);
          this.renderQuestionList();
          alert(`Successfully imported ${data.length} questions from JSON array!`);
        } else {
          alert('Invalid JSON structure. Expected object with "questions" array.');
        }
      } catch (err) {
        alert('Error parsing JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        const questions = this.parseCSV(csvText);
        if (questions.length > 0) {
          this.state.saveQuestions(questions);
          this.renderQuestionList();
          alert(`Successfully imported ${questions.length} questions from CSV!`);
        } else {
          alert('Could not parse any questions from CSV.');
        }
      } catch (err) {
        alert('Error parsing CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    // Header check
    const questions = [];
    for (let i = 1; i < lines.length; i++) {
      // Split by comma ignoring commas inside quotes
      const row = this.parseCSVRow(lines[i]);
      if (row.length >= 6) {
        const text = row[0];
        const options = [row[1], row[2], row[3], row[4]];
        let correctIndex = parseInt(row[5], 10);
        if (isNaN(correctIndex)) {
          // If given as A, B, C, D
          const letter = row[5].trim().toUpperCase();
          correctIndex = ['A', 'B', 'C', 'D'].indexOf(letter);
          if (correctIndex === -1) correctIndex = 0;
        }

        const points = row[6] ? parseInt(row[6], 10) : this.state.settings.basePoints;
        const passPoints = row[7] ? parseInt(row[7], 10) : this.state.settings.passPoints;
        const customTime = row[8] && parseInt(row[8], 10) ? parseInt(row[8], 10) : null;
        const explanation = row[9] || '';
        const category = row[10] || '';

        questions.push({
          id: `q-csv-${i}`,
          text,
          category,
          options,
          correctIndex,
          points,
          passPoints,
          customTime,
          explanation
        });
      }
    }
    return questions;
  }

  parseCSVRow(row) {
    const result = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '"' || c === "'") {
        insideQuote = !insideQuote;
      } else if (c === ',' && !insideQuote) {
        result.push(entry.trim());
        entry = '';
      } else {
        entry += c;
      }
    }
    result.push(entry.trim());
    return result;
  }

  exportJSON() {
    const exportData = {
      settings: this.state.settings,
      questions: this.state.questions
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonStr, 'antigravity_quiz_bank.json', 'application/json');
  }

  exportCSV() {
    const headers = ['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Index (0-3)', 'Points', 'Pass Points', 'Custom Time', 'Explanation', 'Category'];
    const rows = this.state.questions.map(q => {
      return [
        `"${(q.text || '').replace(/"/g, '""')}"`,
        `"${(q.options[0] || '').replace(/"/g, '""')}"`,
        `"${(q.options[1] || '').replace(/"/g, '""')}"`,
        `"${(q.options[2] || '').replace(/"/g, '""')}"`,
        `"${(q.options[3] || '').replace(/"/g, '""')}"`,
        q.correctIndex,
        q.points || this.state.settings.basePoints,
        q.passPoints || this.state.settings.passPoints,
        q.customTime || '',
        `"${(q.explanation || '').replace(/"/g, '""')}"`,
        `"${(q.category || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    this.downloadFile(csvContent, 'antigravity_quiz_bank.csv', 'text/csv');
  }

  downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  renderScoreOverrides() {
    const container = document.getElementById('scoreOverrideContainer');
    if (!container) return;

    const s = this.state.settings;
    const scores = this.state.gameState.scores;

    let html = '';
    for (let i = 0; i < s.totalTeams; i++) {
      const name = s.teamNames[i] || `Team ${i + 1}`;
      const color = s.teamColors[i] || '#3b82f6';
      const score = scores[i] || 0;

      html += `
        <div class="score-override-card" style="border-left: 4px solid ${color}">
          <div class="score-override-team">
            <span class="team-dot" style="background: ${color}"></span>
            <b>${this.escapeHtml(name)}</b>
          </div>
          <div class="score-override-controls">
            <button class="btn btn-xs btn-outline" onclick="admin.adjustScore(${i}, -10)">-10</button>
            <button class="btn btn-xs btn-outline" onclick="admin.adjustScore(${i}, -5)">-5</button>
            <input type="number" class="score-input" id="manualScore_${i}" value="${score}" onchange="admin.setScoreFromInput(${i}, this.value)">
            <button class="btn btn-xs btn-outline" onclick="admin.adjustScore(${i}, 5)">+5</button>
            <button class="btn btn-xs btn-outline" onclick="admin.adjustScore(${i}, 10)">+10</button>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  adjustScore(teamIndex, delta) {
    this.state.updateTeamScore(teamIndex, delta);
    this.renderScoreOverrides();
  }

  setScoreFromInput(teamIndex, val) {
    const num = parseInt(val, 10) || 0;
    this.state.setTeamScore(teamIndex, num);
    this.renderScoreOverrides();
  }

  loadPreset(presetKey) {
    if (confirm(`Load preset "${presetKey}"? This will update the question bank and reset current game.`)) {
      this.state.loadBank(presetKey);
      this.renderSettingsForm();
      this.renderQuestionList();
      this.renderScoreOverrides();
      alert('Loaded preset successfully!');
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

const admin = new AdminController(stateManager, engine);
