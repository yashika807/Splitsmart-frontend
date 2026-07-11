import EmptyState from './EmptyState';

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
    <div style={{ maxWidth: '500px', margin: 'var(--space-6) auto', padding: '0 var(--space-4)' }}>
      <h2 style={{ textAlign: 'center', color: 'var(--ink)', fontSize: '1.5rem', marginBottom: 'var(--space-1)' }}>
        Who Owes What
      </h2>
      <p style={{
        textAlign: 'center',
        color: 'var(--ink-soft)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        marginBottom: 'var(--space-5)'
      }}>
        Fair share per person: ₹{fairShare.toFixed(2)}
      </p>

      {transactions.length === 0 ? (
        <EmptyState title="Everyone's settled up" description="No payments needed — the math came out even." />
      ) : (
        transactions.map((t, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-2)',
            borderRadius: '6px',
            background: 'var(--red-soft)',
            border: '1px solid var(--red)'
          }}>
            <span style={{ fontWeight: '600' }}>{t.from} → {t.to}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--red)' }}>
              ₹{t.amount.toFixed(2)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default Settlement;
