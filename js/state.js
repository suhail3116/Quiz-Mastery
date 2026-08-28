/**
 * Antigravity State Store
 * Manages game settings, question bank, active round state, and localStorage syncing.
 */

const STORAGE_KEYS = {
  SETTINGS: 'antigravity_settings_v1',
  QUESTIONS: 'antigravity_questions_v1',
  GAME_STATE: 'antigravity_game_state_v1',
  USER_ROLE: 'antigravity_user_role_v1',
  SELECTED_BANK: 'antigravity_selected_bank_v1'
};

const DEFAULT_SETTINGS = {
  totalTeams: 4,
  baseTime: 30,
  bounceTime: 15,
  basePoints: 10,
  passPoints: 5,
  soundEnabled: true,
  autoAdvanceOnReveal: false,
  teamNames: ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta", "Team Epsilon", "Team Zeta"],
  teamColors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"]
};

class StateManager {
  constructor() {
    this.listeners = [];
    this.settings = this.loadSettings();
    this.questions = this.loadQuestions();
    this.gameState = this.loadGameState();
    this.userRole = this.loadUserRole();
    
    // Listen for cross-tab updates via localStorage
    window.addEventListener('storage', (e) => this.handleStorageEvent(e));
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch (e) {
      console.warn('Failed to parse stored settings, using default', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    this.notify('settings', this.settings);
  }

  loadQuestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse questions, using preset', e);
    }
    // Default to CS preset
    if (typeof PRESET_QUESTION_BANKS !== 'undefined' && PRESET_QUESTION_BANKS.os_full) {
      return [...PRESET_QUESTION_BANKS.os_full.questions];
    }
    if (typeof PRESET_QUESTION_BANKS !== 'undefined' && PRESET_QUESTION_BANKS.cs_tech) {
      return [...PRESET_QUESTION_BANKS.cs_tech.questions];
    }
    return [];
  }

  saveQuestions(questions) {
    this.questions = questions;
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(this.questions));
    this.notify('questions', this.questions);
  }

  loadBank(bankKey) {
    if (typeof PRESET_QUESTION_BANKS !== 'undefined' && PRESET_QUESTION_BANKS[bankKey]) {
      const bank = PRESET_QUESTION_BANKS[bankKey];
      this.saveQuestions([...bank.questions]);
      this.saveSettings({
        totalTeams: bank.settings.totalTeams || this.settings.totalTeams,
        baseTime: bank.settings.baseTime || this.settings.baseTime,
        bounceTime: bank.settings.bounceTime || this.settings.bounceTime,
        teamNames: bank.settings.teamNames || this.settings.teamNames,
        teamColors: bank.settings.teamColors || this.settings.teamColors
      });
      localStorage.setItem(STORAGE_KEYS.SELECTED_BANK, bankKey);
      this.resetGame();
      return true;
    }
    return false;
  }

  loadGameState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse game state', e);
    }
    return this.getInitialGameState();
  }

  getInitialGameState() {
    const teamCount = this.settings.totalTeams || 4;
    return {
      status: 'idle', // 'idle' | 'playing' | 'paused' | 'answered' | 'exhausted' | 'completed'
      currentQuestionIndex: 0,
      activeTeamIndex: 0,
      startingTeamIndex: 0,
      attemptedTeams: [], // Array of team indices that have tried this question
      isBounced: false,
      bounceCount: 0,
      currentPoints: this.settings.basePoints,
      currentDuration: this.settings.baseTime,
      timeLeft: this.settings.baseTime,
      scores: new Array(teamCount).fill(0),
      selectedOption: null,
      isAnswerRevealed: false,
      answerOutcome: null, // 'correct' | 'wrong' | 'timeout' | 'skipped' | null
      roundHistory: [] // History of each round
    };
  }

  saveGameState(state) {
    this.gameState = { ...this.gameState, ...state };
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(this.gameState));
    this.notify('gameState', this.gameState);
  }

  resetGame() {
    const initialState = this.getInitialGameState();
    this.saveGameState(initialState);
    return initialState;
  }

  loadUserRole() {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'projector';
  }

  setUserRole(role) {
    this.userRole = role;
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
    this.notify('userRole', role);
  }

  updateTeamScore(teamIndex, delta) {
    const newScores = [...this.gameState.scores];
    while (newScores.length < this.settings.totalTeams) {
      newScores.push(0);
    }
    newScores[teamIndex] = Math.max(0, (newScores[teamIndex] || 0) + delta);
    this.saveGameState({ scores: newScores });
  }

  setTeamScore(teamIndex, exactScore) {
    const newScores = [...this.gameState.scores];
    while (newScores.length < this.settings.totalTeams) {
      newScores.push(0);
    }
    newScores[teamIndex] = Math.max(0, exactScore);
    this.saveGameState({ scores: newScores });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(type, data) {
    this.listeners.forEach(fn => {
      try {
        fn(type, data);
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    });
  }

  handleStorageEvent(e) {
    if (e.key === STORAGE_KEYS.GAME_STATE && e.newValue) {
      this.gameState = JSON.parse(e.newValue);
      this.notify('gameState', this.gameState);
    } else if (e.key === STORAGE_KEYS.SETTINGS && e.newValue) {
      this.settings = JSON.parse(e.newValue);
      this.notify('settings', this.settings);
    } else if (e.key === STORAGE_KEYS.QUESTIONS && e.newValue) {
      this.questions = JSON.parse(e.newValue);
      this.notify('questions', this.questions);
    } else if (e.key === STORAGE_KEYS.USER_ROLE && e.newValue) {
      this.userRole = e.newValue;
      this.notify('userRole', this.userRole);
    }
  }
}

const stateManager = new StateManager();
