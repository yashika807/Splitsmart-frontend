function EmptyState({ title, description }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-7) var(--space-4)' }}>
      <svg
        viewBox="0 0 72 72"
        fill="none"
        style={{ width: '64px', height: '64px', margin: '0 auto var(--space-4)' }}
        aria-hidden="true"
      >
        <rect x="14" y="10" width="44" height="56" rx="3" stroke="var(--line-strong)" strokeWidth="2" fill="var(--paper-raised)" />
        <path d="M14 58 L20 66 L26 58 L32 66 L38 58 L44 66 L50 58 L58 66 L58 58" stroke="var(--line-strong)" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <line x1="22" y1="22" x2="50" y2="22" stroke="var(--line-strong)" strokeWidth="2" />
        <line x1="22" y1="30" x2="50" y2="30" stroke="var(--line-strong)" strokeWidth="2" />
        <line x1="22" y1="38" x2="38" y2="38" stroke="var(--amber)" strokeWidth="2.5" />
      </svg>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', maxWidth: '34ch', margin: '0 auto' }}>
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
