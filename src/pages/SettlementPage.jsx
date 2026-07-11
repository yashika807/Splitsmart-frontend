import Settlement from '../Components/Settlement';
import { useNavigate } from 'react-router-dom';

function SettlementPage({ expenses, onReset }) {
  const navigate = useNavigate();

  return (
    <div>
      <Settlement expenses={expenses} />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
        padding: 'var(--space-3) var(--space-4) var(--space-6)'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: '1.5px solid var(--ink)',
            color: 'var(--ink)',
            padding: '10px 26px',
            borderRadius: '6px',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => { onReset(); navigate('/'); }}
          style={{
            background: 'none',
            border: '1.5px solid var(--red)',
            color: 'var(--red)',
            padding: '10px 26px',
            borderRadius: '6px',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🔄 Reset Trip
        </button>
      </div>
    </div>
  );
}

export default SettlementPage;
