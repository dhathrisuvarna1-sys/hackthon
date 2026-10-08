import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Shield, PhoneCall, Globe, Lock, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer" style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-card)',
      padding: '32px 24px',
      marginTop: 'auto',
      fontSize: '0.9rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24
        }}>
          {/* Left info */}
          <div style={{ maxWidth: 460 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>
              <Shield size={18} />
              <span>Suraksha Shield (ಸುರಕ್ಷಾ ಶೀಲ್ಡ್ / सुरक्षा शील्ड)</span>
            </div>
            <p style={{ margin: '0 0 8px 0', lineHeight: 1.5 }}>
              {t('footer.disclaimer', 'Guidance only. Not a guarantee. Always independently verify suspicious payment requests directly with your bank.')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
              <Lock size={14} color="var(--accent)" />
              <span>{t('footer.privacy', 'Zero-credential policy: We never ask for, log, or store OTPs, UPI PINs, or banking passwords.')}</span>
            </div>
          </div>

          {/* Center Official Helplines */}
          <div style={{
            background: 'var(--bg-card-raised)',
            padding: '16px 20px',
            borderRadius: 16,
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <PhoneCall size={16} color="var(--warn)" />
              <span>Official Cyber Fraud Reporting</span>
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem' }}>
              Call National Helpline: <strong style={{ color: 'var(--accent)' }}>1930</strong>
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Official Portal:{' '}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                cybercrime.gov.in <ExternalLink size={12} />
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Navigation</span>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <Link to="/scan/message" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Scan Message</Link>
            <Link to="/learn" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Learn Center</Link>
            <Link to="/history" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>History</Link>
            <Link to="/about" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>About & Privacy</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 16,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.8rem'
        }}>
          <div>
            Languages available: <strong>English</strong> • <strong>ಕನ್ನಡ (Kannada)</strong> • <strong>हिंदी (Hindi)</strong>
          </div>
          <div>
            Built with accessible fintech standards. No government or banking affiliation claimed.
          </div>
        </div>
      </div>
    </footer>
  );
}
