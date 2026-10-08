import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Smartphone, Loader2, ShieldAlert, CheckCircle2, ShieldQuestion, ArrowRight } from 'lucide-react';
import { analyzeMessage } from '../services/api';

const DEMO_MESSAGES = [
  {
    id: 1,
    text: "ನಿಮ್ಮ bank account KYC update ಆಗಿಲ್ಲ. ಇವತ್ತೇ update ಮಾಡಿ ಇಲ್ಲಾಂದ್ರೆ account block ಆಗುತ್ತೆ. ಈ link click ಮಾಡಿ.",
    type: "Kannada + English Mixed Scam",
  },
  {
    id: 2,
    text: "Your bank account will be blocked today. Complete KYC immediately at http://verify-kyc-example.test",
    type: "English KYC Scam",
  },
  {
    id: 3,
    text: "Your payment of ₹500 to ABC Store was successful.",
    type: "Safe Payment Alert",
  },
  {
    id: 4,
    text: "Congratulations! You won $10,000. Click here to claim your prize.",
    type: "English Lottery Scam",
  }
];

export default function AutomaticScanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeMessage, setActiveMessage] = useState(DEMO_MESSAGES[0]);
  const [status, setStatus] = useState<'idle' | 'incoming' | 'analyzing' | 'result'>('idle');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const simulateIncoming = () => {
    setStatus('incoming');
    setTimeout(() => {
      setStatus('analyzing');
      performAnalysis();
    }, 1500);
  };

  const performAnalysis = async () => {
    try {
      const result = await analyzeMessage(activeMessage.text);
      setAnalysisResult(result);
      setStatus('result');
      // Wait a bit to let the user see the alert on the message bubble, then navigate
      setTimeout(() => {
        navigate(`/results/${result.id}`);
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert("Failed to connect to the backend analysis engine.");
    }
  };

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'SCAM': return 'var(--risk-scam)';
      case 'SUSPICIOUS': return 'var(--risk-suspicious)';
      case 'SAFE': return 'var(--risk-safe)';
      default: return 'var(--text-muted)';
    }
  };

  const getRiskIcon = (level: string) => {
    switch(level) {
      case 'SCAM': return <ShieldAlert size={20} color="var(--risk-scam)" />;
      case 'SUSPICIOUS': return <ShieldQuestion size={20} color="var(--risk-suspicious)" />;
      case 'SAFE': return <CheckCircle2 size={20} color="var(--risk-safe)" />;
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '16px' }}>Automatic Message Screening</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Suraksha Shield can analyze a message automatically in supported integrations. 
          Select a scenario below to see how it looks when a native SMS arrives.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Left Side: Controls */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <h3 style={{ marginBottom: '16px' }}>Select a Demo Scenario</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {DEMO_MESSAGES.map(msg => (
              <button
                key={msg.id}
                onClick={() => { setActiveMessage(msg); setStatus('idle'); setAnalysisResult(null); }}
                className={activeMessage.id === msg.id ? 'btn-primary' : 'btn-outline'}
                disabled={status !== 'idle'}
                style={{ textAlign: 'left', padding: '12px 16px' }}
              >
                {msg.type}
              </button>
            ))}
          </div>

          <button 
            onClick={simulateIncoming}
            className="btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={status !== 'idle'}
          >
            Simulate Incoming SMS <ArrowRight size={20} />
          </button>
        </div>

        {/* Right Side: Phone UI */}
        <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '320px', 
            height: '600px', 
            border: '12px solid #1a1a1a', 
            borderRadius: '40px', 
            background: 'var(--bg-page)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Phone Notch/Header */}
            <div style={{ background: '#1a1a1a', padding: '12px', display: 'flex', justifyContent: 'center' }}>
               <div style={{ width: '80px', height: '24px', background: 'black', borderRadius: '12px' }}></div>
            </div>
            
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div style={{ fontWeight: 600, textAlign: 'center' }}>Messages</div>
            </div>
            
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: 'var(--bg-page)' }}>
              
              {status === 'idle' && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40%' }}>
                  <Smartphone size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p>Inbox is empty</p>
                </div>
              )}
              
              {(status === 'incoming' || status === 'analyzing' || status === 'result') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', animation: 'slideDown 0.3s ease-out forwards' }}>
                  
                  {/* SMS Bubble */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ 
                      background: '#344054', // Generic SMS bubble color
                      color: '#ffffff',
                      padding: '12px 16px', 
                      borderRadius: '18px', 
                      borderBottomLeftRadius: '4px',
                      maxWidth: '85%',
                      fontSize: '0.9rem',
                      lineHeight: 1.4,
                      position: 'relative'
                    }}>
                      {activeMessage.text}
                      
                      {/* Alert badge on the bubble if it's analyzed */}
                      {status === 'result' && analysisResult && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: 'var(--bg-card)',
                          borderRadius: '50%',
                          padding: '2px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                        }}>
                          {getRiskIcon(analysisResult.risk_level)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analysis Status / Banner underneath bubble */}
                  <div style={{ marginTop: '8px', minHeight: '40px' }}>
                    {status === 'analyzing' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.8rem', marginLeft: '12px' }}>
                        <Loader2 className="animate-spin" size={14} />
                        Suraksha Shield analyzing...
                      </div>
                    )}
                    
                    {status === 'result' && analysisResult && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: '8px', 
                        color: getRiskColor(analysisResult.risk_level),
                        background: 'var(--bg-card)',
                        border: `1px solid ${getRiskColor(analysisResult.risk_level)}40`,
                        padding: '8px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        animation: 'fadeIn 0.3s ease-out forwards',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                           {analysisResult.risk_level === 'SCAM' ? 'Scam Detected' : 
                            analysisResult.risk_level === 'SUSPICIOUS' ? 'Suspicious Message' : 
                            'Safe Message'}
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Opening details...</div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
            
            {/* Phone bottom bar */}
            <div style={{ height: '30px', background: 'var(--bg-page)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '4px', background: 'var(--text-muted)', borderRadius: '2px', opacity: 0.5 }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
