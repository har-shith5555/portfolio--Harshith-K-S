import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useTypewriter, useScrollReveal, useTilt, useParallax, useCounter } from '../hooks/useInteractive';
import ParticleCanvas from '../components/ParticleCanvas';
import './Home.css';

// ─── Skill data with proficiency levels ──────────────────────────────────────
const SKILLS = [
  { name: 'Python',          level: 92, category: 'AI / ML' },
  { name: 'Gemini / Vertex', level: 85, category: 'AI / ML' },
  { name: 'Prompt Engineering', level: 88, category: 'AI / ML' },
  { name: 'TensorFlow',      level: 72, category: 'AI / ML' },
  { name: 'PyTorch',         level: 68, category: 'AI / ML' },
  { name: 'pandas / NumPy',  level: 87, category: 'Data'    },
  { name: 'Selenium',        level: 80, category: 'Data'    },
  { name: 'FastAPI / Flask', level: 75, category: 'Backend' },
  { name: 'React',           level: 70, category: 'Frontend'},
  { name: 'Git',             level: 85, category: 'Tools'   },
  { name: 'AI Production (LLM/RAG)',  level: 80, category: 'AI / ML' },
  { name: 'Machine Learning',  level: 79, category: 'AI / ML' },
];

// ─── Animated skill bar ───────────────────────────────────────────────────────
function SkillBar({ name, level, category, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setWidth(level), delay);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [level, delay]);

  const categoryColors = {
    'AI / ML': '#2997ff',
    'Data':    '#30d158',
    'Backend': '#ff9f0a',
    'Frontend':'#bf5af2',
    'Tools':   '#64d2ff',
  };
  const color = categoryColors[category] ?? '#2997ff';

  return (
    <div ref={ref} className="skill-bar-wrap">
      <div className="skill-bar-header">
        <span className="skill-name">{name}</span>
        <span className="skill-level" style={{ color }}>{level}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 12px ${color}44`,
            transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Stats counter ────────────────────────────────────────────────────────────
function StatCounter({ target, suffix = '', label }) {
  const { count, ref } = useCounter(target, 1400);
  return (
    <div ref={ref} className="stat-item">
      <span className="stat-value">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// ─── 3D blog card ─────────────────────────────────────────────────────────────
function BlogCard({ post, index }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(6);
  const revealRef = useScrollReveal(0.1);

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  return (
    <div ref={revealRef} className={`reveal reveal-delay-${index + 1}`}>
      <Link
        to={`/blog/${post.slug}`}
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="blog-card-3d"
        style={{ willChange: 'transform', transition: 'transform 0.15s ease, border-color 0.3s ease' }}
      >
        <div className="blog-card-3d-inner">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {post.tags.slice(0,2).map(t => (
                <span key={t} className="badge badge-tag">{t}</span>
              ))}
            </div>
            <span className="font-mono" style={{ fontSize:11, color:'var(--text-4)' }}>{formatDate(post.createdAt)}</span>
          </div>
          <h3 className="blog-card-title">{post.title}</h3>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <div className="blog-card-cta">
            Read article
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Main Home component ──────────────────────────────────────────────────────
export default function Home() {
  const { getPublished } = useBlog();
  const recentPosts = getPublished().slice(0, 3);
  const parallaxRef = useParallax(0.2);

  const roles = [
    'AI / ML Engineer',
    'Python Developer',
    'Pipeline Builder',
    'Vision AI Enthusiast',
  ];
  const typewriter = useTypewriter(roles, { speed: 70, deleteSpeed: 35, pause: 2000 });

  const skillsRef = useScrollReveal(0.05);
  const statsRef  = useScrollReveal(0.2);
  const blogRef   = useScrollReveal(0.05);

  return (
    <main className="page home-page">
      {/* Particle canvas background */}
      <ParticleCanvas />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero">
        {/* Gradient orb — parallax */}
        <div ref={parallaxRef} className="hero-orb" aria-hidden="true" />

        <div className="container hero-inner">
          <div className="hero-content">
            {/* Status pill */}
            <div className="hero-status animate-fade-up">
              <span className="status-dot" />
              Available for opportunities
            </div>

            {/* Name */}
            <h1 className="hero-name animate-fade-up delay-1">
              <span className="text-shimmer">Harshith K S</span>
            </h1>

            {/* Typewriter role */}
            <p className="hero-role animate-fade-up delay-2">
              {typewriter}
              <span className="cursor-blink" />
            </p>

            {/* Bio */}
            <p className="hero-bio animate-fade-up delay-3">
              Generative AI / AI-ML Engineer with experience building LLM-powered applications, RAG pipelines, and conversational
AI using Python.  Skilled in LangChain, LlamaIndex, and vector databases (FAISS, Chroma) for semantic search and
intelligent systems. Experienced in deploying AI models through FastAPI/Flask APIs and integrating scalable backend
solutions. Strong background in NLP, prompt engineering, and developing production-ready Generative AI applications.
            </p>

            {/* CTAs */}
            <div className="hero-ctas animate-fade-up delay-4">
              <Link to="/projects" className="btn btn-primary">
                View Projects
              </Link>
              <Link to="/blog" className="btn btn-outline">
                Read Blog
              </Link>
              <a href="mailto:hharshith159@gmail.com" className="btn btn-ghost" style={{ fontSize:13 }}>
                Get in touch →
              </a>
            </div>

            {/* Social links */}
            <div className="hero-socials animate-fade-up delay-5">
              {[
                { href: 'https://github.com/har-shith5555',     label: 'GitHub'   },
                { href: 'https://www.linkedin.com/in/harshith-k-s-3728b5253',     label: 'LinkedIn' },
                { href: 'mailto:hharshith159@gmail.com',        label: 'Email'    },
              ].map(({ href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="social-link">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Floating avatar — YOUR PHOTO ──────────────────────── */}
          <div className="hero-avatar-wrap animate-fade-up delay-2">
            <div className="hero-avatar animate-float">
              <div className="avatar-ring" />
              {/*
                ── HOW TO ADD YOUR PHOTO ──────────────────────────────
                1. Copy your photo into the `public` folder
                2. Rename it to `photo.jpg`
                   Full path: portfolio/public/photo.jpg
                3. That's it — the image will appear here automatically
              */}
              <img
                src="/photo.jpg"
                alt="Harshith K S"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                   objectPosition: 'center 20%',
                  borderRadius: '50%',
                }}
              />
            </div>

            {/* Floating badges */}
            <div className="float-badge float-badge-1 animate-fade-up delay-4">
              <span style={{ fontSize:16 }}>🤖</span>
              <span>  </span>
            </div>
            <div className="float-badge float-badge-2 animate-fade-up delay-5">
              <span style={{ fontSize:16 }}>🐍</span>
              <span> </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator animate-fade-up delay-6">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────────────── */}
      <section className="skills-section">
        <div className="container">
          <div ref={skillsRef} className="reveal">
            <div className="section-heading">
              <span className="label">Skills</span>
            </div>
            <div className="skills-grid">
              {SKILLS.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  {...skill}
                  delay={i * 60}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent Blog Posts ──────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="blog-section">
          <div className="container">
            <div ref={blogRef} className="reveal">
              <div className="section-heading">
                <span className="label">Recent Writing</span>
              </div>
            </div>
            <div className="blog-cards-grid">
              {recentPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))}
            </div>
            <div style={{ marginTop:36 }} className="reveal">
              <Link to="/blog" className="btn btn-outline">
                All posts →
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}