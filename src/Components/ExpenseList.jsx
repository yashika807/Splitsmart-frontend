import EmptyState from './EmptyState';

function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses yet"
        description="Describe one in plain English above, snap a receipt, or add it by hand — it'll show up here."
      />
    );
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 var(--space-4) var(--space-6)' }}>
      <div className="receipt-card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
        {expenses.map((expense) => (
          <div key={expense.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-3) 0',
            borderBottom: '1px dashed var(--line)',
            gap: 'var(--space-3)'
          }}>
            <span style={{ fontWeight: '600' }}>{expense.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                color: 'var(--ink)'
              }}>
                ₹{expense.amount}
              </span>
              <button
                onClick={() => onDelete(expense.id)}
                aria-label={`Delete ${expense.name}'s expense`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.05rem', lineHeight: 1, padding: 0 }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-3)',
          marginTop: 'var(--space-2)',
          borderTop: '2px solid var(--ink)',
          fontFamily: 'var(--font-mono)',
          fontWeight: '700',
          fontSize: '1.05rem'
        }}>
          <span style={{ fontFamily: 'var(--font-body)' }}>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}

export default ExpenseList;
