function Navbar({ activeContext, onContextChange }) {
  return (
    <nav style={{
      background: 'var(--ink)',
      padding: 'var(--space-4) var(--space-6)',
      color: 'var(--paper)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--space-3)'
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: '700',
        fontSize: '1.3rem'
      }}>
        🧾 SplitSmart
      </span>

      <div style={{
        display: 'flex',
        background: 'rgba(236,239,229,0.1)',
        borderRadius: '999px',
        padding: '3px'
      }}>
        {['Trip', 'Family'].map((option) => (
          <button
            key={option}
            onClick={() => onContextChange(option)}
            style={{
              padding: '7px 18px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: activeContext === option ? 'var(--amber)' : 'transparent',
              color: activeContext === option ? 'var(--ink)' : 'var(--paper)',
              opacity: activeContext === option ? 1 : 0.65,
              transition: 'background 0.15s ease, opacity 0.15s ease'
            }}
          >
            {option === 'Trip' ? '🧳 Trip' : '👨‍👩‍👧 Family'}
          </button>
        ))}
      </div>

      <span style={{ fontSize: '0.82rem', color: 'var(--paper)', opacity: 0.65 }}>
        Split expenses, not friendships
      </span>
    </nav>
  );
}

export default Navbar;
