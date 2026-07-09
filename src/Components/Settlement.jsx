function Settlement({ expenses }) {
    if (expenses.length === 0) return null;
  
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const perPerson = total / expenses.length;
  
    const balances = expenses.map((e) => ({
      name: e.name,
      balance: e.amount - perPerson,
    }));
  
    return (
      <div style={{ maxWidth: '500px', margin: '24px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>💸 Who Owes What</h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '16px' }}>
          Fair share per person: ₹{perPerson.toFixed(2)}
        </p>
  
        {balances.map((b, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            marginBottom: '10px',
            borderRadius: '10px',
            background: b.balance >= 0 ? '#e8f5e9' : '#fce4ec',
            border: `1px solid ${b.balance >= 0 ? '#a5d6a7' : '#f48fb1'}`
          }}>
            <span style={{ fontWeight: '500' }}>{b.name}</span>
            <span style={{ fontWeight: 'bold', color: b.balance >= 0 ? '#2e7d32' : '#c62828' }}>
              {b.balance >= 0
                ? `gets back ₹${b.balance.toFixed(2)}`
                : `owes ₹${Math.abs(b.balance).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  export default Settlement;