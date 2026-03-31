import { useEffect, useRef } from 'react';

/**
 * ParticleCanvas — renders a subtle animated particle network on a <canvas>.
 * Apple-style: very dim, fine-grained, elegant.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let particles = [];
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 140;
    const MOUSE = { x: -9999, y: -9999 };

    // Track mouse for subtle attraction
    const onMouseMove = (e) => {
      MOUSE.x = e.clientX;
      MOUSE.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Spawn particles
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.35 + 0.1;
      }
      update() {
        // Subtle mouse repulsion
        const dx = this.x - MOUSE.x;
        const dy = this.y - MOUSE.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.vx += (dx / dist) * 0.04;
          this.vy += (dy / dist) * 0.04;
        }
        // Dampen velocity
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.x += this.vx;
        this.y += this.vy;
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach((p) => { p.update(); p.draw(); });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}
