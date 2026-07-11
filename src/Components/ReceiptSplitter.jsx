import { useState } from 'react';
import { API_BASE_URL } from '../config';

function computeShares(items, people, tax, tip) {
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const taxTip = (Number(tax) || 0) + (Number(tip) || 0);

  const itemShareByPerson = {};
  people.forEach((p) => { itemShareByPerson[p] = 0; });

  items.forEach((item) => {
    const n = item.assignedTo.length;
    if (n === 0) return;
    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
    const perPerson = itemTotal / n;
    item.assignedTo.forEach((p) => {
      itemShareByPerson[p] = (itemShareByPerson[p] || 0) + perPerson;
    });
  });

  const shares = {};
  people.forEach((p) => {
    const itemShare = itemShareByPerson[p] || 0;
    const taxTipShare = subtotal > 0 ? (itemShare / subtotal) * taxTip : 0;
    shares[p] = { itemShare, taxTipShare, total: itemShare + taxTipShare };
  });

  return { subtotal, shares };
}

const fieldStyle = {
  padding: '9px 12px',
  borderRadius: '5px',
  border: '1px solid var(--line-strong)',
  background: 'var(--paper)',
  color: 'var(--ink)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  boxSizing: 'border-box'
};

const labelStyle = {
  fontSize: '0.82rem',
  fontWeight: '700',
  color: 'var(--ink-soft)',
  marginBottom: 'var(--space-2)',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  fontFamily: 'var(--font-mono)'
};

