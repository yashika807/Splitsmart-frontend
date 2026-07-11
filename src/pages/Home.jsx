import ExpenseForm from '../Components/ExpenseForm';
import ExpenseList from '../Components/ExpenseList';
import Hero from '../Components/Hero';
import AIInput from '../Components/AIInput';
import ReceiptSplitter from '../Components/ReceiptSplitter';
import FeatureCard from '../Components/FeatureCard';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: '✨', title: 'AI Parsing', description: 'Describe expenses in plain English — Gemini turns them into structured entries automatically.' },
  { icon: '🧾', title: 'Receipt Splitting', description: 'Photograph a receipt — AI reads each item and splits it (with proportional tax/tip) exactly the way people actually shared it.' },
  { icon: '💸', title: 'Fair Split', description: 'A greedy debt-simplification algorithm works out the fewest payments needed to settle up.' },
  { icon: '🧳', title: 'Trip vs Family', description: 'Keep a weekend trip and your recurring family expenses separate with one tap.' },
];

function Home({ expenses, onAdd, onDelete }) {
  function scrollToAIInput() {
    document.getElementById('ai-input-section').scrollIntoView({ behavior: 'smooth' });
  }
  const navigate = useNavigate();

  async function handleParsed(parsedExpenses) {
    if (!Array.isArray(parsedExpenses)) {
      throw new Error('AI parsing failed — try rephrasing your expense.');
    }
    for (const expense of parsedExpenses) {
      await onAdd(expense);
    }
  }

  return (

    <div>
      <Hero onTryItClick={scrollToAIInput} />
      <div style={{
        display: 'flex',
        gap: 'var(--space-5)',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: 'var(--space-6) var(--space-4)'
      }}>
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
       <div id="ai-input-section" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <AIInput onExpensesparsed={handleParsed} />
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <ReceiptSplitter expenses={expenses} onAdd={onAdd} />
      </div>
      <ExpenseForm onAdd={onAdd} />
      <ExpenseList expenses={expenses} onDelete={onDelete} />

      {expenses.length > 1 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-5) var(--space-4)' }}>
          <button
            onClick={() => navigate('/settlement')}
            style={{
              background: 'var(--green)',
              color: 'var(--paper)',
              padding: '13px 32px',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            See Who Owes What →
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;