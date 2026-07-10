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
      padding: '20px',
      background: 'linear-gradient(135deg, #fff7ed, #fef3e2)',
      borderRadius: '16px',
      border: '2px solid #fde4c8',
      marginBottom: '24px'
    }}>
      <p style={{ fontWeight: '600', color: '#c2740a', marginBottom: '10px' }}>
        🧾 Split a Receipt
      </p>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '12px' }}>
        Photograph a receipt — AI reads each item, you assign who had what,
        and it works out everyone's share including tax and tip.
      </p>

      {step === 'idle' && (
        <label style={{
          display: 'block',
          textAlign: 'center',
          padding: '14px 28px',
          background: 'linear-gradient(135deg, #f5a623, #c2740a)',
          color: 'white',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: '600',
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
        <div style={{ textAlign: 'center', padding: '20px', color: '#c2740a', fontWeight: '600' }}>
          🤖 Reading your receipt...
        </div>
      )}

      {error && (
        <p style={{ color: '#e53935', fontSize: '0.85rem', marginTop: '8px' }}>{error}</p>
      )}

      {step === 'reviewing' && (
        <div>
          {/* Line items */}
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            {items.map((item) => (
              <div key={item.id} style={{
                background: 'white',
                borderRadius: '10px',
                border: '1px solid #f0e0c8',
                padding: '12px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <input
                    value={item.itemName}
                    onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                    style={{ flex: '2 1 140px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                    placeholder="Price"
                    style={{ flex: '1 1 70px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    placeholder="Qty"
                    min="1"
                    style={{ flex: '1 1 60px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {people.length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>Add people below to assign this item</span>
                  )}
                  {people.map((person) => (
                    <button
                      key={person}
                      onClick={() => toggleAssign(item.id, person)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '999px',
                        border: item.assignedTo.includes(person) ? '1px solid #c2740a' : '1px solid #ddd',
                        background: item.assignedTo.includes(person) ? '#c2740a' : 'white',
                        color: item.assignedTo.includes(person) ? 'white' : '#666',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {person}
                    </button>
                  ))}
                </div>
                {item.assignedTo.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: '#e53935', margin: '6px 0 0' }}>
                    Not assigned to anyone yet
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* People roster */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
              Who's splitting this?
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {people.map((person) => (
                <span key={person} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  background: '#fef0da',
                  fontSize: '0.85rem'
                }}>
                  {person}
                  <button
                    onClick={() => removePerson(person)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0, fontSize: '0.9rem' }}
                    aria-label={`Remove ${person}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                placeholder="Add a person"
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
              />
              <button onClick={addPerson} style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#c2740a',
                color: 'white',
                cursor: 'pointer'
              }}>
                + Add
              </button>
            </div>
          </div>

          {/* Paid by */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
              Who paid the bill?
            </p>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', width: '100%' }}
            >
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
          </div>

          {/* Tax / tip */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Tax</p>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Tip</p>
              <input
                type="number"
                value={tip}
                onChange={(e) => setTip(Number(e.target.value))}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: 'white',
            borderRadius: '10px',
            border: '1px solid #f0e0c8',
            padding: '14px',
            marginBottom: '16px'
          }}>
            <p style={{ fontWeight: '600', marginTop: 0, marginBottom: '10px' }}>
              Subtotal ₹{subtotal.toFixed(2)} + Tax ₹{(Number(tax) || 0).toFixed(2)} + Tip ₹{(Number(tip) || 0).toFixed(2)} = ₹{grandTotal.toFixed(2)}
            </p>
            {people.length === 0 ? (
              <p style={{ color: '#999', fontSize: '0.85rem', margin: 0 }}>Add people to see who owes what.</p>
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
                    <span style={{ fontWeight: 'bold', color: isPayer ? '#666' : '#c62828' }}>
                      ₹{share.total.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: canSave && !saving ? 'linear-gradient(135deg, #f5a623, #c2740a)' : '#ccc',
                color: 'white',
                fontWeight: '600',
                cursor: canSave && !saving ? 'pointer' : 'not-allowed'
              }}
            >
              {saving ? 'Saving...' : '✅ Save as Expense'}
            </button>
            <button
              onClick={reset}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                background: 'white',
                color: '#666',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
          {!canSave && unassignedItems.length > 0 && (
            <p style={{ fontSize: '0.8rem', color: '#e53935', marginTop: '8px', marginBottom: 0 }}>
              Assign every item to at least one person before saving.
            </p>
          )}
          {!canSave && unassignedItems.length === 0 && !payer && (
            <p style={{ fontSize: '0.8rem', color: '#e53935', marginTop: '8px', marginBottom: 0 }}>
              Select who paid the bill before saving.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ReceiptSplitter;
