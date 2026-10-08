import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquareWarning, Image, QrCode, ShieldAlert, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '60px 24px' }}>
      <div className="container">
        
        {/* Hero Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '64px', alignItems: 'center', marginBottom: '80px' }}>
          
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              Digital Payment Safety
            </div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 24px 0', lineHeight: 1.1 }}>
              Not sure if a message is real? <br/>
              <span style={{ color: 'var(--accent)' }}>Check before you trust it.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', margin: '0 0 40px 0', maxWidth: '480px' }}>
              Protect yourself from UPI fraud, fake links, and phishing scams in your local language.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/scan/message" className="btn-primary">
                Check a Message
              </Link>
              <Link to="/scan/automatic" className="btn-primary" style={{ background: '#116466', color: '#fff', border: 'none' }}>
                Simulate Incoming Message
              </Link>
              <Link to="/learn" className="btn-outline">
                How It Works
              </Link>
            </div>
            
            {/* Real Stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '48px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Scans this session</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  12 <span style={{ fontSize: '0.75rem', color: 'var(--safe)' }}><ArrowUpRight size={12} /> 2</span>
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Warnings found</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  4 <span style={{ fontSize: '0.75rem', color: 'var(--scam)' }}><ArrowUpRight size={12} /> 1</span>
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Languages</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>3</div>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Card Preview */}
          <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '24px', background: 'var(--accent)', color: 'var(--on-accent)', fontSize: '0.625rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', letterSpacing: '1px' }}>
                EXAMPLE, NOT A REAL SCAN
              </div>
              
              <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
                Dear customer, your bank account will be <span style={{ background: 'rgba(255, 92, 92, 0.2)', color: 'var(--scam)' }}>blocked today</span>. Complete KYC immediately at <span style={{ background: 'rgba(255, 92, 92, 0.2)', color: 'var(--scam)' }}>verify-kyc.test</span>
              </div>

              <div style={{ borderLeft: '4px solid var(--scam)', paddingLeft: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--scam)', marginBottom: '8px', fontWeight: 600 }}>
                  <ShieldAlert size={20} />
                  Potential Scam
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  This message exhibits high-risk patterns common in phishing and impersonation scams.
                </div>
              </div>

              <div style={{ background: 'var(--bg-card-raised)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>Evidence Detected</div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--scam)', marginTop: '2px' }}><ShieldAlert size={14} /></div>
                  <div>
                    <strong>Urgency</strong>
                    <div style={{ color: 'var(--text-muted)' }}>Forces immediate action</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.875rem' }}>
                  <div style={{ color: 'var(--scam)', marginTop: '2px' }}><ShieldAlert size={14} /></div>
                  <div>
                    <strong>Suspicious Link</strong>
                    <div style={{ color: 'var(--text-muted)' }}>Domain mismatch</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scan Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          {[
            { to: '/scan/message', icon: MessageSquareWarning, title: 'Check a Message', desc: 'Paste suspicious SMS or WhatsApp text' },
            { to: '/scan/image', icon: Image, title: 'Scan a Screenshot', desc: 'Upload images of WhatsApp or social media' },
            { to: '/scan/upi', icon: QrCode, title: 'Check a UPI Request', desc: 'Verify QR codes and collect requests' }
          ].map((tile, i) => (
            <Link key={i} to={tile.to} className="card" style={{ textDecoration: 'none', display: 'block', transition: 'background 0.2s', border: '1px solid var(--border)' }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card-raised)'} onMouseOut={e => e.currentTarget.style.background = 'var(--bg-card)'}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '16px' }}>
                <tile.icon size={24} />
              </div>
              <h3 style={{ color: 'var(--text)', marginBottom: '8px' }}>{tile.title}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>{tile.desc}</p>
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ marginBottom: '24px' }}>How it works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { step: '01', title: 'Paste the message', desc: 'Copy any suspicious message from SMS or WhatsApp.' },
                { step: '02', title: 'Instant Analysis', desc: 'Our system checks against known fraud patterns.' },
                { step: '03', title: 'Stay Safe', desc: 'Get clear steps on what to do next.' }
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.25rem' }}>{s.step}</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0' }}>{s.title}</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ marginBottom: '24px' }}>Common Scams</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Fake KYC Verification', 'Prize & Lottery', 'UPI Collect Requests', 'Remote Access Apps'].map((scam, i) => (
                <Link key={i} to={`/learn#${scam.toLowerCase().replace(/ /g, '-')}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', textDecoration: 'none', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--accent)' }}><CheckCircle2 size={16} /></div>
                  <span style={{ color: 'var(--text)' }}>{scam}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
