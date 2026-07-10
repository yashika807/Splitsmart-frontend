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
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '0 20px 32px'
      }}>
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
       <div id="ai-input-section" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        <AIInput onExpensesparsed={handleParsed} />
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        <ReceiptSplitter expenses={expenses} onAdd={onAdd} />
      </div>
      <ExpenseForm onAdd={onAdd} />
      <ExpenseList expenses={expenses} onDelete={onDelete} />

      {expenses.length > 1 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <button
            onClick={() => navigate('/settlement')}
            style={{
              background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
              color: 'white',
              padding: '14px 36px',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(108,99,255,0.4)'
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