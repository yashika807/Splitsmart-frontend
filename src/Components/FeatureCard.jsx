function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: '6px',
      background: 'var(--paper-raised)',
      padding: 'var(--space-5)',
      maxWidth: '260px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.8rem', marginBottom: 'var(--space-2)' }}>{icon}</div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.05rem',
        color: 'var(--ink)',
        marginBottom: 'var(--space-2)'
      }}>
        {title}
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: 0 }}>{description}</p>
    </div>
  );
}

export default FeatureCard;
