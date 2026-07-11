function Hero({ onTryItClick }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-8) var(--space-4) var(--space-6)',
      borderBottom: '1px solid var(--line)'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 6vw, 2.8rem)',
        fontWeight: '700',
        color: 'var(--ink)',
        marginBottom: 'var(--space-3)',
        lineHeight: '1.15'
      }}>
        Split expenses,<br />
        <span style={{ color: 'var(--green)' }}>not friendships.</span>
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', marginBottom: 'var(--space-6)' }}>
        Describe your trip in plain English. We'll handle the math.
      </p>
      <button onClick={onTryItClick} style={{
        background: 'var(--ink)',
        color: 'var(--paper)',
        padding: '13px 32px',
        border: 'none',
        borderRadius: '5px',
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer'
      }}>
        Try it free →
      </button>
    </div>
  );
}

export default Hero;
