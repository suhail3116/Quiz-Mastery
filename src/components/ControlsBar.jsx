import React from 'react';

export function ControlsBar({ gameState, onPause, onResume, onSkip, onReveal, onNext }) {
  const isPlaying = gameState.status === 'playing';
  const isPaused = gameState.status === 'paused';
  const isFinishedRound = gameState.status === 'answered' || gameState.status === 'exhausted';

  return (
    <div className="controls-bar">
      {isPlaying && (
        <>
          <button className="btn btn-outline" onClick={onPause}>⏸️ Pause (Space)</button>
          <button className="btn btn-warning" onClick={onSkip}>⏩ Skip / Bounce (S)</button>
          <button className="btn btn-ghost" onClick={onReveal}>👁️ Reveal Answer</button>
        </>
      )}
      {isPaused && (
        <>
          <button className="btn btn-primary" onClick={onResume}>▶️ Resume (Space)</button>
          <button className="btn btn-warning" onClick={onSkip}>⏩ Skip / Bounce (S)</button>
        </>
      )}
      {isFinishedRound && (
        <button className="btn btn-primary btn-lg pulse-glow" onClick={onNext}>
          Next Question ➔ (N)
        </button>
      )}
    </div>
  );
}
