export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '28px 0',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 1,
    }}>
      <div className="container" style={{
        display:'flex', justifyContent:'space-between',
        alignItems:'center', flexWrap:'wrap', gap:12,
      }}>
        <span style={{ color:'var(--text-4)', fontSize:12, fontFamily:'var(--font-mono)' }}>
          © {year} Harshith — AI/ML Engineer
        </span>
        <nav style={{ display:'flex', gap:24 }}>
          {[
            { href:'https://github.com/harshith',      label:'GitHub'   },
            { href:'https://linkedin.com/in/harshith', label:'LinkedIn' },
            { href:'mailto:harshith@example.com',      label:'Email'    },
          ].map(({ href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ color:'var(--text-4)', fontSize:12, fontFamily:'var(--font-mono)', letterSpacing:'0.04em', transition:'color var(--transition)' }}
              onMouseEnter={e=>e.target.style.color='var(--text-2)'}
              onMouseLeave={e=>e.target.style.color='var(--text-4)'}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
