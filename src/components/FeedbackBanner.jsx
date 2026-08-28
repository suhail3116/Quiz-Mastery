import React from 'react';

export function FeedbackBanner({ question, gameState, settings }) {
  if (gameState.status === 'answered' && gameState.answerOutcome === 'correct') {
    const winnerName = settings.teamNames[gameState.activeTeamIndex] || `Team ${gameState.activeTeamIndex + 1}`;
    return (
      <div className="feedback-box correct-box" style={{ marginTop: '16px' }}>
        <div className="feedback-title">🎉 CORRECT ANSWER!</div>
        <div className="feedback-desc">
          <b>{winnerName}</b> earned <b>+{gameState.currentPoints} points</b>!
        </div>
        {question?.explanation && (
          <div className="feedback-explanation">
            💡 <b>Explanation:</b> {question.explanation}
          </div>
        )}
      </div>
    );
  }

  if (gameState.status === 'exhausted') {
    const correctLetter = ['A', 'B', 'C', 'D'][question?.correctIndex || 0];
    const correctText = question?.options[question?.correctIndex || 0];
    return (
      <div className="feedback-box exhausted-box" style={{ marginTop: '16px' }}>
        <div className="feedback-title">⚠️ ALL TEAMS MISSED! (Question Exhausted)</div>
        <div className="feedback-desc">
          The correct answer was <b>Option {correctLetter}: {correctText}</b>. No points awarded.
        </div>
        {question?.explanation && (
          <div className="feedback-explanation">
            💡 <b>Explanation:</b> {question.explanation}
          </div>
        )}
      </div>
    );
  }

  return null;
}
