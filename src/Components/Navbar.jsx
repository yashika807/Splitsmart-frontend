function Navbar() {
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      padding: '18px 40px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
    }}>
      <span style={{ fontWeight: '700', fontSize: '1.5rem', letterSpacing: '0.5px' }}>
        💸 SplitSmart
      </span>
      <span style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
        Split expenses, not friendships
      </span>
    </nav>
  );
}

export default Navbar;