import { useRef, useCallback } from 'react';

export function useConfetti() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animIdRef = useRef(null);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e'];

  const createBurst = useCallback((x, y, count = 80) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startX = x !== undefined ? x : canvas.width / 2;
    const startY = y !== undefined ? y : canvas.height / 3;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particlesRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 60,
        shape: Math.random() > 0.3 ? 'rect' : 'circle'
      });
    }

    if (!animIdRef.current) {
      animate();
    }
  }, []);

  const celebrate = useCallback((durationMs = 3000) => {
    const interval = 250;
    const bursts = durationMs / interval;
    let count = 0;

    const timer = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rx = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const ry = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
      createBurst(rx, ry, 60);
      count++;
      if (count >= bursts) {
        clearInterval(timer);
      }
    }, interval);
  }, [createBurst]);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.life++;
      p.opacity = Math.max(0, 1 - (p.life / p.maxLife));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      }

      ctx.restore();

      if (p.life >= p.maxLife || p.y > canvas.height + 50) {
        particlesRef.current.splice(i, 1);
      }
    }

    if (particlesRef.current.length > 0) {
      animIdRef.current = requestAnimationFrame(animate);
    } else {
      animIdRef.current = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const clear = useCallback(() => {
    particlesRef.current = [];
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
      animIdRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return {
    canvasRef,
    createBurst,
    celebrate,
    clear,
    fire: createBurst // Alias for backward compatibility
  };
}
