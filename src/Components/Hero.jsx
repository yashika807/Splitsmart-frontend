function Hero({ onTryItClick }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px 40px',
      background: 'linear-gradient(180deg, #f0f4ff 0%, #f5f6fa 100%)'
    }}>
      <h1 style={{
        fontSize: '2.8rem',
        fontWeight: '800',
        color: '#1a1a2e',
        marginBottom: '12px',
        lineHeight: '1.2'
      }}>
        Split expenses,<br />
        <span style={{ color: '#6c63ff' }}>not friendships.</span>
      </h1>
      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '28px' }}>
        Describe your trip in plain English. We'll handle the math.
      </p>
      <button onClick={onTryItClick} style={{
        background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
        color: 'white',
        padding: '14px 36px',
        border: 'none',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(108, 99, 255, 0.4)'
      }}>
        Try it free →
      </button>
    </div>
  );
}

export default Hero;