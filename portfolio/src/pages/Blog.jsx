import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useScrollReveal } from '../hooks/useInteractive';
import './Blog.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function BlogItem({ post, index }) {
  const ref = useScrollReveal(0.1);
  return (
    <div ref={ref} className={`reveal reveal-delay-${Math.min(index + 1, 5)}`}>
      <Link to={`/blog/${post.slug}`} className="blog-item">
        <div className="blog-item-left">
          <span className="blog-item-date">{formatDate(post.createdAt)}</span>
          <div className="blog-item-tags">
            {post.tags.slice(0, 2).map(t => (
              <span key={t} className="badge badge-tag">{t}</span>
            ))}
          </div>
        </div>
        <div className="blog-item-body">
          <h2 className="blog-item-title">{post.title}</h2>
          <p className="blog-item-excerpt">{post.excerpt}</p>
        </div>
        <div className="blog-item-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
    </div>
  );
}

export default function Blog() {
  const { getPublished } = useBlog();
  const posts = getPublished();
  const [activeTag, setActiveTag] = useState(null);
  const headerRef = useScrollReveal(0.2);

  const allTags = [...new Set(posts.flatMap(p => p.tags))];
  const filtered = activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts;

  return (
    <main className="page blog-page">
      <div className="container">
        {/* Header */}
        <div ref={headerRef} className="reveal blog-header">
          <p className="label">Writing</p>
          <h1 className="blog-page-title">Blog</h1>
          <p className="blog-subtitle text-2">
            Notes on AI/ML engineering, Python, and things I build.
          </p>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="blog-tags reveal">
            <button
              className={`tag-btn ${!activeTag ? 'active' : ''}`}
              onClick={() => setActiveTag(null)}
            >
              All <span className="tag-count">{posts.length}</span>
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {filtered.length === 0 ? (
          <div className="blog-empty">
            <p className="text-3">No posts found.</p>
          </div>
        ) : (
          <div className="blog-list">
            {filtered.map((post, i) => (
              <BlogItem key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
