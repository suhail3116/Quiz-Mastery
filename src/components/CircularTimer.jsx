import React from 'react';

export function CircularTimer({ timeLeft, maxTime, isPlaying }) {
  const safeMax = maxTime || 30;
  const safeTime = Math.max(0, timeLeft !== undefined ? timeLeft : safeMax);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = safeTime / safeMax;
  const offset = circumference - progress * circumference;

  let widgetClass = 'timer-widget normal';
  let strokeColor = '#4f46e5';

  if (safeTime <= 5 && isPlaying) {
    widgetClass = 'timer-widget warning-pulse';
    strokeColor = '#ef4444';
  } else if (safeTime <= 10) {
    widgetClass = 'timer-widget urgency-medium';
    strokeColor = '#f59e0b';
  }

  return (
    <div className={widgetClass}>
      <svg className="timer-svg" viewBox="0 0 100 100">
        <circle className="timer-bg-circle" cx="50" cy="50" r={radius}></circle>
        <circle
          className="timer-progress-circle"
          cx="50"
          cy="50"
          r={radius}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: offset,
            stroke: strokeColor
          }}
        ></circle>
      </svg>
      <div className="timer-text-overlay">
        <span className="timer-val">{safeTime}</span>
        <span className="timer-sec-label">SEC</span>
      </div>
    </div>
  );
}
