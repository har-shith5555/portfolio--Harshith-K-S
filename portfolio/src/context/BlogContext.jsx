import { createContext, useContext, useState, useEffect } from 'react';

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_POSTS = [
  {
    id: '1',
    title: 'Building an AI-Powered Alt-Text Pipeline with Gemini',
    slug: 'ai-alt-text-pipeline-gemini',
    excerpt: 'How I built a production-grade image accessibility pipeline using Google Vertex AI and Gemini for an academic publishing workflow.',
    content: `## The Problem

Academic publishers handle thousands of scientific figures every day — charts, microscopy images, molecular diagrams — and most lack proper alt text. Screen readers leave visually impaired readers completely in the dark.

I was tasked with building an automated pipeline to fix this at scale.

## The Architecture

The pipeline works in three stages:

1. **Image extraction** — Pull figures from PDFs using PyMuPDF
2. **Caption gathering** — Collect captions from three sources: JSON manifest, Elsevier XML, and LaTeX source
3. **Gemini generation** — Feed image + caption context to Gemini, score the output, retry if needed

\`\`\`python
def generate_alt_text(image_path, caption=None):
    prompt = build_prompt(caption)
    response = model.generate_content([image, prompt])
    score = extract_score(response.text)
    if score < SCORE_THRESHOLD:
        return retry_with_correction(image, response.text)
    return response.text
\`\`\`

## The Prompt Engineering Challenge

Getting Gemini to stay under 125 characters for "simple" images while writing 2–3 sentences for "complex" ones was surprisingly hard. The trick was building a self-correction loop *inside* the prompt itself — Gemini would score its own output, and if it failed, rewrite it.

## Results

After tuning the score threshold to 9/10 (Gemini's realistic ceiling for scientific imagery), the pipeline now processes batches of 500+ images with ~92% single-pass accuracy.

**Stack:** Python, Google Vertex AI, Gemini 1.5 Pro, PyMuPDF, openpyxl`,
    status: 'published',
    tags: ['AI/ML', 'Python', 'Gemini', 'Computer Vision'],
    createdAt: '2025-03-10T10:00:00.000Z',
    updatedAt: '2025-03-10T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Web Scraping at Scale: Extracting 1M+ Rows from Oracle APEX',
    slug: 'web-scraping-oracle-apex-scale',
    excerpt: 'Lessons learned while building a Selenium scraper targeting a paginated Oracle APEX site with incremental CSV writing.',
    content: `## Why Oracle APEX is Annoying to Scrape

Most scrapers assume simple HTML pagination. Oracle APEX dynamic applications use AJAX-driven tables with session tokens, making naive scraping fall apart after page 1.

## The Approach

Instead of fighting the APEX session model, I reverse-engineered the API calls the frontend makes:

\`\`\`python
driver.get(BASE_URL)
wait_for_table_load(driver)

for page in range(1, total_pages + 1):
    rows = extract_rows(driver)
    write_to_csv(rows, append=(page > 1))
    navigate_next(driver)
\`\`\`

## Incremental Writing

With 1M+ expected rows, loading everything into memory would crash the process. Writing incrementally to CSV after each page kept memory flat throughout.

## Lessons

- Always check network requests before writing a scraper
- Session-aware sites need a real browser (Selenium/Playwright), not requests
- Incremental I/O is non-negotiable at this scale

**Stack:** Python, Selenium, Chrome WebDriver, pandas`,
    status: 'published',
    tags: ['Python', 'Selenium', 'Web Scraping', 'Data'],
    createdAt: '2025-02-20T10:00:00.000Z',
    updatedAt: '2025-02-20T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Designing MSXpert: A Manuscript Report Generator',
    slug: 'msxpert-manuscript-report-generator',
    excerpt: 'From raw JSON data to polished HTML reports — building an internal tool for academic manuscript analysis.',
    content: `## What is MSXpert?

MSXpert is an internal tool that analyses manuscript submissions and generates detailed HTML reports — flagging statistical issues, unusual phrasing, and formatting problems.

## The Data Pipeline

The system reads structured JSON produced by a \`main.py\` analysis script and feeds it into \`generate_html_report()\`:

\`\`\`python
def generate_html_report(data: dict) -> str:
    """
    Generates a standalone HTML string from manuscript analysis JSON.
    Returns complete HTML with embedded CSS — no external dependencies.
    """
    sections = []
    for check in data['checks']:
        sections.append(render_check_section(check))
    return HTML_TEMPLATE.format(
        title=data['title'],
        sections='\\n'.join(sections)
    )
\`\`\`

## A Bug That Took Hours to Find

\`main.py\` was storing word counts as integers, but \`html_str.py\` expected the full word lists to generate highlighted excerpts. The reports were silently empty for 3 out of 8 checks. Fixed by updating the serialisation contract between the two modules.

## Design Choices

The report uses a dark teal theme with JetBrains Mono — it needed to feel like a developer tool, not a Word document.

**Stack:** Python, Jinja2-style templating, HTML/CSS`,
    status: 'published',
    tags: ['Python', 'HTML', 'Tools', 'Publishing'],
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
  },

];

// ─── Context ──────────────────────────────────────────────────────────────────
const BlogContext = createContext(null);

const STORAGE_KEY = 'portfolio_blog_posts';

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_POSTS;
    } catch {
      return SEED_POSTS;
    }
  });

  // Persist to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  // ── CRUD helpers ─────────────────────────────────────────────────────────
  const getPublished = () => posts.filter((p) => p.status === 'published');

  const getBySlug = (slug) => posts.find((p) => p.slug === slug);

  const addPost = (postData) => {
    const now = new Date().toISOString();
    const newPost = {
      ...postData,
      id: Date.now().toString(),
      slug: slugify(postData.title),
      createdAt: now,
      updatedAt: now,
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id, postData) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...postData, slug: slugify(postData.title ?? p.title), updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStatus = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'published' ? 'draft' : 'published', updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  return (
    <BlogContext.Provider value={{ posts, getPublished, getBySlug, addPost, updatePost, deletePost, toggleStatus }}>
      {children}
    </BlogContext.Provider>
  );
}

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlog must be used within BlogProvider');
  return ctx;
};

// ─── Utility ──────────────────────────────────────────────────────────────────
function slugify(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
