import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import SettlementPage from './pages/SettlementPage';
import { API_BASE_URL } from './config';

const API = `${API_BASE_URL}/api/expenses`;

function App() {
  const [expenses, setExpenses] = useState([]);
  const [activeContext, setActiveContext] = useState('Trip');

  function fetchExpenses() {
    fetch(API)
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error('Failed to load expenses:', err));
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  const visibleExpenses = expenses.filter(
    e => (e.context || 'Trip') === activeContext
  );

  async function handleAdd(expense) {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...expense, context: activeContext })
    });
    fetchExpenses();
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchExpenses();
  }

  async function handleReset() {
    await Promise.all(visibleExpenses.map(e => fetch(`${API}/${e.id}`, { method: 'DELETE' })));
    fetchExpenses();
  }

  return (
    <BrowserRouter>
      <Navbar activeContext={activeContext} onContextChange={setActiveContext} />
      <Routes>
        <Route path="/" element={
          <Home expenses={visibleExpenses} onAdd={handleAdd} onDelete={handleDelete} />
        } />
        <Route path="/settlement" element={
          <SettlementPage expenses={visibleExpenses} onReset={handleReset} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;