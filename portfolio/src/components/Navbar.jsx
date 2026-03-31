import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const navLinks = [
    { to: '/',         label: 'Home'     },
    { to: '/projects', label: 'Projects' },
    { to: '/blog',     label: 'Blog'     },
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
        background: scrolled ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:56 }}>
          {/* Logo */}
          <Link to="/" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 15,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: '-0.01em',
            transition: 'color var(--transition)',
          }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--accent)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--text)'}
          >
            harshith<span style={{color:'var(--accent)'}}>.</span>dev
          </Link>

          {/* Desktop nav */}
          {!isAdmin && (
            <nav className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:4 }}>
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 400,
                  color: isActive ? 'var(--text)' : 'var(--text-3)',
                  padding: '6px 14px',
                  borderRadius: 980,
                  transition: 'all var(--transition)',
                  background: isActive ? 'var(--surface-2)' : 'transparent',
                  letterSpacing: '-0.01em',
                })}>
                  {label}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="hide-mobile" style={{ display:'flex', gap:10, alignItems:'center' }}>
            {isAdmin ? (
              <span className="label" style={{ opacity:0.4 }}>Admin</span>
            ) : (
              <Link to="/admin/login" className="btn btn-outline btn-sm">Admin ↗</Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="hide-desktop"
            onClick={() => setMenuOpen(o => !o)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:8, display:'flex', flexDirection:'column', gap:5 }}
            aria-label="menu"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display:'block', width:22, height:1.5,
                background: 'var(--text-2)',
                borderRadius:2,
                transition: 'all 200ms ease',
                transform: menuOpen
                  ? (i===0 ? 'translateY(6.5px) rotate(45deg)' : i===2 ? 'translateY(-6.5px) rotate(-45deg)' : 'scaleX(0)')
                  : 'none',
                opacity: menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid var(--border)',
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(20px)',
            padding: '8px 0 16px',
          }}>
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
                display:'block', padding:'12px 24px',
                fontFamily:'var(--font-body)', fontSize:15,
                color: isActive ? 'var(--accent)' : 'var(--text-2)',
              })}>
                {label}
              </NavLink>
            ))}
            <Link to="/admin/login" style={{ display:'block', padding:'12px 24px', fontFamily:'var(--font-body)', fontSize:15, color:'var(--text-3)' }}>
              Admin
            </Link>
          </div>
        )}
      </header>

      {/* CSS for hide-desktop */}
      <style>{`
        .hide-desktop { display: none; }
        @media(max-width:768px) {
          .hide-desktop { display: flex !important; }
          .hide-mobile  { display: none !important; }
        }
      `}</style>
    </>
  );
}
