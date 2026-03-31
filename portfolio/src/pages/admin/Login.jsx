import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = login(form.username, form.password);
    setLoading(false);
    if (ok) navigate('/admin/dashboard');
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg)',
    }}>
      <div className="animate-fade-up" style={{
        width: '100%',
        maxWidth: 400,
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 40,
        backdropFilter: 'var(--glass-blur)',
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28, fontFamily:'var(--font-mono)', fontSize:15, color:'var(--text-3)' }}>
          harshith<span style={{ color:'var(--accent)' }}>.</span>dev
          <span style={{ color:'var(--text-4)', marginLeft:8 }}>/ admin</span>
        </div>

        <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.03em', textAlign:'center', marginBottom:6 }}>
          Sign in
        </h1>
        <p style={{ textAlign:'center', color:'var(--text-3)', fontSize:14, marginBottom:28 }}>
          Portfolio admin portal
        </p>

        {/* Demo credentials hint
        <div style={{
          background:'var(--surface-2)',
          border:'1px solid var(--border)',
          borderRadius:'var(--radius-lg)',
          padding:'12px 16px',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          marginBottom:24,
          gap:12,
        }}>
          <span className="label" style={{ fontSize:10 }}>Demo</span>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-3)' }}>
            admin / admin123
          </span>
        </div> */}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="input"
              placeholder="admin"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="animate-fade-in" style={{
              background:'rgba(255,69,58,0.08)',
              border:'1px solid rgba(255,69,58,0.25)',
              color:'var(--danger)',
              borderRadius:'var(--radius)',
              padding:'10px 14px',
              fontSize:13,
              marginBottom:12,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width:'100%', justifyContent:'center', marginTop:8 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>
      </div>
    </main>
  );
}
