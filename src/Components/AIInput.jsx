import { useState } from 'react';
import { API_BASE_URL } from '../config';

function AIInput({ onExpensesparsed }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/expenses/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong parsing that. Try again?');
      }

      await onExpensesparsed(data);
      setText('');
    } catch (err) {
      setError(err.message || 'Something went wrong parsing that.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: 'var(--space-5)',
      background: 'var(--amber-soft)',
      borderRadius: '8px',
      border: '1px solid var(--amber)',
      marginBottom: 'var(--space-5)'
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--ink)', marginBottom: 'var(--space-2)' }}>
        ✨ AI Expense Parser
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: 'var(--space-3)' }}>
        Plain English mein likho — AI automatically parse karega!
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='e.g. "Rahul ne hotel ke 5000 diye, mini ne cab pe 800 kharch kiye"'
        disabled={loading}
        style={{
          width: '100%',
          padding: 'var(--space-3)',
          borderRadius: '6px',
          border: '1px solid var(--line-strong)',
          background: 'var(--paper-raised)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          minHeight: '80px',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />

      {loading ? (
        <div style={{
          marginTop: 'var(--space-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          background: 'var(--paper-raised)',
          border: '1px solid var(--amber)',
          borderRadius: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.88rem',
          color: 'var(--ink)'
        }}>
          <span className="stamp-spin" aria-hidden="true" />
          <span>Reading your message&hellip;</span>
        </div>
      ) : (
        <button
          onClick={handleParse}
          style={{
            marginTop: 'var(--space-3)',
            background: 'var(--ink)',
            color: 'var(--paper)',
            padding: '12px 28px',
            border: 'none',
            borderRadius: '6px',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          ✨ Parse with AI
        </button>
      )}

      {error && (
        <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: 'var(--space-2)', marginBottom: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default AIInput;
