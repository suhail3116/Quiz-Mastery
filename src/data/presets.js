import osQuestions from './osQuestions.json';

export const PRESET_QUESTION_BANKS = {
  os_full: {
    id: "os_full",
    name: "Operating Systems (Official PDF Bank - 65 Qs)",
    description: "65 Questions covering OS Basics, Structures, UNIX/Linux, System Calls, Process/Threads & CPU Scheduling.",
    questions: osQuestions,
    settings: {
      totalTeams: 4,
      totalRoundTime: 120,
      questionTime: 20,
      balanceQuestionTime: 15,
      basePoints: 10,
      passPoints: 5,
      soundEnabled: true,
      teamNames: ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans"],
      teamColors: ["#4f46e5", "#059669", "#d97706", "#e11d48"]
    }
  },
  os_quick: {
    id: "os_quick",
    name: "OS Rapid Fire (12 Qs)",
    description: "Rapid fire 12 questions bank (3 questions per team).",
    questions: osQuestions.slice(0, 12),
    settings: {
      totalTeams: 4,
      totalRoundTime: 60,
      questionTime: 15,
      balanceQuestionTime: 10,
      basePoints: 10,
      passPoints: 5,
      soundEnabled: true,
      teamNames: ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans"],
      teamColors: ["#4f46e5", "#059669", "#d97706", "#e11d48"]
    }
  }
};
