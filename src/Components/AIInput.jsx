import { useState } from 'react';
import { API_BASE_URL } from '../config';

function AIInput({ onExpensesparsed }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/api/expenses/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    const expenses = await response.json();
    onExpensesparsed(expenses);
    setText('');
    setLoading(false);
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #f0f4ff, #f5f6fa)',
      borderRadius: '16px',
      border: '2px solid #e0e7ff',
      marginBottom: '24px'
    }}>
      <p style={{ fontWeight: '600', color: '#6c63ff', marginBottom: '10px' }}>
        ✨ AI Expense Parser
      </p>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '12px' }}>
        Plain English mein likho — AI automatically parse karega!
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='e.g. "Rahul ne hotel ke 5000 diye, mini ne cab pe 800 kharch kiye"'
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
          fontSize: '0.95rem',
          minHeight: '80px',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      <button
        onClick={handleParse}
        disabled={loading}
        style={{
          marginTop: '10px',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #6c63ff, #5a52d5)',
          color: 'white',
          padding: '12px 28px',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? '🤖 Parsing...' : '✨ Parse with AI'}
      </button>
    </div>
  );
}

export default AIInput;