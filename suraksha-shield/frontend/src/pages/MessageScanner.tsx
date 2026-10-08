import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeMessage } from '../services/api';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Mic, MicOff } from 'lucide-react';

const EXAMPLES = [
  { label: 'Fake KYC', text: 'Dear customer, your bank account will be blocked today. Complete KYC immediately at verify-kyc.test' },
  { label: 'Lottery', text: 'Congratulations! You won $10,000. Click here to claim your prize.' },
  { label: 'Normal Alert', text: 'Your account balance is $5,000. No action needed.' },
  { label: 'Kannada Scam', text: 'ಆತ್ಮೀಯ ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಇಂದು ನಿರ್ಬಂಧಿಸಲಾಗುತ್ತದೆ. ತಕ್ಷಣವೇ KYC ಪೂರ್ಣಗೊಳಿಸಿ.' },
  { label: 'Hindi Scam', text: 'प्रिय ग्राहक, आपका बैंक खाता आज ब्लॉक कर दिया जाएगा। तुरंत KYC पूरा करें.' }
];

export default function MessageScanner() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Please type or paste instead.');
      return;
    }
    
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    
    // Map language
    let lang = 'en-IN';
    if (i18n.language === 'hi') lang = 'hi-IN';
    if (i18n.language === 'kn') lang = 'kn-IN';
    
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setText(prev => (prev + ' ' + finalTranscript).trim());
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please enable it in browser settings.');
      } else {
        setError('Voice recognition error: ' + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const res = await analyzeMessage(text);
      navigate(`/results/${res.id}`);
    } catch (err) {
      setError('Failed to analyze the message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: '800px' }}>
      <h1>Check a Message</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Paste any suspicious SMS, email text, or WhatsApp message below. We will never save your message.
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {EXAMPLES.map(ex => (
          <button 
            key={ex.label}
            onClick={() => setText(ex.text)}
            style={{ padding: '8px 12px', background: 'var(--bg-card-raised)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '0.875rem', cursor: 'pointer' }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleScan}>
        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your message here..."
            disabled={loading}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            maxLength={1000}
          />
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              type="button" 
              onClick={toggleListen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '50px',
                background: isListening ? 'rgba(255, 92, 92, 0.1)' : 'var(--bg-card-raised)',
                color: isListening ? 'var(--scam)' : 'var(--text)',
                border: '1px solid var(--border)',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              aria-label={isListening ? "Stop listening" : "Start voice typing"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? 'Listening...' : 'Dictate'}
            </button>
            <span>{text.length} / 1000</span>
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--scam)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button 
            type="button" 
            onClick={() => setText('')}
            disabled={loading}
            className="btn-outline"
            style={{ padding: '12px 24px' }}
          >
            Clear
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || !text.trim()}
          >
            {loading ? 'Analyzing...' : 'Analyze Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
