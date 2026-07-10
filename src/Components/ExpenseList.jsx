function ExpenseList({ expenses, onDelete }) {
    if (expenses.length === 0) {
      return <p style={{ textAlign: 'center', color: '#999' }}>No expenses yet. Add one above!</p>;
    }
  
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
        {expenses.map((expense) => (
          <div key={expense.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            marginBottom: '10px',
            background: '#f9f9f9',
            borderRadius: '10px',
            border: '1px solid #eee'
          }}>
            <span>{expense.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: 'bold', color: '#6c63ff' }}>₹{expense.amount}</span>
              <button
                onClick={() => onDelete(expense.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
  
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: '#6c63ff',
          borderRadius: '10px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          marginTop: '8px'
        }}>
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    );
  }
  
  export default ExpenseList;