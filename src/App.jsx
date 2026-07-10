import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import SettlementPage from './pages/SettlementPage';
import { API_BASE_URL } from './config';

const API = `${API_BASE_URL}/api/expenses`;

function App() {
  const [expenses, setExpenses] = useState([]);

  function fetchExpenses() {
    fetch(API)
      .then(res => res.json())
      .then(data => setExpenses(data));
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function handleAdd(expense) {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    fetchExpenses();
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchExpenses();
  }

  async function handleReset() {
    await Promise.all(expenses.map(e => fetch(`${API}/${e.id}`, { method: 'DELETE' })));
    fetchExpenses();
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <Home expenses={expenses} onAdd={handleAdd} onDelete={handleDelete} />
        } />
        <Route path="/settlement" element={
          <SettlementPage expenses={expenses} onReset={handleReset} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;