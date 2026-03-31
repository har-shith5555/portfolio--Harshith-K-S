import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useScrollReveal } from '../hooks/useInteractive';
import './BlogPost.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Lightweight Markdown-like renderer — no external deps
function renderContent(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith('```')) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++; }
      elements.push(<pre key={i}><code>{code.join('\n')}</code></pre>);
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i}>{inlineFormat(line.slice(2))}</blockquote>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(<li key={i}>{inlineFormat(lines[i].slice(2))}</li>); i++;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      elements.push(<p key={i}>{inlineFormat(line)}</p>);
    }
    i++;
  }
  return elements;
}

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`')  && part.endsWith('`'))  return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const { getBySlug } = useBlog();
  const navigate = useNavigate();
  const headerRef = useScrollReveal(0.1);
  const contentRef = useScrollReveal(0.05);

  const post = getBySlug(slug);

  if (!post || post.status !== 'published') {
    return (
      <main className="page" style={{ padding:'120px 0', textAlign:'center' }}>
        <div className="container-narrow">
          <p className="text-3" style={{ marginBottom:24, fontSize:18 }}>Post not found.</p>
          <Link to="/blog" className="btn btn-outline">← Back to Blog</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page post-page">
      <div className="container-narrow">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn btn-ghost post-back">
          ← Back
        </button>

        {/* Header */}
        <header ref={headerRef} className="reveal post-header">
          <div className="post-tags">
            {post.tags.map(t => (
              <span key={t} className="badge badge-tag">{t}</span>
            ))}
          </div>

          <h1 className="post-title">{post.title}</h1>
          <p className="post-excerpt">{post.excerpt}</p>

          <div className="post-meta">
            <span>{formatDate(post.createdAt)}</span>
            <span className="post-meta-dot">·</span>
            <span>
              {Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))} min read
            </span>
          </div>
        </header>

        <hr className="divider" style={{ margin: '40px 0' }} />

        {/* Content */}
        <article ref={contentRef} className="reveal prose post-content">
          {renderContent(post.content)}
        </article>

        {/* Footer nav */}
        <div className="post-footer">
          <hr className="divider" style={{ marginBottom: 32 }} />
          <Link to="/blog" className="btn btn-outline">← All Posts</Link>
        </div>
      </div>
    </main>
  );
}
