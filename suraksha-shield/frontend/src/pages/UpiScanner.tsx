import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeUpi } from '../services/api';
import { AlertCircle } from 'lucide-react';

export default function UpiScanner() {
  const [data, setData] = useState({
    requester: 'unknown_vendor@upi',
    upi_id: 'unknown_vendor@upi',
    amount: '5000',
    type: 'Collect',
    note: 'Refund for failed transaction'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await analyzeUpi(data);
      navigate(`/results/${res.id}`);
    } catch (err) {
      setError('Failed to analyze the UPI request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: '600px' }}>
      <h1>Check a UPI Request</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Did someone ask you for money or a "refund"? Enter the details below to check if it's safe. Approving a <strong>Collect</strong> request means money leaves your account.
      </p>

      <form onSubmit={handleScan} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Request Type</label>
          <select 
            value={data.type}
            onChange={(e) => setData({...data, type: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card-raised)', color: 'var(--text)' }}
          >
            <option value="Pay">Pay (You are sending money)</option>
            <option value="Collect">Collect (Someone is asking for your money)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Requester Name / UPI ID</label>
          <input 
            type="text"
            value={data.requester}
            onChange={(e) => setData({...data, requester: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card-raised)', color: 'var(--text)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Amount</label>
          <input 
            type="number"
            value={data.amount}
            onChange={(e) => setData({...data, amount: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card-raised)', color: 'var(--text)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Note / Message</label>
          <input 
            type="text"
            value={data.note}
            onChange={(e) => setData({...data, note: e.target.value})}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card-raised)', color: 'var(--text)' }}
          />
        </div>

        {error && (
          <div style={{ color: 'var(--scam)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
          {loading ? 'Analyzing...' : 'Analyze Request'}
        </button>
      </form>
    </div>
  );
}
