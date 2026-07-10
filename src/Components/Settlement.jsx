function simplifyDebts(balances) {
  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => b.balance - a.balance);

  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({ name: b.name, balance: -b.balance }))
    .sort((a, b) => b.balance - a.balance);

  const transactions = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.balance, creditor.balance);

    transactions.push({ from: debtor.name, to: creditor.name, amount });

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  return transactions;
}
function Settlement({ expenses }) {
    if (expenses.length === 0) return null;
  
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const uniqueNames = [...new Set(expenses.map(e => e.name))];
    const fairShare = total / uniqueNames.length;
    const paidByPerson = {};
    uniqueNames.forEach(name => { paidByPerson[name] = 0; });
    expenses.forEach(e => { paidByPerson[e.name] += e.amount; });
  
    const balances = uniqueNames.map((name) => ({
      name,
      balance: paidByPerson[name] - fairShare,
    }));
    const transactions = simplifyDebts(balances);
  
    return (
      <div style={{ maxWidth: '500px', margin: '24px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>💸 Who Owes What</h2>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '16px' }}>
        Fair share per person: ₹{fairShare.toFixed(2)}
        </p>
  
        {transactions.length === 0 ? (
  <p style={{ textAlign: 'center', color: '#999' }}>Everyone's settled up! 🎉</p>
) : (
  transactions.map((t, i) => (
    <div key={i} style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 20px',
      marginBottom: '10px',
      borderRadius: '10px',
      background: '#fce4ec',
      border: '1px solid #f48fb1'
    }}>
      <span style={{ fontWeight: '500' }}>{t.from} → {t.to}</span>
      <span style={{ fontWeight: 'bold', color: '#c62828' }}>
        ₹{t.amount.toFixed(2)}
      </span>
    </div>
  ))
)}
      </div>
    );
  }
  
  export default Settlement;