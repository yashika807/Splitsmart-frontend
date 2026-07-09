import Settlement from '../Components/Settlement';
import { useNavigate } from 'react-router-dom';

function SettlementPage({ expenses, onReset }) {
  const navigate = useNavigate();

  return (
    <div>
      <Settlement expenses={expenses} />

      <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: '2px solid #6c63ff',
            color: '#6c63ff',
            padding: '10px 28px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '500',
            marginRight: '12px'
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => { onReset(); navigate('/'); }}
          style={{
            background: 'none',
            border: '2px solid #e53935',
            color: '#e53935',
            padding: '10px 28px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          🔄 Reset Trip
        </button>
      </div>
    </div>
  );
}

export default SettlementPage;