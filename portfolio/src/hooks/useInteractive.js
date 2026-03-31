import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Typewriter hook ──────────────────────────────────────────────────────────
// Cycles through an array of strings with a typewriter effect.
export function useTypewriter(words = [], { speed = 80, deleteSpeed = 40, pause = 1800 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[wordIndex % words.length];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setIsDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex, words, speed, deleteSpeed, pause]);

  return displayed;
}

// ─── Scroll animation hook ────────────────────────────────────────────────────
// Returns a ref; adds 'visible' class when element enters viewport.
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

// ─── 3D tilt hook ─────────────────────────────────────────────────────────────
// Returns event handlers for a 3D tilt effect on mouse move.
export function useTilt(intensity = 8) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.style.transform = `
      perspective(800px)
      rotateY(${x * intensity}deg)
      rotateX(${-y * intensity}deg)
      translateZ(8px)
    `;
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  }, []);

  return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave };
}

// ─── Parallax hook ────────────────────────────────────────────────────────────
// Returns a ref; translates element vertically based on scroll position.
export function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const scrollY = window.scrollY;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

// ─── Counter animation hook ───────────────────────────────────────────────────
// Animates a number from 0 to target when element is in view.
export function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
          else setCount(target);
        };
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}
