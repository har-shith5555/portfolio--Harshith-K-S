import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';

const EMPTY = { title:'', excerpt:'', content:'', tags:'', status:'draft' };

// Same lightweight Markdown renderer from BlogPost
function renderPreview(text) {
  if (!text) return <p style={{ color:'var(--text-4)', fontStyle:'italic', fontFamily:'var(--font-mono)', fontSize:13 }}>Nothing to preview yet…</p>;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## '))       { elements.push(<h2 key={i} style={{ fontFamily:'var(--font-display)', fontSize:22, marginBottom:8, marginTop:24, color:'var(--text)' }}>{line.slice(3)}</h2>); }
    else if (line.startsWith('### ')) { elements.push(<h3 key={i} style={{ fontFamily:'var(--font-display)', fontSize:18, marginBottom:6, marginTop:20, color:'var(--text)' }}>{line.slice(4)}</h3>); }
    else if (line.startsWith('```')) {
      const code = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++; }
      elements.push(<pre key={i} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:8, padding:16, overflow:'auto', margin:'12px 0', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-2)' }}><code>{code.join('\n')}</code></pre>);
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i} style={{ borderLeft:'2px solid var(--accent)', paddingLeft:16, color:'var(--text-3)', fontStyle:'italic', margin:'12px 0' }}>{line.slice(2)}</blockquote>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(<li key={i} style={{ marginBottom:4, color:'var(--text-2)', fontSize:14 }}>{lines[i].slice(2)}</li>); i++;
      }
      elements.push(<ul key={`ul${i}`} style={{ paddingLeft:20, margin:'8px 0' }}>{items}</ul>); continue;
    } else if (line.trim()) {
      elements.push(<p key={i} style={{ color:'var(--text-2)', fontSize:15, lineHeight:1.75, marginBottom:12 }}>{line}</p>);
    }
    i++;
  }
  return elements;
}

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { posts, addPost, updatePost } = useBlog();

  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [saved, setSaved]       = useState(false);
  const [activeTab, setActiveTab] = useState('write');

  useEffect(() => {
    if (isEdit) {
      const post = posts.find(p => p.id === id);
      if (post) {
        setForm({ title:post.title, excerpt:post.excerpt, content:post.content, tags:post.tags?.join(', ')??'', status:post.status });
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(prev => ({ ...prev, [name]:'' }));
    setSaved(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())   errs.title   = 'Required';
    if (!form.excerpt.trim()) errs.excerpt  = 'Required';
    if (!form.content.trim()) errs.content  = 'Required';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (isEdit) updatePost(id, payload); else addPost(payload);
    setSaved(true);
    setTimeout(() => navigate('/admin/dashboard'), 700);
  };

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;

  const tabBtn = (t, label) => (
    <button type="button"
      onClick={() => setActiveTab(t)}
      style={{
        fontFamily:'var(--font-mono)', fontSize:12, letterSpacing:'0.04em',
        padding:'5px 14px', borderRadius:6,
        background: activeTab === t ? 'var(--surface-2)' : 'transparent',
        border: 'none',
        color: activeTab === t ? 'var(--text)' : 'var(--text-3)',
        cursor:'pointer', transition:'all var(--transition)',
      }}
    >{label}</button>
  );

  return (
    <main className="page" style={{ padding:'40px 0 80px' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16, marginBottom:32, paddingBottom:24, borderBottom:'1px solid var(--border)', flexWrap:'wrap' }}>
          <div>
            <Link to="/admin/dashboard" className="btn btn-ghost" style={{ padding:'6px 0', marginBottom:8 }}>← Dashboard</Link>
            <h1 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.03em' }}>
              {isEdit ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            <select name="status" value={form.status} onChange={handleChange} className="input" style={{ width:'auto', minWidth:140 }}>
              <option value="draft">○ Draft</option>
              <option value="published">● Published</option>
            </select>
            <button type="submit" form="post-form" className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}>
              {saved ? '✓ Saved!' : isEdit ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Form */}
        <form id="post-form" onSubmit={handleSubmit} noValidate>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', gap:24, alignItems:'start' }}>

            {/* Main */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {/* Title */}
              <div>
                <input
                  name="title"
                  type="text"
                  placeholder="Post title…"
                  value={form.title}
                  onChange={handleChange}
                  autoFocus
                  style={{
                    width:'100%', background:'transparent',
                    border:'none', borderBottom:`1px solid ${errors.title ? 'var(--danger)' : 'var(--border-light)'}`,
                    color:'var(--text)', fontFamily:'var(--font-display)',
                    fontSize:28, fontWeight:600, letterSpacing:'-0.02em',
                    padding:'8px 0 12px', outline:'none',
                    transition:'border-color var(--transition)',
                  }}
                  onFocus={e=>e.target.style.borderBottomColor='var(--accent)'}
                  onBlur={e=>e.target.style.borderBottomColor= errors.title ? 'var(--danger)' : 'var(--border-light)'}
                />
                {errors.title && <span style={{ fontSize:12, color:'var(--danger)', fontFamily:'var(--font-mono)' }}>{errors.title}</span>}
              </div>

              {/* Excerpt */}
              <div>
                <label className="form-label">Excerpt</label>
                <textarea
                  name="excerpt"
                  className="input"
                  placeholder="A short summary shown in the blog listing…"
                  value={form.excerpt}
                  onChange={handleChange}
                  style={{ minHeight:72, borderColor: errors.excerpt ? 'var(--danger)' : undefined }}
                />
                {errors.excerpt && <span style={{ fontSize:12, color:'var(--danger)', fontFamily:'var(--font-mono)' }}>{errors.excerpt}</span>}
              </div>

              {/* Content */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <label className="form-label" style={{ margin:0 }}>Content</label>
                  <div style={{ display:'flex', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:3, gap:2 }}>
                    {tabBtn('write', 'Write')}
                    {tabBtn('preview', 'Preview')}
                  </div>
                </div>

                {activeTab === 'write' ? (
                  <>
                    <textarea
                      name="content"
                      className="input"
                      placeholder={`## Heading\n\nWrite in Markdown-like syntax…\n\n\`\`\`python\ncode here\n\`\`\`\n\n- bullet item`}
                      value={form.content}
                      onChange={handleChange}
                      style={{ minHeight:420, fontFamily:'var(--font-mono)', fontSize:13, lineHeight:1.8, borderColor: errors.content ? 'var(--danger)' : undefined }}
                    />
                    {errors.content && <span style={{ fontSize:12, color:'var(--danger)', fontFamily:'var(--font-mono)' }}>{errors.content}</span>}
                    <p style={{ fontSize:11, color:'var(--text-4)', fontFamily:'var(--font-mono)', marginTop:8 }}>
                      ## h2 · ### h3 · **bold** · `code` · ```code block``` · - list · &gt; quote
                    </p>
                  </>
                ) : (
                  <div style={{ minHeight:420, padding:'20px 24px', background:'var(--glass-bg)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-lg)', backdropFilter:'var(--glass-blur)' }}>
                    {renderPreview(form.content)}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ position:'sticky', top:80, display:'flex', flexDirection:'column', gap:16 }}>

              {/* Tags */}
              <div style={{ background:'var(--glass-bg)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-xl)', padding:18, backdropFilter:'var(--glass-blur)' }}>
                <label className="form-label">Tags</label>
                <input name="tags" type="text" className="input" placeholder="Python, AI/ML" value={form.tags} onChange={handleChange} />
                <p style={{ fontSize:11, color:'var(--text-4)', fontFamily:'var(--font-mono)', marginTop:8 }}>Comma-separated</p>
                {form.tags && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:12 }}>
                    {form.tags.split(',').map(t=>t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="badge badge-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div style={{ background:'var(--glass-bg)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-xl)', padding:18, backdropFilter:'var(--glass-blur)' }}>
                <label className="form-label">Status</label>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {['draft','published'].map(s => (
                    <label key={s} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                      <input type="radio" name="status" value={s} checked={form.status===s} onChange={handleChange} style={{ accentColor:'var(--accent)' }} />
                      <span className={`badge ${s==='published'?'badge-published':'badge-draft'}`}>
                        {s==='published'?'● Published':'○ Draft'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{ background:'var(--glass-bg)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-xl)', padding:18, backdropFilter:'var(--glass-blur)', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-4)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span>Words</span><span style={{ color:'var(--text-3)' }}>{wordCount}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>Chars</span><span style={{ color:'var(--text-3)' }}>{form.content.length}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
