import { useState } from 'react';
import { useTilt, useScrollReveal } from '../hooks/useInteractive';
import './Projects.css';

const PROJECTS = [
  {
    id: 1,
    emoji: '🤖',
    title: 'AI Alt-Text Pipeline',
    tagline: 'Automated image accessibility for academic publishing',
    description: 'I worked on designing and optimizing an AI-driven alt text generation system that automatically produces accessible and screen-reader-friendly image descriptions under strict constraints. The system uses Python and large language models (LLMs) with structured prompt engineering to generate meaningful alt text based on image content. A key component of the system is image complexity classification (simple, moderate, complex), which dynamically controls the verbosity, structure, and semantic depth of the generated descriptions. To ensure compliance with accessibility standards, I implemented a deterministic validation layer that enforces a strict 250-character limit, checks formatting, and removes redundancy. I also developed word and character optimization strategies, including identifying safe word ranges and handling edge cases such as numerical-heavy or scientific content. Additionally, the system is optimized for screen reader behavior, ensuring that the output is clear, concise, and easy to understand when read aloud. Overall, the project combines LLM-based semantic generation with rule-based validation and optimization, resulting in a scalable, consistent, and accessibility-compliant alt text generation pipeline.',
    stack: ['Python', 'Google Vertex AI', 'Gemini 1.5 Pro', 'PyMuPDF', 'openpyxl', 'lxml'],
    highlights: ['~92% single-pass accuracy', '3-source caption fallback', 'Self-correction prompt loop', 'BAM/MNF ontology output'],
    github: 'https://github.com/harshith',
    status: 'In Production',
    accent: '#2997ff',
    showGithub: false,
  },
  {
    id: 2,
    emoji: '📄',
    title: 'MSXpert Report Generator',
    tagline: 'Manuscript analysis to polished HTML reports',
    description: 'The MSXpert Report Generator is an AI-assisted manuscript analysis and reporting system that converts structured outputs from a Python-based pipeline into polished, standalone HTML reports for academic and editorial workflows. It automates manuscript quality assurance by detecting statistical inconsistencies, tortured phrases, formatting issues, and linguistic anomalies, reducing manual effort and improving reliability. The system processes structured JSON data, validates and organizes it into a consistent schema, and uses templating to generate visually rich, self-contained HTML reports with embedded CSS, ensuring portability and zero external dependencies. It integrates rule-based checks and NLP techniques using Hugging Face Transformers to enhance analysis accuracy and interpretability. Built with FastAPI for scalable backend APIs, with optional UI support using React and Tailwind CSS, the system is containerized using Docker and deployed on Amazon Web Services (AWS), with GitHub enabling version control and CI/CD. It delivers structured, easy-to-read reports, significantly speeds up manuscript review, and provides a scalable solution for research quality assurance.',
    stack: ['Python', 'HTML/CSS','AWS bedrock','Regex'],
    highlights: ['Zero external dependencies', 'Data contract bug detection', 'Dark editorial UI theme', 'Network-accessible JSON loading'],
    github: 'https://github.com/harshith',
    status: 'In Production',
    accent: '#30d158',
    showGithub: false,
  },
  {
    id: 3,
    emoji: '🧠',
    title: 'Virtual AI Psychiatrist',
    tagline: 'AI-powered mental health companion',
    description: 'I engineered a domain-specific AI chatbot for mental health support that simulates a virtual psychiatrist by delivering empathetic, context-aware, and psychologically aligned conversational responses. The system is powered by Large Language Models (LLMs) integrated via API, with a strong emphasis on prompt engineering to enforce supportive, non-judgmental, and emotionally intelligent interactions while minimizing hallucinations and unsafe outputs. The architecture follows a structured pipeline of user input → context enrichment → response generation, where conversational memory is maintained across multi-turn interactions to ensure coherence, personalization, and continuity. I designed and implemented robust safety and guardrail mechanisms, including response filtering, intent detection, and constraint-based validation, to prevent the generation of sensitive or misleading medical advice and to appropriately redirect users toward professional help when necessary. On the engineering side, I built a scalable full-stack system using React for the frontend and a backend powered by Node.js and Python APIs to handle request orchestration, LLM integration, and data flow. The system is modular and extensible, with a design that supports future enhancements such as real doctor integration, user history tracking, personalization layers, and advanced mental health analytics. Overall, this project demonstrates the application of LLMs in high-stakes domains, combining AI-driven conversational intelligence with safety-critical design, scalability, and real-world usability.',
    stack: ['Python', 'LLM / GPT', 'NLP', 'Flask', 'React'],
    highlights: ['Emotion detection from text', 'Context-aware therapeutic responses', 'Structured wellness exercises', 'Safe & empathetic conversation design'],
    github: 'https://github.com/har-shith5555/Virtual-AI-psychiatrist',
    status: 'Personal Project',
    accent: '#bf5af2',
    showGithub: true,
  },
];

