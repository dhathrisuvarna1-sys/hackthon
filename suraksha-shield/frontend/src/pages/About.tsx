import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, AlertTriangle, PhoneCall, Globe, CheckCircle2, Info } from 'lucide-react';
import SafeStepsSvg from '../components/illustrations/SafeStepsSvg';

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  return (
    <div className="page-container" style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--accent)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12
        }}>
          <ShieldCheck size={18} />
          {t('about.eyebrow', 'Public Safety Initiative')}
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
          {t('about.title', 'About Suraksha Shield')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
          {t('about.subtitle', 'A privacy-first vernacular scam and UPI fraud detection shield built specifically for elderly and first-time digital payment users in India.')}
        </p>
      </div>

      {/* Grid of Principles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        marginBottom: 40
      }}>
        {/* Card 1: Privacy First */}
        <div className="card" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 24
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--accent-tint)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <Lock size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            {t('about.privacy_title', 'Zero-Credential & Zero-Log Policy')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('about.privacy_desc', 'Suraksha Shield never asks for, processes, or stores banking passwords, UPI PINs, or OTPs. Uploaded screenshots are processed entirely in memory, stripped of metadata, and immediately discarded without writing to disk.')}
          </p>
        </div>

        {/* Card 2: Transparent Rules Engine */}
        <div className="card" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 24
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--accent-tint)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <ShieldCheck size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            {t('about.transparent_title', 'Transparent Heuristic Engine')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('about.transparent_desc', 'Every verdict is powered by transparent rules that examine urgency keywords, deceptive domain patterns, APK downloads, and payment pressure. We never fabricate accuracy numbers or claim impossible AI infallibility.')}
          </p>
        </div>

        {/* Card 3: Multilingual & Accessible */}
        <div className="card" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 24
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--accent-tint)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <Globe size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
            {t('about.vernacular_title', 'Native Vernacular Support')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('about.vernacular_desc', 'Designed with native typography and human-reviewed explanations in Kannada (ಕನ್ನಡ), Hindi (हिंदी), and English. Complete with full audio playback and voice dictation for senior citizens.')}
          </p>
        </div>
      </div>

      {/* Limitations & Verification Disclaimer */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '28px 24px',
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center'
      }}>
        <div style={{ flexShrink: 0, width: 140 }}>
          <SafeStepsSvg />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warn)', marginBottom: 8, fontWeight: 600 }}>
            <AlertTriangle size={20} />
            {t('about.limitations_heading', 'Guidance Only - Not a Legal Guarantee')}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
            {t('about.limitations_body', 'Suraksha Shield provides educational indicators and automated heuristic analysis. No tool can detect 100% of social-engineering attacks. A "Low Risk" result is not a guarantee of legitimacy. Always verify transactions directly through your bank or the official merchant app.')}
          </p>
        </div>
      </div>

      {/* Official Government Reporting Resources */}
      <div style={{
        background: 'var(--bg-card-raised)',
        border: '1px solid var(--accent)',
        borderRadius: 20,
        padding: '32px 24px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
          {t('about.report_heading', 'How to Report Real Financial Fraud in India')}
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: 640, margin: '0 auto 24px', fontSize: '1rem', lineHeight: 1.6 }}>
          {t('about.report_desc', 'If you have been defrauded or suspect an unauthorized debit, contact your bank immediately and register a complaint with Indian authorities:')}
        </p>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <a
            href="tel:1930"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              padding: '12px 24px',
              borderRadius: 30,
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none'
            }}
          >
            <PhoneCall size={20} />
            {t('about.call_1930', 'Call 1930 (Cyber Crime Helpline)')}
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'transparent',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '12px 24px',
              borderRadius: 30,
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none'
            }}
          >
            <Globe size={20} />
            cybercrime.gov.in
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
