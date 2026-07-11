import { useState } from 'react';

function ExpenseForm({ onAdd }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  function handleAdd() {
    if (!name || !amount) return;
    onAdd({ name, amount: Number(amount) });
    setName('');
    setAmount('');
  }

  const inputStyle = {
    padding: '11px 16px',
    borderRadius: '6px',
    border: '1px solid var(--line-strong)',
    background: 'var(--paper-raised)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-3)',
      justifyContent: 'center',
      padding: 'var(--space-6) var(--space-4) var(--space-4)',
      flexWrap: 'wrap',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <input
        placeholder="Who paid? (e.g. Rahul)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ ...inputStyle, flex: '2 1 200px' }}
      />
      <input
        placeholder="Amount (e.g. 500)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        style={{ ...inputStyle, flex: '1 1 130px' }}
      />
      <button
        onClick={handleAdd}
        style={{
          padding: '11px 26px',
          background: 'var(--ink)',
          color: 'var(--paper)',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          fontWeight: '700',
          flex: '0 1 auto'
        }}
      >
        + Add
      </button>
    </div>
  );
}

export default ExpenseForm;
