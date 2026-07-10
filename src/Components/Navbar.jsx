function Navbar({ activeContext, onContextChange }) {
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      padding: '18px 40px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
    }}>
      <span style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '0.5px' }}>
        💸 SplitSmart
      </span>

      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '999px',
        padding: '4px'
      }}>
        {['Trip', 'Family'].map((option) => (
          <button
            key={option}
            onClick={() => onContextChange(option)}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              background: activeContext === option ? '#6c63ff' : 'transparent',
              color: activeContext === option ? 'white' : '#a0aec0',
              transition: 'background 0.15s ease'
            }}
          >
            {option === 'Trip' ? '🧳 Trip' : '👨‍👩‍👧 Family'}
          </button>
        ))}
      </div>

      <span style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
        Split expenses, not friendships
      </span>
    </nav>
  );
}

export default Navbar;