function ProjectCard({ project, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, onMouseMove, onMouseLeave } = useTilt(5);
  const revealRef = useScrollReveal(0.1);
  const statusColor =
    project.status === 'In Production' ? 'var(--success)' :
    project.status === 'Shipped' ? 'var(--accent)' : 'var(--text-3)';

  return (
    <div ref={revealRef} className={`reveal reveal-delay-${index + 1}`}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`project-card${isOpen ? ' is-open' : ''}`}
        style={{
          '--card-accent': project.accent,
          willChange: 'transform',
          transition: 'transform 0.15s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Glow effect */}
        <div
          className="project-card-glow"
          style={{ background: `radial-gradient(circle at 50% 0%, ${project.accent}18 0%, transparent 60%)` }}
        />

        {/* Header — clickable to toggle */}
        <div
          className="project-header project-header--clickable"
          onClick={() => setIsOpen(o => !o)}
        >
          <div
            className="project-emoji"
            style={{ background: `${project.accent}15`, border: `1px solid ${project.accent}25` }}
          >
            {project.emoji}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 className="project-title">{project.title}</h2>
              <span
                className="project-status"
                style={{
                  background: `${statusColor}15`,
                  color: statusColor,
                  border: `1px solid ${statusColor}30`,
                }}
              >
                {project.status}
              </span>
            </div>
            <p className="project-tagline" style={{ color: project.accent }}>
              {project.tagline}
            </p>
          </div>

          {/* Chevron */}
          <span
            className={`project-chevron${isOpen ? ' project-chevron--open' : ''}`}
            style={{ color: project.accent }}
          >
            &#8595;
          </span>

          {/* GitHub — stopPropagation so it doesn't toggle the card */}
          {project.showGithub !== false && project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm project-github"
              onClick={e => e.stopPropagation()}
            >
              &#8599; GitHub
            </a>
          )}
        </div>

        {/* Expandable body */}
        <div className={`project-expand${isOpen ? ' project-expand--open' : ''}`}>
          <div className="project-expand-inner">
            <hr className="divider" style={{ margin: '20px 0', opacity: 0.5 }} />
            <div className="project-body">
              <div className="project-left">
                <p className="project-desc">{project.description}</p>
                <ul className="project-highlights">
                  {project.highlights.map(h => (
                    <li key={h}>
                      <span style={{ color: project.accent }}>&#8594;</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project-stack">
                <p className="label" style={{ marginBottom: 12 }}>Stack</p>
                {project.stack.map(tech => (
                  <span key={tech} className="stack-chip">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Projects() {
  const headerRef = useScrollReveal(0.2);

  return (
    <main className="page projects-page">
      <div className="container">
        {/* Header */}
        <div ref={headerRef} className="reveal projects-header">
          <p className="label">Portfolio</p>
          <h1 className="projects-page-title">Projects</h1>
          <p className="projects-subtitle text-2">
            Things I've built — from AI pipelines to developer tools.
          </p>
        </div>

        {/* Cards */}
        <div className="projects-list">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}