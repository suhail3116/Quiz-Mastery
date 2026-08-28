import React from 'react';
import { CircularTimer } from './CircularTimer';

export function QuestionCard({ 
  question, 
  questionIndex, 
  totalQuestions, 
  gameState, 
  onSelectOption 
}) {
  if (!question) return null;

  const optLabels = ['A', 'B', 'C', 'D'];
  const isAnswered = gameState.status === 'answered' || gameState.status === 'exhausted' || gameState.isAnswerRevealed;
  const canInteract = gameState.status === 'playing';

  return (
    <div className="arena-card">
      {/* Meta Header */}
      <div className="q-meta-strip">
        <div className="q-counter-group">
          <span className="q-index-highlight">Question {questionIndex + 1}</span>
          <span className="q-total-label">of {totalQuestions}</span>
        </div>
        <div className="q-category-badge">{question.category || 'Operating Systems'}</div>
        <div className={`q-points-badge ${gameState.isBounced ? 'bounced' : 'base'}`}>
          {gameState.isBounced ? (
            <>⚡ {gameState.currentPoints} pts <span className="passed-badge">Passed (+{gameState.currentPoints})</span></>
          ) : (
            <>🎯 {gameState.currentPoints} pts (Base)</>
          )}
        </div>
      </div>

      {/* Question Stage & Circular Timer */}
      <div className="q-stage-row">
        <div className="q-text-box">
          <h2 className="q-text">{question.text}</h2>
        </div>
        <CircularTimer 
          timeLeft={gameState.timeLeft} 
          maxTime={gameState.currentDuration} 
          isPlaying={gameState.status === 'playing'}
        />
      </div>

      {/* Options Grid */}
      <div className="options-grid">
        {question.options.map((opt, idx) => {
          let optionClass = 'option-card';
          const isSelected = gameState.selectedOption === idx;
          const isCorrect = idx === question.correctIndex;

          if (isAnswered) {
            if (isCorrect) optionClass += ' correct-option';
            else if (isSelected) optionClass += ' wrong-option';
            else optionClass += ' disabled-option';
          } else if (canInteract) {
            optionClass += ' clickable';
          }

          return (
            <button
              key={idx}
              className={optionClass}
              onClick={() => onSelectOption(idx)}
              disabled={!canInteract}
            >
              <div className="option-prefix">{optLabels[idx]}</div>
              <div className="option-text">{opt}</div>
              {isAnswered && isCorrect && <div className="option-icon">✅</div>}
              {isAnswered && isSelected && !isCorrect && <div className="option-icon">❌</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
