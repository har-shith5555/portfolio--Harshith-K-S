import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

export default function Dashboard() {
  const { posts, deletePost, toggleStatus } = useBlog();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tab, setTab] = useState('all');

  const filtered = posts.filter(p =>
    tab === 'published' ? p.status === 'published' :
    tab === 'draft'     ? p.status === 'draft' : true
  );

  const published = posts.filter(p => p.status === 'published').length;
  const drafts    = posts.filter(p => p.status === 'draft').length;

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const handleDelete = (id) => { deletePost(id); setConfirmDelete(null); };

  const tabStyle = (t) => ({
    display:'inline-flex', alignItems:'center', gap:8,
    padding:'8px 16px', borderRadius:8,
    fontFamily:'var(--font-mono)', fontSize:12, letterSpacing:'0.04em',
    color: tab === t ? 'var(--text)' : 'var(--text-3)',
    background: tab === t ? 'var(--surface-2)' : 'transparent',
    border: tab === t ? '1px solid var(--border-light)' : '1px solid transparent',
    cursor:'pointer', transition:'all var(--transition)',
  });

  return (
    <main className="page" style={{ padding:'48px 0 80px' }}>
      <div className="container">

        {/* Top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16, marginBottom:40, paddingBottom:28, borderBottom:'1px solid var(--border)' }}>
          <div>
            <p className="label">Admin Portal</p>
            <h1 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:700, letterSpacing:'-0.03em', marginTop:8 }}>
              Blog Dashboard
            </h1>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Link to="/admin/new" className="btn btn-primary">+ New Post</Link>
            <button className="btn btn-ghost" onClick={handleLogout}>Sign out</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
          {[
            { value: posts.length,    label: 'Total',     color: 'var(--text)'    },
            { value: published,       label: 'Published', color: 'var(--success)' },
            { value: drafts,          label: 'Drafts',    color: 'var(--text-3)'  },
            { value: null,            label: null                                  },
          ].map((s, i) => (
            <div key={i} style={{
              background:'var(--glass-bg)', border:'1px solid var(--glass-border)',
              borderRadius:'var(--radius-xl)', padding:'20px 24px',
              backdropFilter:'var(--glass-blur)',
              display:'flex', flexDirection:'column', gap:4,
            }}>
              {s.value !== null ? (
                <>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:40, fontWeight:700, letterSpacing:'-0.04em', color:s.color, lineHeight:1 }}>
                    {s.value}
                  </span>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-4)' }}>
                    {s.label}
                  </span>
                </>
              ) : (
                <Link to="/" target="_blank" style={{ color:'var(--accent)', fontFamily:'var(--font-mono)', fontSize:13, letterSpacing:'0.04em', marginTop:'auto' }}>
                  View Site ↗
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:20 }}>
          {[
            { key:'all',       label:'All',       count: posts.length },
            { key:'published', label:'Published', count: published    },
            { key:'draft',     label:'Drafts',    count: drafts       },
          ].map(({ key, label, count }) => (
            <button key={key} style={tabStyle(key)} onClick={() => setTab(key)}>
              {label}
              <span style={{ fontSize:10, background:'var(--surface-3)', borderRadius:980, padding:'1px 7px', color:'var(--text-4)' }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background:'var(--glass-bg)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-xl)', overflow:'hidden', backdropFilter:'var(--glass-blur)' }}>
          {filtered.length === 0 ? (
            <div style={{ padding:'80px 0', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
              <p style={{ color:'var(--text-3)', fontFamily:'var(--font-mono)', fontSize:13 }}>No posts here yet.</p>
              <Link to="/admin/new" className="btn btn-outline">+ Write your first post</Link>
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Title', 'Tags', 'Date', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} style={{
                      padding:'12px 20px', textAlign:'left',
                      fontFamily:'var(--font-mono)', fontSize:10,
                      letterSpacing:'0.08em', textTransform:'uppercase',
                      color:'var(--text-4)', whiteSpace:'nowrap',
                    }}
                    className={i === 1 || i === 2 ? 'hide-mobile' : ''}
                    >{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} style={{ borderBottom:'1px solid var(--border)', transition:'background var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Title */}
                    <td style={{ padding:'16px 20px', verticalAlign:'top' }}>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:500, color:'var(--text)', marginBottom:3, lineHeight:1.3 }}>
                        {post.title}
                      </div>
                      <div style={{ fontFamily:'var(--font-body)', fontSize:12, color:'var(--text-4)', lineHeight:1.5, maxWidth:360 }}>
                        {post.excerpt?.slice(0, 70)}…
                      </div>
                    </td>
                    {/* Tags */}
                    <td className="hide-mobile" style={{ padding:'16px 20px', verticalAlign:'top' }}>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {post.tags?.slice(0, 2).map(t => (
                          <span key={t} className="badge badge-tag">{t}</span>
                        ))}
                      </div>
                    </td>
                    {/* Date */}
                    <td className="hide-mobile" style={{ padding:'16px 20px', verticalAlign:'top', whiteSpace:'nowrap', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-4)' }}>
                      {formatDate(post.createdAt)}
                    </td>
                    {/* Status */}
                    <td style={{ padding:'16px 20px', verticalAlign:'top' }}>
                      <button
                        onClick={() => toggleStatus(post.id)}
                        className={`badge ${post.status === 'published' ? 'badge-published' : 'badge-draft'}`}
                        style={{ cursor:'pointer', background:'none', transition:'all var(--transition)' }}
                        title="Click to toggle"
                      >
                        {post.status === 'published' ? '● Live' : '○ Draft'}
                      </button>
                    </td>
                    {/* Actions */}
                    <td style={{ padding:'16px 20px', verticalAlign:'top' }}>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        {post.status === 'published' && (
                          <Link to={`/blog/${post.slug}`} target="_blank" className="btn btn-ghost btn-sm" title="View">↗</Link>
                        )}
                        <Link to={`/admin/edit/${post.id}`} className="btn btn-outline btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(post.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {confirmDelete && (
        <div className="animate-fade-in" style={{
          position:'fixed', inset:0,
          background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:1000, padding:24,
        }}
          onClick={() => setConfirmDelete(null)}
        >
          <div style={{
            background:'var(--bg-2)', border:'1px solid var(--border-light)',
            borderRadius:'var(--radius-xl)', padding:32, width:'100%', maxWidth:400,
          }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:10 }}>Delete post?</h3>
            <p style={{ color:'var(--text-3)', fontSize:14, lineHeight:1.6, marginBottom:24 }}>
              This action is permanent and cannot be undone.
            </p>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
