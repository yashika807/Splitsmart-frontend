function FeatureCard({ icon, title, description }) {
    return (
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '260px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
        <h3>{title}</h3>
        <p style={{ color: '#666' }}>{description}</p>
      </div>
    );
  }
  
  export default FeatureCard;