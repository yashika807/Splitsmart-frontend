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

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      padding: '32px 20px 16px',
      flexWrap: 'wrap'
    }}>
      <input
        placeholder="Who paid? (e.g. Rahul)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: '12px 18px',
          borderRadius: '12px',
          border: '2px solid #e2e8f0',
          fontSize: '1rem',
          outline: 'none',
          width: '220px',
          background: 'white'
        }}
      />
      <input
        placeholder="Amount (e.g. 500)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        style={{
          padding: '12px 18px',
          borderRadius: '12px',
          border: '2px solid #e2e8f0',
          fontSize: '1rem',
          outline: 'none',
          width: '160px',
          background: 'white'
        }}
      />
      <button
        onClick={handleAdd}
        style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(108,99,255,0.3)'
        }}
      >
        + Add
      </button>
    </div>
  );
}

export default ExpenseForm;