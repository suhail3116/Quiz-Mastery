import { useState, useEffect, useRef, useCallback } from 'react';
import osQuestions from '../data/osQuestions.json';
import { supabaseService } from '../services/supabaseService';

const STORAGE_KEYS = {
  SETTINGS: 'antigravity_settings_v3',
  QUESTIONS: 'antigravity_questions_v3',
  GAME_STATE: 'antigravity_game_state_v3',
  USER_ROLE: 'antigravity_user_role_v3'
};

const DEFAULT_SETTINGS = {
  totalTeams: 4,
  totalRoundTime: 120,
  questionTime: 20,
  balanceQuestionTime: 15,
  basePoints: 10,
  passPoints: 5,
  soundEnabled: true,
  teamNames: ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"],
  teamColors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"],
  collegeName: "Antigravity Institute of Technology",
  eventName: "Annual National Technical Quiz Championship 2026"
};

const DEFAULT_LEAGUE_STATE = {
  isRoundStarted: false,
  claimedTeams: {}, // { [teamIndex]: { deviceId: string, teamName: string, claimedAt: number } }
  teamProgress: [
    { currentQIndex: 0, completed: false, correctCount: 0, answers: [] },
    { currentQIndex: 0, completed: false, correctCount: 0, answers: [] },
    { currentQIndex: 0, completed: false, correctCount: 0, answers: [] },
    { currentQIndex: 0, completed: false, correctCount: 0, answers: [] },
    { currentQIndex: 0, completed: false, correctCount: 0, answers: [] },
    { currentQIndex: 0, completed: false, correctCount: 0, answers: [] }
  ]
};

const DEFAULT_BUZZER_STATE = {
  isAuthorized: false,
  currentQIndex: 0,
  questionRevealed: false,
  showAnswer: false,
  buzzerWinner: null,
  buzzLocked: false,
  startTime: 0
};

const DEFAULT_GAME_STATE = {
  roundPhase: 'idle',
  currentTeamIndex: 0,
  currentBucketQIndex: 0,
  totalTimeLeft: DEFAULT_SETTINGS.totalRoundTime,
  questionTimeLeft: DEFAULT_SETTINGS.questionTime,
  balanceTimeLeft: DEFAULT_SETTINGS.balanceQuestionTime,
  scores: [0, 0, 0, 0],
  bucketResults: [],
  balanceQuestions: [],
  balanceTargetTeam: 1,
  attemptedBalanceTeams: [],
  balanceQIndex: 0,
  balanceResults: [],
  selectedOption: null,
  isPaused: false,
  buzzerState: { ...DEFAULT_BUZZER_STATE },
  leagueState: { ...DEFAULT_LEAGUE_STATE },
  tournamentHistory: []
};

function sanitizeSettings(raw) {
  const merged = { ...DEFAULT_SETTINGS, ...(raw || {}) };
  if (!Array.isArray(merged.teamNames) || merged.teamNames.length === 0) {
    merged.teamNames = [...DEFAULT_SETTINGS.teamNames];
  }
  if (!Array.isArray(merged.teamColors) || merged.teamColors.length === 0) {
    merged.teamColors = [...DEFAULT_SETTINGS.teamColors];
  }
  if (!merged.totalTeams || merged.totalTeams < 2) merged.totalTeams = 4;
  if (!merged.questionTime) merged.questionTime = 20;
  if (!merged.totalRoundTime) merged.totalRoundTime = 120;
  if (!merged.balanceQuestionTime) merged.balanceQuestionTime = 15;
  return merged;
}

function sanitizeGameState(raw) {
  const merged = { ...DEFAULT_GAME_STATE, ...(raw || {}) };
  if (!Array.isArray(merged.scores) || merged.scores.length === 0) {
    merged.scores = [0, 0, 0, 0];
  }
  if (!merged.leagueState || typeof merged.leagueState !== 'object') {
    merged.leagueState = { ...DEFAULT_LEAGUE_STATE };
  }
  if (!merged.buzzerState || typeof merged.buzzerState !== 'object') {
    merged.buzzerState = { ...DEFAULT_BUZZER_STATE };
  }
  if (!merged.roundPhase) {
    merged.roundPhase = 'idle';
  }
  if (!Array.isArray(merged.bucketResults)) merged.bucketResults = [];
  if (!Array.isArray(merged.balanceQuestions)) merged.balanceQuestions = [];
  if (!Array.isArray(merged.balanceResults)) merged.balanceResults = [];
  return merged;
}

