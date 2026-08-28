/**
 * Antigravity Quiz Engine
 * Finite State Machine handling question bounce lifecycle, timers, turn rotation, and scoring.
 */

class AntigravityEngine {
  constructor(state, sound, conf) {
    this.state = state;
    this.sounds = sound;
    this.confetti = conf;
    this.timerInterval = null;
    this.animatingBounce = false;
  }

  getCurrentQuestion() {
    const qList = this.state.questions;
    const idx = this.state.gameState.currentQuestionIndex;
    if (qList && idx >= 0 && idx < qList.length) {
      return qList[idx];
    }
    return null;
  }

  startQuiz() {
    if (this.state.questions.length === 0) {
      alert('Question bank is empty! Please load or add questions first.');
      return;
    }

    const state = this.state.gameState;
    const currentQ = this.state.questions[0];
    const initialTime = currentQ.customTime || this.state.settings.baseTime;

    this.state.saveGameState({
      status: 'playing',
      currentQuestionIndex: 0,
      activeTeamIndex: 0,
      startingTeamIndex: 0,
      attemptedTeams: [0],
      isBounced: false,
      bounceCount: 0,
      currentPoints: currentQ.points || this.state.settings.basePoints,
      currentDuration: initialTime,
      timeLeft: initialTime,
      selectedOption: null,
      isAnswerRevealed: false,
      answerOutcome: null
    });

    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    const state = this.state.gameState;
    let time = state.timeLeft !== undefined ? state.timeLeft : state.currentDuration;

    this.timerInterval = setInterval(() => {
      if (this.state.gameState.status !== 'playing') {
        this.stopTimer();
        return;
      }

      time--;
      this.state.saveGameState({ timeLeft: time });

      if (time <= 5 && time > 0) {
        this.sounds.playWarning();
      } else if (time > 5) {
        this.sounds.playTick();
      }

      if (time <= 0) {
        this.stopTimer();
        this.handleTimeout();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  pauseQuiz() {
    if (this.state.gameState.status === 'playing') {
      this.stopTimer();
      this.state.saveGameState({ status: 'paused' });
    }
  }

  resumeQuiz() {
    if (this.state.gameState.status === 'paused') {
      this.state.saveGameState({ status: 'playing' });
      this.startTimer();
    }
  }

  submitAnswer(selectedOptionIndex) {
    const state = this.state.gameState;
    if (state.status !== 'playing' || state.isAnswerRevealed) return;

    this.stopTimer();
    const q = this.getCurrentQuestion();
    if (!q) return;

    const isCorrect = selectedOptionIndex === q.correctIndex;
    const activeTeam = state.activeTeamIndex;
    const pts = state.currentPoints;

    if (isCorrect) {
      // SUCCESS!
      this.sounds.playCorrect();
      this.confetti.createBurst();

      // Award points
      this.state.updateTeamScore(activeTeam, pts);

      // Record in history
      const historyItem = {
        questionId: q.id,
        questionText: q.text,
        startingTeam: state.startingTeamIndex,
        winningTeam: activeTeam,
        pointsAwarded: pts,
        bounced: state.isBounced,
        attemptedTeams: [...state.attemptedTeams],
        outcome: 'correct'
      };

      const newHistory = [...(state.roundHistory || []), historyItem];

      this.state.saveGameState({
        status: 'answered',
        selectedOption: selectedOptionIndex,
        isAnswerRevealed: true,
        answerOutcome: 'correct',
        roundHistory: newHistory
      });

    } else {
      // WRONG ANSWER -> ANTIGRAVITY BOUNCE!
      this.sounds.playWrong();

      this.state.saveGameState({
        selectedOption: selectedOptionIndex,
        answerOutcome: 'wrong'
      });

      setTimeout(() => {
        this.executeBounce('wrong');
      }, 900);
    }
  }

  skipQuestion() {
    const state = this.state.gameState;
    if (state.status !== 'playing' || state.isAnswerRevealed) return;

    this.stopTimer();
    this.sounds.playClick();

    this.state.saveGameState({
      answerOutcome: 'skipped'
    });

    setTimeout(() => {
      this.executeBounce('skipped');
    }, 400);
  }

  handleTimeout() {
    const state = this.state.gameState;
    if (state.status !== 'playing' || state.isAnswerRevealed) return;

    this.sounds.playWrong();

    this.state.saveGameState({
      answerOutcome: 'timeout',
      timeLeft: 0
    });

    setTimeout(() => {
      this.executeBounce('timeout');
    }, 900);
  }

  executeBounce(reason = 'wrong') {
    const state = this.state.gameState;
    const totalTeams = this.state.settings.totalTeams;
    const currentAttempted = [...state.attemptedTeams];

    // Check if all teams have attempted this question
    if (currentAttempted.length >= totalTeams) {
      // All teams missed it -> EXHAUSTED / DEAD QUESTION
      this.handleExhaustion();
      return;
    }

    // Find next sequential team not in attempted array
    let nextTeam = (state.activeTeamIndex + 1) % totalTeams;
    while (currentAttempted.includes(nextTeam) && currentAttempted.length < totalTeams) {
      nextTeam = (nextTeam + 1) % totalTeams;
    }

    currentAttempted.push(nextTeam);
    const q = this.getCurrentQuestion();
    const bounceDuration = this.state.settings.bounceTime;
    const passPts = q.passPoints || this.state.settings.passPoints;

    this.sounds.playBounce();

    this.state.saveGameState({
      status: 'playing',
      activeTeamIndex: nextTeam,
      attemptedTeams: currentAttempted,
      isBounced: true,
      bounceCount: (state.bounceCount || 0) + 1,
      currentPoints: passPts,
      currentDuration: bounceDuration,
      timeLeft: bounceDuration,
      selectedOption: null,
      isAnswerRevealed: false,
      answerOutcome: null
    });

    this.startTimer();
  }

  handleExhaustion() {
    const state = this.state.gameState;
    const q = this.getCurrentQuestion();
    this.stopTimer();

    const historyItem = {
      questionId: q.id,
      questionText: q.text,
      startingTeam: state.startingTeamIndex,
      winningTeam: null,
      pointsAwarded: 0,
      bounced: true,
      attemptedTeams: [...state.attemptedTeams],
      outcome: 'exhausted'
    };

    const newHistory = [...(state.roundHistory || []), historyItem];

    this.state.saveGameState({
      status: 'exhausted',
      isAnswerRevealed: true,
      selectedOption: null,
      answerOutcome: 'exhausted',
      roundHistory: newHistory
    });
  }

  revealAnswerManual() {
    this.stopTimer();
    this.state.saveGameState({
      isAnswerRevealed: true,
      status: 'answered'
    });
  }

  nextQuestion() {
    this.stopTimer();
    const state = this.state.gameState;
    const nextQIndex = state.currentQuestionIndex + 1;
    const totalQuestions = this.state.questions.length;
    const totalTeams = this.state.settings.totalTeams;

    if (nextQIndex >= totalQuestions) {
      // QUIZ COMPLETE!
      this.sounds.playVictory();
      this.confetti.celebrate(4000);

      this.state.saveGameState({
        status: 'completed',
        isAnswerRevealed: false,
        selectedOption: null,
        answerOutcome: null
      });
      return;
    }

    // Move starting team to next in rotation
    const nextStartingTeam = (state.startingTeamIndex + 1) % totalTeams;
    const nextQ = this.state.questions[nextQIndex];
    const duration = nextQ.customTime || this.state.settings.baseTime;
    const pts = nextQ.points || this.state.settings.basePoints;

    this.state.saveGameState({
      status: 'playing',
      currentQuestionIndex: nextQIndex,
      activeTeamIndex: nextStartingTeam,
      startingTeamIndex: nextStartingTeam,
      attemptedTeams: [nextStartingTeam],
      isBounced: false,
      bounceCount: 0,
      currentPoints: pts,
      currentDuration: duration,
      timeLeft: duration,
      selectedOption: null,
      isAnswerRevealed: false,
      answerOutcome: null
    });

    this.startTimer();
  }

  jumpToQuestion(index) {
    if (index < 0 || index >= this.state.questions.length) return;
    this.stopTimer();
    const totalTeams = this.state.settings.totalTeams;
    const startingTeam = index % totalTeams;
    const q = this.state.questions[index];
    const duration = q.customTime || this.state.settings.baseTime;

    this.state.saveGameState({
      status: 'playing',
      currentQuestionIndex: index,
      activeTeamIndex: startingTeam,
      startingTeamIndex: startingTeam,
      attemptedTeams: [startingTeam],
      isBounced: false,
      bounceCount: 0,
      currentPoints: q.points || this.state.settings.basePoints,
      currentDuration: duration,
      timeLeft: duration,
      selectedOption: null,
      isAnswerRevealed: false,
      answerOutcome: null
    });

    this.startTimer();
  }

  resetQuiz() {
    this.stopTimer();
    this.confetti.clear();
    this.state.resetGame();
  }
}

const engine = new AntigravityEngine(stateManager, sounds, confetti);
