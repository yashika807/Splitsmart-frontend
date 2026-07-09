import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import SettlementPage from './pages/SettlementPage';

const API = 'http://localhost:8080/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  async function handleAdd(expense) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    const saved = await res.json();
    setExpenses([...expenses, saved]);
  }

  async function handleDelete(index) {
    const expense = expenses[index];
    await fetch(`${API}/${expense.id}`, { method: 'DELETE' });
    setExpenses(expenses.filter((_, i) => i !== index));
  }

  function handleReset() {
    expenses.forEach(e => fetch(`${API}/${e.id}`, { method: 'DELETE' }));
    setExpenses([]);
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