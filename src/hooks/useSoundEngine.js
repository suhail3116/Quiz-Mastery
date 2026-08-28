import { useRef, useCallback } from 'react';

export function useSoundEngine(enabled = true) {
  const audioCtxRef = useRef(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTone = useCallback((freq, duration, type = 'sine', gainVal = 0.1) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }, [enabled]);

  // 1. Correct Answer Fanfare
  const playCorrect = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        setTimeout(() => {
          playTone(freq, 0.18, 'triangle', 0.15);
        }, i * 70);
      });
    } catch (e) {}
  }, [enabled, playTone]);

  // 2. Wrong Answer Chord
  const playWrong = useCallback(() => {
    if (!enabled) return;
    try {
      [220, 207.65, 196].forEach((freq, i) => {
        setTimeout(() => {
          playTone(freq, 0.25, 'sawtooth', 0.12);
        }, i * 90);
      });
    } catch (e) {}
  }, [enabled, playTone]);

  // 3. Regular Clock Tick
  const playTick = useCallback(() => {
    playTone(880, 0.04, 'sine', 0.05);
  }, [playTone]);

  // 4. Urgency Warning Beep
  const playWarning = useCallback(() => {
    playTone(1046.5, 0.08, 'square', 0.08);
  }, [playTone]);

  // 5. Victory Tournament Trumpet
  const playVictory = useCallback(() => {
    if (!enabled) return;
    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.2 },
      { f: 1046.5, d: 0.4 }
    ];
    melody.forEach((note, i) => {
      setTimeout(() => {
        playTone(note.f, note.d, 'triangle', 0.18);
      }, i * 140);
    });
  }, [enabled, playTone]);

  // 6. Balance Rebound Bounce Whoosh
  const playBounce = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }, [enabled]);

  // 7. Live Buzzer Alarm (Fastest Finger)
  const playBuzzer = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [440, 554.37, 659.25].forEach((freq) => {
        playTone(freq, 0.35, 'sawtooth', 0.2);
      });
    } catch (e) {}
  }, [enabled, playTone]);

  // 8. Ice Time Freeze Lifeline
  const playFreeze = useCallback(() => {
    if (!enabled) return;
    try {
      [1200, 1500, 1800, 2400].forEach((freq, i) => {
        setTimeout(() => {
          playTone(freq, 0.12, 'sine', 0.08);
        }, i * 50);
      });
    } catch (e) {}
  }, [enabled, playTone]);

  // 9. Lifeline Power-Up Activation
  const playLifeline = useCallback(() => {
    if (!enabled) return;
    [400, 600, 800, 1200].forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.15, 'sine', 0.1);
      }, i * 60);
    });
  }, [enabled, playTone]);

  return {
    playCorrect,
    playWrong,
    playTick,
    playWarning,
    playVictory,
    playBounce,
    playBuzzer,
    playFreeze,
    playLifeline
  };
}
