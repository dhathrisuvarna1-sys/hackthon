import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle } from 'lucide-react';

export default function ImageScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    if (selected.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }
    
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError('');
  };

  const handleExtractText = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    
    try {
      const { analyzeImage } = await import('../services/api');
      const res = await analyzeImage(file);
      setExtractedText(res.extracted_text || '');
      if (res.status === 'warning') {
        setError(res.message || 'No text could be extracted or warning during extraction.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from image.');
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    if (!extractedText.trim()) return;
    setLoading(true);
    try {
      const { analyzeMessage } = await import('../services/api');
      const res = await analyzeMessage(extractedText);
      navigate(`/results/${res.id}`);
    } catch (err) {
      setError('Failed to analyze the text.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: '800px' }}>
      <h1>Scan a Screenshot</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Upload a screenshot of a suspicious message (PNG, JPEG, WebP, max 5MB). We will extract the text for you.
      </p>

      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--accent)',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'var(--bg-card)'
          }}
        >
          <Upload size={48} color="var(--accent)" style={{ marginBottom: '16px' }} />
          <h3>Drag and drop or browse</h3>
          <p>Support for English, Kannada, and Hindi.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/webp" 
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ position: 'relative' }}>
              <img src={preview} alt="Screenshot preview" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border)' }} />
              <button 
                onClick={() => { setFile(null); setPreview(''); setExtractedText(''); }}
                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '50%' }}
              >
                <X size={20} />
              </button>
            </div>
            {!extractedText && (
              <button onClick={handleExtractText} className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
                {loading ? 'Extracting text...' : 'Extract Text'}
              </button>
            )}
          </div>
          
          {extractedText && (
            <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '8px' }}>Review Extracted Text</h3>
              <textarea 
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                style={{ width: '100%', height: '200px', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', flexGrow: 1, background: 'var(--bg-card-raised)', color: 'var(--text)' }}
              />
              <button onClick={handleScan} className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--scam)', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
    </div>
  );
}
