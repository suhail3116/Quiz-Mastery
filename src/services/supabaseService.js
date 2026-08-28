import { supabase } from '../lib/supabaseClient';
import defaultOsQuestions from '../data/osQuestions.json';

const SESSION_CLIENT_ID = 'client_' + Math.random().toString(36).substring(2) + '_' + Date.now();

const DEFAULT_SETTINGS = {
  totalTeams: 4,
  totalRoundTime: 120,
  questionTime: 20,
  balanceQuestionTime: 15,
  basePoints: 10,
  passPoints: 5,
  soundEnabled: true,
  teamNames: ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans", "Thread Racers", "Stack Masters"],
  teamColors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4"]
};

const DEFAULT_GAME_STATE = {
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
  tournamentHistory: []
};

export const supabaseService = {
  clientId: SESSION_CLIENT_ID,

  // 1. Fetch Tournament State & Settings
  async getTournamentState() {
    try {
      const { data, error } = await supabase
        .from('tournament_state')
        .select('*')
        .eq('id', 'active')
        .single();

      if (error || !data) {
        await this.saveTournamentState(DEFAULT_GAME_STATE, DEFAULT_SETTINGS);
        return { gameState: DEFAULT_GAME_STATE, settings: DEFAULT_SETTINGS };
      }

      return {
        gameState: data.game_state || DEFAULT_GAME_STATE,
        settings: data.settings || DEFAULT_SETTINGS
      };
    } catch (e) {
      console.warn('[Supabase] Falling back to defaults:', e);
      return { gameState: DEFAULT_GAME_STATE, settings: DEFAULT_SETTINGS };
    }
  },

  // 2. Persist Tournament State & Settings
  async saveTournamentState(gameState, settings) {
    try {
      const payload = {
        id: 'active',
        game_state: {
          ...gameState,
          _senderId: SESSION_CLIENT_ID
        },
        settings: settings,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('tournament_state')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('[Supabase] Save error:', error);
      }
    } catch (e) {
      console.warn('[Supabase] Save exception:', e);
    }
  },

  // 3. Fetch Questions from Supabase (or fallback to local osQuestions.json)
  async getQuestions() {
    try {
      const { data, error } = await supabase
        .from('tournament_questions')
        .select('*')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) {
        await this.seedQuestions(defaultOsQuestions);
        return defaultOsQuestions;
      }

      return data.map(row => ({
        id: row.id,
        text: row.text,
        options: row.options,
        correctIndex: row.correct_index,
        category: row.category,
        explanation: row.explanation,
        points: row.points || 10,
        passPoints: row.pass_points || 5
      }));
    } catch (e) {
      console.warn('[Supabase] Questions fallback to JSON:', e);
      return defaultOsQuestions;
    }
  },

  // 4. Seed Questions to Supabase
  async seedQuestions(questions) {
    try {
      const rows = questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correct_index: q.correctIndex,
        category: q.category,
        explanation: q.explanation,
        points: q.points || 10,
        pass_points: q.passPoints || 5
      }));

      await supabase.from('tournament_questions').upsert(rows, { onConflict: 'id' });
    } catch (e) {
      console.warn('[Supabase] Seed questions exception:', e);
    }
  },

  // 5. Realtime Subscriptions (Ignore echoes from self)
  subscribe(onStateChange, onBuzzer) {
    const channel = supabase
      .channel('public:tournament_live_' + SESSION_CLIENT_ID)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournament_state' },
        (payload) => {
          if (payload.new && payload.new.game_state) {
            // Ignore echo if sender is this exact client
            if (payload.new.game_state._senderId === SESSION_CLIENT_ID) {
              return;
            }
            if (onStateChange) {
              onStateChange({
                gameState: payload.new.game_state,
                settings: payload.new.settings
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tournament_buzzers' },
        (payload) => {
          if (payload.new && onBuzzer) {
            onBuzzer(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // 6. Record Buzzer Event
  async triggerBuzzer(teamIndex, teamName, reactionSeconds) {
    try {
      await supabase.from('tournament_buzzers').insert([{
        team_index: teamIndex,
        team_name: teamName,
        reaction_seconds: parseFloat(reactionSeconds)
      }]);
    } catch (e) {
      console.warn('[Supabase] Buzzer trigger error:', e);
    }
  }
};
