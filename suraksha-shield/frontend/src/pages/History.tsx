import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import SafeStepsSvg from '../components/illustrations/SafeStepsSvg';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const mockHistory = [
      { id: '1', date: '2023-10-01', type: 'Message', result: 'SCAM', snippet: 'Your account will be blocked...' },
      { id: '2', date: '2023-10-02', type: 'UPI', result: 'SAFE', snippet: 'UPI Request for 500' }
    ];
    setHistory(mockHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Scan History</h1>
        <button onClick={clearHistory} style={{ color: 'var(--scam)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <SafeStepsSvg className="illustration-svg" style={{ width: '120px', height: '120px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No history found. Your safe scans will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map(item => (
            <div key={item.id} style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{item.type}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.date}</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>{item.snippet}</div>
              </div>
              <div>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  background: item.result === 'SCAM' ? 'rgba(255,92,92,0.2)' : 'rgba(52,211,160,0.2)',
                  color: item.result === 'SCAM' ? 'var(--scam)' : 'var(--safe)',
                  fontWeight: 600
                }}>
                  {item.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