export function useAntigravityEngine(sounds, confetti) {
  const [settings, setSettingsState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return sanitizeSettings(JSON.parse(stored));
    } catch (e) {}
    return sanitizeSettings(DEFAULT_SETTINGS);
  });

  const [questions, setQuestionsState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return osQuestions;
  });

  const [userRole, setUserRoleState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'projector';
  });

  const [gameState, setGameState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (stored) return sanitizeGameState(JSON.parse(stored));
    } catch (e) {}
    return sanitizeGameState(DEFAULT_GAME_STATE);
  });

  // Keep references always synchronized for stable callbacks & timers
  const settingsRef = useRef(settings);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  const questionsRef = useRef(questions);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const soundsRef = useRef(sounds);
  useEffect(() => { soundsRef.current = sounds; }, [sounds]);

  const confettiRef = useRef(confetti);
  useEffect(() => { confettiRef.current = confetti; }, [confetti]);

  const timerRef = useRef(null);
  const balanceTimerRef = useRef(null);

  // Stable state persistence to LocalStorage and Supabase
  const persistState = useCallback((newGameState, newSettings) => {
    const s = sanitizeSettings(newSettings || settingsRef.current);
    const g = sanitizeGameState(newGameState || gameStateRef.current);
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(g));
      if (newSettings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(s));
      }
    } catch (e) {}
    supabaseService.saveTournamentState(g, s);
  }, []);

  // Load from Supabase on Mount & Subscribe to Realtime Changes
  useEffect(() => {
    let mounted = true;
    async function loadFromDb() {
      try {
        const dbState = await supabaseService.getTournamentState();
        if (mounted && dbState) {
          if (dbState.settings) setSettingsState(sanitizeSettings(dbState.settings));
          if (dbState.gameState && dbState.gameState.roundPhase !== 'idle') {
            setGameState(sanitizeGameState(dbState.gameState));
          }
        }
        const dbQuestions = await supabaseService.getQuestions();
        if (mounted && dbQuestions && dbQuestions.length > 0) {
          setQuestionsState(dbQuestions);
        }
      } catch (e) {
        console.warn('[Engine] Supabase init warning:', e);
      }
    }

    loadFromDb();

    // Listen to real-time events across all devices
    const unsubscribe = supabaseService.subscribe(
      (remote) => {
        if (remote.gameState) {
          setGameState(sanitizeGameState(remote.gameState));
        }
        if (remote.settings) {
          setSettingsState(sanitizeSettings(remote.settings));
        }
      },
      (buzzerEvent) => {
        if (soundsRef.current) soundsRef.current.playBuzzer();
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Update Settings (and synchronize idle clock values immediately)
  const updateSettings = useCallback((newSettings) => {
    setSettingsState(prevSettings => {
      const merged = sanitizeSettings({ ...prevSettings, ...newSettings });
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));

      setGameState(prevGame => {
        let nextGame = { ...prevGame };
        if (prevGame.roundPhase === 'idle') {
          nextGame.totalTimeLeft = merged.totalRoundTime;
          nextGame.questionTimeLeft = merged.questionTime;
          nextGame.balanceTimeLeft = merged.balanceQuestionTime;
          try {
            localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(nextGame));
          } catch (e) {}
        }
        supabaseService.saveTournamentState(nextGame, merged);
        return nextGame;
      });

      return merged;
    });
  }, []);

  // Update Questions
  const updateQuestions = useCallback((newQuestions) => {
    setQuestionsState(newQuestions);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(newQuestions));
    supabaseService.seedQuestions(newQuestions);
  }, []);

  // Update User Role
  const updateRole = useCallback((role) => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  }, []);

  // Dynamic timing adjustments on the fly
  const adjustTotalTime = useCallback((delta) => {
    setGameState(prev => {
      const nextTime = Math.max(0, prev.totalTimeLeft + delta);
      const next = { ...prev, totalTimeLeft: nextTime };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const adjustQuestionTime = useCallback((delta) => {
    setGameState(prev => {
      const curQTime = prev.questionTimeLeft !== undefined ? prev.questionTimeLeft : (settingsRef.current.questionTime || 20);
      const nextTime = Math.max(1, curQTime + delta);
      const next = { ...prev, questionTimeLeft: nextTime };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // ==========================================
  // REALTIME BUZZER ACTIONS (SYNCED TO ALL SCREENS)
  // ==========================================
  const startBuzzerRound = useCallback((qIndex) => {
    setGameState(prev => {
      const curIndex = qIndex !== undefined ? qIndex : (prev.buzzerState?.currentQIndex || 0);
      const nextBuzzer = {
        isAuthorized: true,
        currentQIndex: curIndex,
        questionRevealed: true,
        showAnswer: false,
        buzzerWinner: null,
        buzzLocked: false,
        startTime: Date.now()
      };
      const next = { ...prev, buzzerState: nextBuzzer };
      persistState(next);
      if (soundsRef.current) soundsRef.current.playVictory();
      return next;
    });
  }, [persistState]);

  const revealBuzzerAnswer = useCallback((show) => {
    setGameState(prev => {
      const nextBuzzer = {
        ...(prev.buzzerState || DEFAULT_BUZZER_STATE),
        showAnswer: show !== undefined ? show : !(prev.buzzerState?.showAnswer)
      };
      const next = { ...prev, buzzerState: nextBuzzer };
      persistState(next);
      if (soundsRef.current && nextBuzzer.showAnswer) soundsRef.current.playLifeline();
      return next;
    });
  }, [persistState]);

  // Atomic award points + solution reveal in a single Supabase broadcast!
  // Atomic award points + single credit lock + solution reveal
  const awardBuzzerPoints = useCallback((isCorrect) => {
    setGameState(prev => {
      const winner = prev.buzzerState?.buzzerWinner;
      if (!winner || prev.buzzerState?.pointsAwarded) return prev; // Lock to only one credit per question

      const pts = isCorrect ? (settingsRef.current.basePoints || 10) : -5;
      const newScores = [...prev.scores];
      newScores[winner.teamIndex] = Math.max(0, (newScores[winner.teamIndex] || 0) + pts);

      const nextBuzzer = {
        ...(prev.buzzerState || DEFAULT_BUZZER_STATE),
        showAnswer: true,
        pointsAwarded: true,
        awardedPoints: pts
      };

      const next = { ...prev, scores: newScores, buzzerState: nextBuzzer };
      persistState(next);

      if (isCorrect) {
        if (soundsRef.current) soundsRef.current.playCorrect();
        if (confettiRef.current?.createBurst) confettiRef.current.createBurst();
        else if (confettiRef.current?.celebrate) confettiRef.current.celebrate();
      } else {
        if (soundsRef.current) soundsRef.current.playWrong();
      }
      return next;
    });
  }, [persistState]);

  const recordBuzzerHit = useCallback((teamIdx, elapsed) => {
    setGameState(prev => {
      if (prev.buzzerState?.buzzLocked) return prev;
      const nextBuzzer = {
        ...(prev.buzzerState || DEFAULT_BUZZER_STATE),
        buzzLocked: true,
        buzzerWinner: { teamIndex: teamIdx, elapsed: elapsed || '0.350' }
      };
      const next = { ...prev, buzzerState: nextBuzzer };
      persistState(next);
      if (soundsRef.current) soundsRef.current.playBuzzer();
      return next;
    });
  }, [persistState]);

  // Clear buzzer for current question (re-arm in case of accidental buzz)
  const resetBuzzerCurrentQuestion = useCallback(() => {
    setGameState(prev => {
      const nextBuzzer = {
        ...(prev.buzzerState || DEFAULT_BUZZER_STATE),
        buzzLocked: false,
        buzzerWinner: null,
        showAnswer: false,
        startTime: Date.now()
      };
      const next = { ...prev, buzzerState: nextBuzzer };
      persistState(next);
      if (soundsRef.current) soundsRef.current.playTick();
      return next;
    });
  }, [persistState]);

  const nextBuzzerQuestion = useCallback(() => {
    setGameState(prev => {
      const qs = questionsRef.current || [];
      const totalQs = qs.length > 0 ? qs.length : 65;
      const nextIdx = ((prev.buzzerState?.currentQIndex || 0) + 1) % totalQs;
      const nextBuzzer = {
        isAuthorized: true,
        currentQIndex: nextIdx,
        questionRevealed: true,
        showAnswer: false,
        buzzerWinner: null,
        buzzLocked: false,
        startTime: Date.now()
      };
      const next = { ...prev, buzzerState: nextBuzzer };
      persistState(next);
      if (soundsRef.current) soundsRef.current.playLifeline();
      return next;
    });
  }, [persistState]);

  const lockBuzzerGate = useCallback(() => {
    setGameState(prev => {
      const nextBuzzer = {
        ...DEFAULT_BUZZER_STATE,
        isAuthorized: false
      };
      const next = { ...prev, buzzerState: nextBuzzer };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // Team Buckets Partitioning
  const getTeamBuckets = useCallback(() => {
    const qs = questionsRef.current || [];
    const count = settingsRef.current.totalTeams || 4;
    const buckets = Array.from({ length: count }, () => []);
    const perTeam = Math.floor(qs.length / count);
    const remainder = qs.length % count;

    let start = 0;
    for (let i = 0; i < count; i++) {
      const bucketSize = perTeam + (i < remainder ? 1 : 0);
      buckets[i] = qs.slice(start, start + bucketSize);
      start += bucketSize;
    }
    return buckets;
  }, []);

  // Get Current Active Bucket
  const getCurrentTeamBucket = useCallback(() => {
    const buckets = getTeamBuckets();
    return buckets[gameState.currentTeamIndex] || [];
  }, [getTeamBuckets, gameState.currentTeamIndex]);

  // Get Current Active Question
  const getCurrentQuestion = useCallback(() => {
    if (gameState.roundPhase === 'team_round') {
      const bucket = getCurrentTeamBucket();
      return bucket[gameState.currentBucketQIndex] || null;
    }
    if (gameState.roundPhase === 'balance_pass') {
      return gameState.balanceQuestions[gameState.balanceQIndex] || null;
    }
    return null;
  }, [gameState.roundPhase, gameState.currentBucketQIndex, gameState.balanceQIndex, gameState.balanceQuestions, getCurrentTeamBucket]);

  // 1. Continuous, Flawless Timer for Main Team Round
  useEffect(() => {
    if ((gameState.roundPhase === 'team_round' || gameState.roundPhase === 'simultaneous_league') && !gameState.isPaused) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if ((prev.roundPhase !== 'team_round' && prev.roundPhase !== 'simultaneous_league') || prev.isPaused) {
            clearInterval(timerRef.current);
            return prev;
          }

          const currentSettings = settingsRef.current;
          const currentSounds = soundsRef.current;
          const buckets = getTeamBuckets();
          const bucket = buckets[prev.currentTeamIndex] || [];

          const nextTotalTime = prev.totalTimeLeft - 1;
          const currentQTime = prev.questionTimeLeft !== undefined ? prev.questionTimeLeft : (currentSettings.questionTime || 20);
          const nextQTime = currentQTime - 1;

          if (currentSounds) {
            if (nextTotalTime <= 10 && nextTotalTime > 0) {
              currentSounds.playWarning();
            } else if (nextQTime <= 4 && nextQTime > 0) {
              currentSounds.playWarning();
            } else if (nextTotalTime > 10) {
              currentSounds.playTick();
            }
          }

          // Case A: Total Round Time Expired -> End of Team Round
          if (nextTotalTime <= 0) {
            clearInterval(timerRef.current);
            if (currentSounds) currentSounds.playWrong();

            const results = [...prev.bucketResults];
            for (let i = prev.currentBucketQIndex; i < bucket.length; i++) {
              if (!results.some(r => r.question.id === bucket[i].id)) {
                results.push({
                  question: bucket[i],
                  selectedOption: null,
                  outcome: 'unanswered',
                  points: 0
                });
              }
            }

            const missed = results.filter(r => r.outcome !== 'correct').map(r => r.question);
            const next = {
              ...prev,
              totalTimeLeft: 0,
              questionTimeLeft: 0,
              roundPhase: 'round_summary',
              bucketResults: results,
              balanceQuestions: missed,
              attemptedBalanceTeams: [],
              selectedOption: null
            };
            persistState(next);
            return next;
          }

          // Case B: Per-Question Time Expired -> Auto-Skip to next question!
          if (nextQTime <= 0) {
            if (currentSounds) currentSounds.playWrong();
            const q = bucket[prev.currentBucketQIndex];

            const resultRecord = {
              question: q,
              selectedOption: null,
              outcome: 'timeout',
              points: 0
            };

            const newResults = [...prev.bucketResults, resultRecord];
            const nextQIdx = prev.currentBucketQIndex + 1;

            if (nextQIdx >= bucket.length) {
              const missed = newResults.filter(r => r.outcome !== 'correct').map(r => r.question);
              const next = {
                ...prev,
                totalTimeLeft: nextTotalTime,
                questionTimeLeft: 0,
                bucketResults: newResults,
                balanceQuestions: missed,
                attemptedBalanceTeams: [],
                roundPhase: 'round_summary',
                selectedOption: null
              };
              persistState(next);
              if (currentSounds) currentSounds.playVictory();
              return next;
            }

            const next = {
              ...prev,
              totalTimeLeft: nextTotalTime,
              questionTimeLeft: currentSettings.questionTime || 20,
              currentBucketQIndex: nextQIdx,
              bucketResults: newResults,
              selectedOption: null
            };
            persistState(next);
            return next;
          }

          // Normal smooth 1-second tick
          const next = { 
            ...prev, 
            totalTimeLeft: nextTotalTime, 
            questionTimeLeft: nextQTime 
          };
          try {
            localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.roundPhase, gameState.isPaused, getTeamBuckets, persistState]);

  // 2. Continuous, Flawless Timer for Balance Question Round
  useEffect(() => {
    if (gameState.roundPhase === 'balance_pass' && !gameState.isPaused) {
      balanceTimerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.roundPhase !== 'balance_pass' || prev.isPaused) {
            clearInterval(balanceTimerRef.current);
            return prev;
          }

          const currentSettings = settingsRef.current;
          const currentSounds = soundsRef.current;
          const nextTime = prev.balanceTimeLeft - 1;

          if (currentSounds) {
            if (nextTime <= 5 && nextTime > 0) {
              currentSounds.playWarning();
            } else if (nextTime > 5) {
              currentSounds.playTick();
            }
          }

          if (nextTime <= 0) {
            if (currentSounds) currentSounds.playWrong();
            const currentQ = prev.balanceQuestions[prev.balanceQIndex];
            const resultRecord = {
              question: currentQ,
              answeringTeam: prev.balanceTargetTeam,
              selectedOption: null,
              outcome: 'timeout',
              points: 0
            };

            const newBalanceResults = [...prev.balanceResults, resultRecord];
            const nextBalanceIdx = prev.balanceQIndex + 1;

            if (nextBalanceIdx >= prev.balanceQuestions.length) {
              const currentAttemptCorrectQIds = new Set(
                newBalanceResults.filter(r => r.outcome === 'correct').map(r => r.question.id)
              );

              const stillMissedQuestions = prev.balanceQuestions.filter(
                q => !currentAttemptCorrectQIds.has(q.id)
              );

              const updatedAttemptedTeams = Array.from(
                new Set([...(prev.attemptedBalanceTeams || []), prev.balanceTargetTeam])
              );

              const next = {
                ...prev,
                balanceResults: newBalanceResults,
                balanceQuestions: stillMissedQuestions,
                attemptedBalanceTeams: updatedAttemptedTeams,
                roundPhase: 'balance_summary',
                selectedOption: null
              };
              persistState(next);
              return next;
            }

            const next = {
              ...prev,
              balanceResults: newBalanceResults,
              balanceQIndex: nextBalanceIdx,
              balanceTimeLeft: currentSettings.balanceQuestionTime || 15,
              selectedOption: null
            };
            persistState(next);
            return next;
          }

          const next = { ...prev, balanceTimeLeft: nextTime };
          try {
            localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }, 1000);
    } else {
      if (balanceTimerRef.current) {
        clearInterval(balanceTimerRef.current);
        balanceTimerRef.current = null;
      }
    }

    return () => {
      if (balanceTimerRef.current) clearInterval(balanceTimerRef.current);
    };
  }, [gameState.roundPhase, gameState.isPaused, persistState]);

  // 1. Start Tournament / Team 1 Round
  const startTournament = useCallback(() => {
    const s = settingsRef.current;
    const count = s.totalTeams || 4;
    const next = {
      roundPhase: 'team_round',
      currentTeamIndex: 0,
      currentBucketQIndex: 0,
      totalTimeLeft: s.totalRoundTime || 120,
      questionTimeLeft: s.questionTime || 20,
      balanceTimeLeft: s.balanceQuestionTime || 15,
      scores: new Array(count).fill(0),
      bucketResults: [],
      balanceQuestions: [],
      balanceTargetTeam: 1,
      attemptedBalanceTeams: [],
      balanceQIndex: 0,
      balanceResults: [],
      selectedOption: null,
      isPaused: false,
      buzzerState: { ...DEFAULT_BUZZER_STATE },
  leagueState: { ...DEFAULT_LEAGUE_STATE },
      tournamentHistory: []
    };
    setGameState(next);
    persistState(next);
  }, [persistState]);

  // 2. Start Next Team's Main Round
  const startNextTeamRound = useCallback(() => {
    setGameState(prev => {
      const s = settingsRef.current;
      const nextTeamIdx = prev.currentTeamIndex + 1;
      const totalTeams = s.totalTeams || 4;

      if (nextTeamIdx >= totalTeams) {
        if (soundsRef.current) soundsRef.current.playVictory();
        if (confettiRef.current) confettiRef.current.celebrate(4000);
        const next = {
          ...prev,
          roundPhase: 'completed',
          isPaused: false
        };
        persistState(next);
        return next;
      }

      const defaultNextRebound = (nextTeamIdx + 1) % totalTeams;

      const next = {
        ...prev,
        roundPhase: 'team_round',
        currentTeamIndex: nextTeamIdx,
        currentBucketQIndex: 0,
        totalTimeLeft: s.totalRoundTime || 120,
        questionTimeLeft: s.questionTime || 20,
        balanceTimeLeft: s.balanceQuestionTime || 15,
        bucketResults: [],
        balanceQuestions: [],
        balanceTargetTeam: defaultNextRebound,
        attemptedBalanceTeams: [],
        balanceQIndex: 0,
        balanceResults: [],
        selectedOption: null,
        isPaused: false
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 3. Submit Answer in Team's Main Round
  const submitTeamAnswer = useCallback((optionIdx) => {
    setGameState(prev => {
      if (prev.roundPhase !== 'team_round' || prev.isPaused) return prev;
      const buckets = getTeamBuckets();
      const bucket = buckets[prev.currentTeamIndex] || [];
      const q = bucket[prev.currentBucketQIndex];
      if (!q) return prev;

      const s = settingsRef.current;
      const isCorrect = optionIdx === q.correctIndex;
      const teamIdx = prev.currentTeamIndex;
      const pts = isCorrect ? (q.points || s.basePoints || 10) : 0;

      if (isCorrect) {
        if (soundsRef.current) soundsRef.current.playCorrect();
        if (confettiRef.current) confettiRef.current.createBurst();
      } else {
        if (soundsRef.current) soundsRef.current.playWrong();
      }

      const newScores = [...prev.scores];
      if (isCorrect) {
        newScores[teamIdx] = (newScores[teamIdx] || 0) + pts;
      }

      const resultRecord = {
        question: q,
        selectedOption: optionIdx,
        outcome: isCorrect ? 'correct' : 'wrong',
        points: pts
      };

      const newResults = [...prev.bucketResults, resultRecord];
      const nextQIdx = prev.currentBucketQIndex + 1;

      if (nextQIdx >= bucket.length) {
        const missed = newResults.filter(r => r.outcome !== 'correct').map(r => r.question);
        const next = {
          ...prev,
          scores: newScores,
          bucketResults: newResults,
          balanceQuestions: missed,
          attemptedBalanceTeams: [],
          roundPhase: 'round_summary',
          selectedOption: null
        };
        persistState(next);
        if (soundsRef.current) soundsRef.current.playVictory();
        return next;
      }

      const next = {
        ...prev,
        scores: newScores,
        questionTimeLeft: s.questionTime || 20,
        bucketResults: newResults,
        currentBucketQIndex: nextQIdx,
        questionTimeLeft: s.questionTime || 20,
        selectedOption: null
      };
      persistState(next);
      return next;
    });
  }, [getTeamBuckets, persistState]);

  // 4. Skip Question in Team's Main Round
  const skipTeamQuestion = useCallback(() => {
    if (soundsRef.current) {
      soundsRef.current.playClick ? soundsRef.current.playClick() : soundsRef.current.playTick();
    }
    setGameState(prev => {
      if (prev.roundPhase !== 'team_round' || prev.isPaused) return prev;
      const buckets = getTeamBuckets();
      const bucket = buckets[prev.currentTeamIndex] || [];
      const q = bucket[prev.currentBucketQIndex];
      if (!q) return prev;

      const s = settingsRef.current;
      const resultRecord = {
        question: q,
        selectedOption: null,
        outcome: 'skipped',
        points: 0
      };

      const newResults = [...prev.bucketResults, resultRecord];
      const nextQIdx = prev.currentBucketQIndex + 1;

      if (nextQIdx >= bucket.length) {
        const missed = newResults.filter(r => r.outcome !== 'correct').map(r => r.question);
        const next = {
          ...prev,
          bucketResults: newResults,
          balanceQuestions: missed,
          attemptedBalanceTeams: [],
          roundPhase: 'round_summary',
          selectedOption: null
        };
        persistState(next);
        if (soundsRef.current) soundsRef.current.playVictory();
        return next;
      }

      const next = {
        ...prev,
        bucketResults: newResults,
        currentBucketQIndex: nextQIdx,
        questionTimeLeft: s.questionTime || 20,
        selectedOption: null
      };
      persistState(next);
      return next;
    });
  }, [getTeamBuckets, persistState]);

  // 5. Finish Team Round Early
  const finishTeamRound = useCallback(() => {
    setGameState(prev => {
      if (prev.roundPhase !== 'team_round') return prev;
      const buckets = getTeamBuckets();
      const bucket = buckets[prev.currentTeamIndex] || [];
      const results = [...prev.bucketResults];

      for (let i = prev.currentBucketQIndex; i < bucket.length; i++) {
        if (!results.some(r => r.question.id === bucket[i].id)) {
          results.push({
            question: bucket[i],
            selectedOption: null,
            outcome: 'unanswered',
            points: 0
          });
        }
      }

      const missed = results.filter(r => r.outcome !== 'correct').map(r => r.question);
      const next = {
        ...prev,
        roundPhase: 'round_summary',
        bucketResults: results,
        balanceQuestions: missed,
        attemptedBalanceTeams: [],
        selectedOption: null
      };
      persistState(next);
      return next;
    });
  }, [getTeamBuckets, persistState]);

  // 6. Start Balance Round
  const startBalanceRound = useCallback((targetTeamIndex) => {
    setGameState(prev => {
      const s = settingsRef.current;
      const activeBalanceTeam = targetTeamIndex !== undefined ? targetTeamIndex : prev.balanceTargetTeam;
      if (soundsRef.current) soundsRef.current.playBounce();
      const next = {
        ...prev,
        roundPhase: 'balance_pass',
        balanceTargetTeam: activeBalanceTeam,
        balanceQIndex: 0,
        balanceTimeLeft: s.balanceQuestionTime || 15,
        balanceResults: [],
        selectedOption: null,
        isPaused: false
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 7. Submit Answer in Balance Round
  const submitBalanceAnswer = useCallback((optionIdx) => {
    setGameState(prev => {
      if (prev.roundPhase !== 'balance_pass' || prev.isPaused) return prev;
      const currentQ = prev.balanceQuestions[prev.balanceQIndex];
      if (!currentQ) return prev;

      const s = settingsRef.current;
      const isCorrect = optionIdx === currentQ.correctIndex;
      const targetTeam = prev.balanceTargetTeam;
      const passPts = currentQ.passPoints || s.passPoints || 5;

      if (isCorrect) {
        if (soundsRef.current) soundsRef.current.playCorrect();
        if (confettiRef.current) confettiRef.current.createBurst();
      } else {
        if (soundsRef.current) soundsRef.current.playWrong();
      }

      const newScores = [...prev.scores];
      if (isCorrect) {
        newScores[targetTeam] = (newScores[targetTeam] || 0) + passPts;
      }

      const resultRecord = {
        question: currentQ,
        answeringTeam: targetTeam,
        selectedOption: optionIdx,
        outcome: isCorrect ? 'correct' : 'wrong',
        points: isCorrect ? passPts : 0
      };

      const newBalanceResults = [...prev.balanceResults, resultRecord];
      const nextBalanceIdx = prev.balanceQIndex + 1;

      if (nextBalanceIdx >= prev.balanceQuestions.length) {
        const currentAttemptCorrectQIds = new Set(
          newBalanceResults.filter(r => r.outcome === 'correct').map(r => r.question.id)
        );

        const stillMissedQuestions = prev.balanceQuestions.filter(
          q => !currentAttemptCorrectQIds.has(q.id)
        );

        const updatedAttemptedTeams = Array.from(
          new Set([...(prev.attemptedBalanceTeams || []), targetTeam])
        );

        const next = {
          ...prev,
          scores: newScores,
          balanceResults: newBalanceResults,
          balanceQuestions: stillMissedQuestions,
          attemptedBalanceTeams: updatedAttemptedTeams,
          roundPhase: 'balance_summary',
          selectedOption: null
        };
        persistState(next);
        if (soundsRef.current) soundsRef.current.playVictory();
        return next;
      }

      const next = {
        ...prev,
        scores: newScores,
        questionTimeLeft: s.questionTime || 20,
        balanceResults: newBalanceResults,
        balanceQIndex: nextBalanceIdx,
        balanceTimeLeft: s.balanceQuestionTime || 15,
        selectedOption: null
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 8. Skip Balance Question
  const skipBalanceQuestion = useCallback(() => {
    if (soundsRef.current) {
      soundsRef.current.playClick ? soundsRef.current.playClick() : soundsRef.current.playTick();
    }
    setGameState(prev => {
      if (prev.roundPhase !== 'balance_pass' || prev.isPaused) return prev;
      const currentQ = prev.balanceQuestions[prev.balanceQIndex];
      if (!currentQ) return prev;

      const s = settingsRef.current;
      const resultRecord = {
        question: currentQ,
        answeringTeam: prev.balanceTargetTeam,
        selectedOption: null,
        outcome: 'skipped',
        points: 0
      };

      const newBalanceResults = [...prev.balanceResults, resultRecord];
      const nextBalanceIdx = prev.balanceQIndex + 1;

      if (nextBalanceIdx >= prev.balanceQuestions.length) {
        const currentAttemptCorrectQIds = new Set(
          newBalanceResults.filter(r => r.outcome === 'correct').map(r => r.question.id)
        );

        const stillMissedQuestions = prev.balanceQuestions.filter(
          q => !currentAttemptCorrectQIds.has(q.id)
        );

        const updatedAttemptedTeams = Array.from(
          new Set([...(prev.attemptedBalanceTeams || []), prev.balanceTargetTeam])
        );

        const next = {
          ...prev,
          balanceResults: newBalanceResults,
          balanceQuestions: stillMissedQuestions,
          attemptedBalanceTeams: updatedAttemptedTeams,
          roundPhase: 'balance_summary',
          selectedOption: null
        };
        persistState(next);
        if (soundsRef.current) soundsRef.current.playVictory();
        return next;
      }

      const next = {
        ...prev,
        balanceResults: newBalanceResults,
        balanceQIndex: nextBalanceIdx,
        balanceTimeLeft: s.balanceQuestionTime || 15,
        selectedOption: null
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 9. Skip Balance Round Completely
  const skipBalanceRound = useCallback(() => {
    setGameState(prev => {
      const next = {
        ...prev,
        roundPhase: 'balance_summary',
        balanceQuestions: [],
        selectedOption: null
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 10. Pause / Resume Quiz
  const pauseQuiz = useCallback(() => {
    setGameState(prev => {
      const next = { ...prev, isPaused: true };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const resumeQuiz = useCallback(() => {
    setGameState(prev => {
      const next = { ...prev, isPaused: false };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 11. Score Adjustments
  const updateTeamScore = useCallback((teamIdx, delta) => {
    setGameState(prev => {
      const newScores = [...prev.scores];
      newScores[teamIdx] = Math.max(0, (newScores[teamIdx] || 0) + delta);
      const next = { ...prev, scores: newScores };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const setTeamScore = useCallback((teamIdx, score) => {
    setGameState(prev => {
      const newScores = [...prev.scores];
      newScores[teamIdx] = Math.max(0, score);
      const next = { ...prev, scores: newScores };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 12. Full Comprehensive Tournament Reset (All Tabs, Scores, Settings, LocalStorage & Supabase)
  const resetQuiz = useCallback(() => {
    const freshSettings = {
      ...DEFAULT_SETTINGS,
      collegeName: 'Dhaanish Ahmed Institute of Technology Coimbatore',
      eventName: 'Dait Quiz Mastery',
      totalTeams: 4,
      teamNames: ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"],
      teamColors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"],
      questionTime: 20,
      totalRoundTime: 120,
      balanceQuestionTime: 15,
      basePoints: 10,
      passPoints: 5,
      negativePoints: 0,
      enableNegativeMarking: false,
      enableSounds: true,
      enableAnimations: true
    };

    const nextGameState = {
      roundPhase: 'idle',
      currentTeamIndex: 0,
      currentBucketQIndex: 0,
      totalTimeLeft: 120,
      questionTimeLeft: 20,
      balanceTimeLeft: 15,
      scores: [0, 0, 0, 0],
      bucketResults: [],
      balanceQuestions: [],
      balanceTargetTeam: 1,
      attemptedBalanceTeams: [],
      balanceQIndex: 0,
      balanceResults: [],
      selectedOption: null,
      isPaused: false,
      buzzerState: { ...DEFAULT_BUZZER_STATE },
      leagueState: {
        isRoundStarted: false,
        claimedTeams: {},
        teamProgress: []
      },
      tournamentHistory: []
    };

    // 1. Clear all local storage caches across all tabs
    try {
      localStorage.removeItem('antigravity_claimed_team');
      localStorage.removeItem('antigravity_completed_sheet_teams');
      localStorage.removeItem('antigravity_saved_teams_map');
      localStorage.removeItem('antigravity_game_state_v3');
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(freshSettings));
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(nextGameState));
    } catch (e) {}

    // 2. Update local react state
    setSettingsState(freshSettings);
    setGameState(nextGameState);

    // 3. Persist reset state and settings to Supabase
    supabaseService.saveTournamentState(nextGameState, freshSettings);

    // 4. Dispatch global window event to immediately reset all active tab components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('antigravity_tournament_reset'));
    }

    if (soundsRef.current?.playVictory) {
      soundsRef.current.playVictory();
    }
  }, [persistState]);

    // ==========================================
  // SIMULTANEOUS MULTI-TEAM LEAGUE ACTIONS
  // ==========================================
  const claimLeagueTeam = useCallback((teamIdx, teamName, deviceId) => {
    setGameState(prev => {
      const curLeague = prev.leagueState || DEFAULT_LEAGUE_STATE;
      const nextClaimed = {
        ...(curLeague.claimedTeams || {}),
        [teamIdx]: {
          deviceId: deviceId || 'device_' + Math.random().toString(36).substring(2, 7),
          teamName: teamName || (settingsRef.current.teamNames?.[teamIdx] || `Team ${teamIdx + 1}`),
          claimedAt: Date.now()
        }
      };
      const next = {
        ...prev,
        leagueState: {
          ...curLeague,
          claimedTeams: nextClaimed
        }
      };
      persistState(next);
      if (soundsRef.current) soundsRef.current.playClick ? soundsRef.current.playClick() : soundsRef.current.playTick();
      return next;
    });
  }, [persistState]);

  const unclaimLeagueTeam = useCallback((teamIdx) => {
    setGameState(prev => {
      const curLeague = prev.leagueState || DEFAULT_LEAGUE_STATE;
      const nextClaimed = { ...(curLeague.claimedTeams || {}) };
      delete nextClaimed[teamIdx];
      const next = {
        ...prev,
        leagueState: {
          ...curLeague,
          claimedTeams: nextClaimed
        }
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  const startSimultaneousLeague = useCallback(() => {
    setGameState(prev => {
      const s = settingsRef.current;
      const count = s.totalTeams || 4;
      const curLeague = prev.leagueState || DEFAULT_LEAGUE_STATE;
      const initialProgress = Array.from({ length: count }, () => ({
        currentQIndex: 0,
        completed: false,
        correctCount: 0,
        answers: []
      }));

      const next = {
        ...prev,
        roundPhase: 'simultaneous_league',
        totalTimeLeft: s.totalRoundTime || 120,
        questionTimeLeft: s.questionTime || 20,
        isPaused: false,
        leagueState: {
          ...curLeague,
          isRoundStarted: true,
          teamProgress: initialProgress
        }
      };
      persistState(next);
      if (soundsRef.current) soundsRef.current.playVictory();
      return next;
    });
  }, [persistState]);

  const submitSimultaneousAnswer = useCallback((teamIdx, optIdx, isCorrect) => {
    setGameState(prev => {
      const s = settingsRef.current;
      const curLeague = prev.leagueState || DEFAULT_LEAGUE_STATE;
      const teamProg = [...(curLeague.teamProgress || [])];
      const curProg = teamProg[teamIdx] || { currentQIndex: 0, completed: false, correctCount: 0, answers: [] };

      const pts = isCorrect ? (s.basePoints || 10) : 0;
      const newScores = [...prev.scores];
      if (isCorrect) {
        newScores[teamIdx] = (newScores[teamIdx] || 0) + pts;
      }

      const buckets = getTeamBuckets();
      const bucket = buckets[teamIdx] || [];
      const nextQIdx = curProg.currentQIndex + 1;
      const isDone = nextQIdx >= bucket.length;

      teamProg[teamIdx] = {
        ...curProg,
        currentQIndex: nextQIdx,
        completed: isDone,
        correctCount: curProg.correctCount + (isCorrect ? 1 : 0),
        answers: [...(curProg.answers || []), { option: optIdx, correct: isCorrect, points: pts }]
      };

      const allDone = teamProg.slice(0, s.totalTeams || 4).every(p => p && p.completed);

      const next = {
        ...prev,
        scores: newScores,
        questionTimeLeft: s.questionTime || 20,
        roundPhase: allDone ? 'completed' : prev.roundPhase,
        leagueState: {
          ...curLeague,
          teamProgress: teamProg
        }
      };

      persistState(next);

      if (isCorrect) {
        if (soundsRef.current) soundsRef.current.playCorrect();
        if (confettiRef.current?.createBurst) confettiRef.current.createBurst();
      } else {
        if (soundsRef.current) soundsRef.current.playWrong();
      }

      return next;
    });
  }, [getTeamBuckets, persistState]);

  const skipSimultaneousQuestion = useCallback((teamIdx) => {
    setGameState(prev => {
      const s = settingsRef.current;
      const curLeague = prev.leagueState || DEFAULT_LEAGUE_STATE;
      const teamProg = [...(curLeague.teamProgress || [])];
      const curProg = teamProg[teamIdx] || { currentQIndex: 0, completed: false, correctCount: 0, answers: [] };

      const buckets = getTeamBuckets();
      const bucket = buckets[teamIdx] || [];
      const nextQIdx = curProg.currentQIndex + 1;
      const isDone = nextQIdx >= bucket.length;

      teamProg[teamIdx] = {
        ...curProg,
        currentQIndex: nextQIdx,
        completed: isDone,
        answers: [...(curProg.answers || []), { option: null, correct: false, points: 0, skipped: true }]
      };

      const allDone = teamProg.slice(0, s.totalTeams || 4).every(p => p && p.completed);

      const next = {
        ...prev,
        roundPhase: allDone ? 'completed' : prev.roundPhase,
        leagueState: {
          ...curLeague,
          teamProgress: teamProg
        }
      };

      persistState(next);
      if (soundsRef.current) soundsRef.current.playTick();
      return next;
    });
  }, [getTeamBuckets, persistState]);

  const resetSimultaneousLeague = useCallback(() => {
    setGameState(prev => {
      const s = settingsRef.current;
      const count = s.totalTeams || 4;
      const next = {
        ...prev,
        roundPhase: 'idle',
        scores: new Array(count).fill(0),
        leagueState: {
          isRoundStarted: false,
          claimedTeams: {},
          teamProgress: Array.from({ length: count }, () => ({
            currentQIndex: 0,
            completed: false,
            correctCount: 0,
            answers: []
          }))
        }
      };
      persistState(next);
      return next;
    });
  }, [persistState]);

  return {
    settings,
    claimLeagueTeam,
    unclaimLeagueTeam,
    startSimultaneousLeague,
    submitSimultaneousAnswer,
    skipSimultaneousQuestion,
    resetSimultaneousLeague,
    updateSettings,
    questions,
    updateQuestions,
    userRole,
    updateRole,
    gameState,
    adjustTotalTime,
    adjustQuestionTime,
    startBuzzerRound,
    revealBuzzerAnswer,
    awardBuzzerPoints,
    recordBuzzerHit,
    resetBuzzerCurrentQuestion,
    nextBuzzerQuestion,
    lockBuzzerGate,
    getTeamBuckets,
    getCurrentTeamBucket,
    getCurrentQuestion,
    startTournament,
    startNextTeamRound,
    submitTeamAnswer,
    skipTeamQuestion,
    finishTeamRound,
    startBalanceRound,
    submitBalanceAnswer,
    skipBalanceQuestion,
    skipBalanceRound,
    pauseQuiz,
    resumeQuiz,
    updateTeamScore,
    setTeamScore,
    resetQuiz,
    sounds,
    confetti
  };
}