function ReceiptSplitter({ expenses, onAdd }) {
  const [step, setStep] = useState('idle'); // idle | loading | reviewing
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);
  const [people, setPeople] = useState([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [payer, setPayer] = useState('');
  const [saving, setSaving] = useState(false);

  const suggestedNames = [...new Set(expenses.map((e) => e.name))];

  async function handleFileSelect(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setStep('loading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/expenses/parse-receipt`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not read that receipt.');
      }
      if (!data.items || data.items.length === 0) {
        throw new Error('No line items found on that receipt.');
      }

      setItems(data.items.map((item, idx) => ({
        id: idx,
        itemName: item.itemName,
        price: item.price,
        quantity: item.quantity || 1,
        assignedTo: []
      })));
      setTax(data.tax ?? 0);
      setTip(data.tip ?? 0);
      setPeople(suggestedNames);
      setPayer(suggestedNames[0] || '');
      setStep('reviewing');
    } catch (err) {
      setError(err.message || 'Something went wrong reading that receipt.');
      setStep('idle');
    }
  }

  function updateItem(id, field, value) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function toggleAssign(id, person) {
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const isAssigned = item.assignedTo.includes(person);
      return {
        ...item,
        assignedTo: isAssigned
          ? item.assignedTo.filter((p) => p !== person)
          : [...item.assignedTo, person]
      };
    }));
  }

  function addPerson() {
    const name = newPersonName.trim();
    if (!name) return;
    setPeople((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setNewPersonName('');
    setPayer((prev) => prev || name);
  }

  function removePerson(name) {
    setPeople((prev) => prev.filter((p) => p !== name));
    setItems((prev) => prev.map((item) => ({
      ...item,
      assignedTo: item.assignedTo.filter((p) => p !== name)
    })));
    setPayer((prev) => (prev === name ? '' : prev));
  }

  function reset() {
    setStep('idle');
    setItems([]);
    setTax(0);
    setTip(0);
    setPeople([]);
    setPayer('');
    setError('');
  }

  const { subtotal, shares } = computeShares(items, people, tax, tip);
  const grandTotal = subtotal + (Number(tax) || 0) + (Number(tip) || 0);
  const unassignedItems = items.filter((item) => item.assignedTo.length === 0);
  const canSave = payer && people.length > 0 && unassignedItems.length === 0 && items.length > 0;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      await onAdd({ name: payer, amount: Number(grandTotal.toFixed(2)) });
      reset();
    } catch (err) {
      setError('Saved the receipt math, but failed to save the expense. Try again?');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: 'var(--space-5)',
      background: 'var(--paper-raised)',
      borderRadius: '8px',
      border: '1px solid var(--amber)',
      marginBottom: 'var(--space-5)'
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--amber)', marginBottom: 'var(--space-2)' }}>
        🧾 Split a Receipt
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: 'var(--space-3)' }}>
        Photograph a receipt — AI reads each item, you assign who had what,
        and it works out everyone's share including tax and tip.
      </p>

      {step === 'idle' && (
        <label style={{
          display: 'block',
          textAlign: 'center',
          padding: '13px 28px',
          background: 'var(--amber)',
          color: 'var(--ink)',
          borderRadius: '6px',
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: 'pointer'
        }}>
          📷 Upload / Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
      )}

      {step === 'loading' && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--amber-soft)',
            border: '1px solid var(--amber)',
            borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            color: 'var(--ink)',
            marginBottom: 'var(--space-4)'
          }}>
            <span className="stamp-spin" aria-hidden="true" />
            <span>Reading your receipt&hellip;</span>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-3) 0',
              borderBottom: '1px dashed var(--line)'
            }}>
              <span className="skel" style={{ width: `${90 - i * 15}px`, height: '14px' }} />
              <span className="skel" style={{ width: '50px', height: '14px' }} />
            </div>
          ))}
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginTop: 'var(--space-2)' }}>{error}</p>
      )}

      {step === 'reviewing' && (
        <div>
          {/* Line items */}
          <div style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            {items.map((item) => (
              <div key={item.id} style={{
                background: 'var(--paper)',
                borderRadius: '6px',
                border: '1px solid var(--line)',
                padding: 'var(--space-3)',
                marginBottom: 'var(--space-3)'
              }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <input
                    value={item.itemName}
                    onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                    style={{ ...fieldStyle, flex: '2 1 140px' }}
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                    placeholder="Price"
                    style={{ ...fieldStyle, flex: '1 1 70px', fontFamily: 'var(--font-mono)' }}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    placeholder="Qty"
                    min="1"
                    style={{ ...fieldStyle, flex: '1 1 60px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {people.length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>Add people below to assign this item</span>
                  )}
                  {people.map((person) => (
                    <button
                      key={person}
                      onClick={() => toggleAssign(item.id, person)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '999px',
                        border: item.assignedTo.includes(person) ? '1px solid var(--amber)' : '1px solid var(--line-strong)',
                        background: item.assignedTo.includes(person) ? 'var(--amber)' : 'var(--paper)',
                        color: item.assignedTo.includes(person) ? 'var(--ink)' : 'var(--ink-soft)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: item.assignedTo.includes(person) ? '700' : '400',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {person}
                    </button>
                  ))}
                </div>
                {item.assignedTo.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--red)', margin: 'var(--space-2) 0 0' }}>
                    Not assigned to anyone yet
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* People roster */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p style={labelStyle}>Who's splitting this?</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              {people.map((person) => (
                <span key={person} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  background: 'var(--green-soft)',
                  color: 'var(--ink)',
                  fontSize: '0.85rem'
                }}>
                  {person}
                  <button
                    onClick={() => removePerson(person)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', padding: 0, fontSize: '0.9rem' }}
                    aria-label={`Remove ${person}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                placeholder="Add a person"
                style={{ ...fieldStyle, flex: 1 }}
              />
              <button onClick={addPerson} style={{
                padding: '9px 18px',
                borderRadius: '5px',
                border: 'none',
                background: 'var(--ink)',
                color: 'var(--paper)',
                fontFamily: 'var(--font-body)',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
                + Add
              </button>
            </div>
          </div>

          {/* Paid by */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p style={labelStyle}>Who paid the bill?</p>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              style={{ ...fieldStyle, width: '100%' }}
            >
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
          </div>

          {/* Tax / tip */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ flex: 1 }}>
              <p style={labelStyle}>Tax</p>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                style={{ ...fieldStyle, width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p style={labelStyle}>Tip</p>
              <input
                type="number"
                value={tip}
                onChange={(e) => setTip(Number(e.target.value))}
                style={{ ...fieldStyle, width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: 'var(--paper)',
            borderRadius: '6px',
            border: '1px solid var(--line)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)'
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              fontSize: '0.88rem',
              marginTop: 0,
              marginBottom: 'var(--space-3)',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--line)'
            }}>
              Subtotal ₹{subtotal.toFixed(2)} + Tax ₹{(Number(tax) || 0).toFixed(2)} + Tip ₹{(Number(tip) || 0).toFixed(2)} = ₹{grandTotal.toFixed(2)}
            </p>
            {people.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: 0 }}>Add people to see who owes what.</p>
            ) : (
              people.map((person) => {
                const share = shares[person] || { itemShare: 0, taxTipShare: 0, total: 0 };
                const isPayer = person === payer;
                return (
                  <div key={person} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    fontSize: '0.9rem'
                  }}>
                    <span>{isPayer ? `${person} (paid the bill)` : `${person} owes ${payer || '—'}`}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: isPayer ? 'var(--ink-soft)' : 'var(--red)' }}>
                      ₹{share.total.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                background: canSave && !saving ? 'var(--green)' : 'var(--line)',
                color: canSave && !saving ? 'var(--paper)' : 'var(--ink-soft)',
                fontFamily: 'var(--font-body)',
                fontWeight: '700',
                cursor: canSave && !saving ? 'pointer' : 'not-allowed'
              }}
            >
              {saving ? 'Saving...' : '✅ Save as Expense'}
            </button>
            <button
              onClick={reset}
              style={{
                padding: '12px 20px',
                borderRadius: '6px',
                border: '1px solid var(--line-strong)',
                background: 'var(--paper)',
                color: 'var(--ink-soft)',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
          {!canSave && unassignedItems.length > 0 && (
            <p style={{ fontSize: '0.8rem', color: 'var(--red)', marginTop: 'var(--space-2)', marginBottom: 0 }}>
              Assign every item to at least one person before saving.
            </p>
          )}
          {!canSave && unassignedItems.length === 0 && !payer && (
            <p style={{ fontSize: '0.8rem', color: 'var(--red)', marginTop: 'var(--space-2)', marginBottom: 0 }}>
              Select who paid the bill before saving.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ReceiptSplitter;
