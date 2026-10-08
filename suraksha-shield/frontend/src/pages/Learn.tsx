import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, CheckCircle2 } from 'lucide-react';
import FakeKycSvg from '../components/illustrations/FakeKycSvg';
import OtpTheftSvg from '../components/illustrations/OtpTheftSvg';
import LotterySvg from '../components/illustrations/LotterySvg';
import UpiCollectSvg from '../components/illustrations/UpiCollectSvg';
import RemoteAccessSvg from '../components/illustrations/RemoteAccessSvg';
import FakeSupportSvg from '../components/illustrations/FakeSupportSvg';
import SuspiciousLinkSvg from '../components/illustrations/SuspiciousLinkSvg';
import SafeStepsSvg from '../components/illustrations/SafeStepsSvg';
import { AudioPlayerContext } from '../components/SpeechPlayer';

const getIllustration = (id: string) => {
  const props = { className: "illustration-svg" };
  switch(id) {
    case 'fake-kyc': return <FakeKycSvg {...props} />;
    case 'prize-lottery': return <LotterySvg {...props} />;
    case 'upi-collect': return <UpiCollectSvg {...props} />;
    case 'fake-bank': return <FakeSupportSvg {...props} />;
    case 'otp-theft': return <OtpTheftSvg {...props} />;
    case 'account-freeze': return <SuspiciousLinkSvg {...props} />;
    case 'remote-access': return <RemoteAccessSvg {...props} />;
    default: return <SafeStepsSvg {...props} />;
  }
};

const TOPICS = [
  { id: 'fake-kyc', title: 'Fake KYC Verification', desc: 'Scammers claim your account will be blocked unless you verify your KYC by clicking a link.' },
  { id: 'prize-lottery', title: 'Prize & Lottery Scams', desc: 'You receive a message that you won a lottery. They ask for a small fee to release the funds.' },
  { id: 'upi-collect', title: 'UPI Collect Requests', desc: 'Scammers send a UPI Collect request pretending it is a refund. Approving it deducts money.' },
  { id: 'fake-bank', title: 'Fake Bank Officials', desc: 'Someone calls claiming to be from your bank and asks for your OTP to stop a fraudulent transaction.' },
  { id: 'otp-theft', title: 'OTP/PIN Theft', desc: 'Never share your OTP or UPI PIN. A PIN is only used to send money, never to receive.' },
  { id: 'account-freeze', title: 'Account Freeze Warnings', desc: 'Scare tactics stating your bank or phone number will be disconnected.' },
  { id: 'remote-access', title: 'Remote Access Apps', desc: 'Scammers ask you to install screen-sharing apps to "help" you, but they steal your data.' },
  { id: 'loan-job', title: 'Instant Loan & Job Scams', desc: 'Pre-approved instant loans or high-paying simple online jobs that demand APK installation or security deposit.' }
];

export default function Learn() {
  const [activeHotspot, setActiveHotspot] = React.useState<number | null>(null);
  const speech = React.useContext(AudioPlayerContext);

  const HOTSPOTS = [
    { id: 1, top: '20%', left: '50%', explanation: 'Urgency: Scammers use threats like "blocked today" to make you panic and act without thinking.' },
    { id: 2, top: '50%', left: '40%', explanation: 'Suspicious Link: The link verify-kyc-example.test is not a real bank website.' },
    { id: 3, top: '70%', left: '70%', explanation: 'Asking for Details: They direct you to enter your OTP or PIN.' }
  ];

  return (
    <div className="container" style={{ padding: '40px 16px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      
      {/* Right Sidebar for Desktop (Filters) */}
      <div style={{ flex: '0 0 250px', order: 2 }}>
        <div style={{ position: 'sticky', top: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text)' }}>Topics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TOPICS.map(topic => (
              <a key={topic.id} href={`#${topic.id}`} style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)',
                textDecoration: 'none', color: 'var(--text)' 
              }}>
                <div style={{ color: 'var(--accent)' }}><CheckCircle2 size={16} /></div>
                <span style={{ fontSize: '0.875rem' }}>{topic.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: '1 1 500px', order: 1 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: 'var(--text)' }}>Learn to Spot Scams</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1.125rem' }}>
          Education is your best defense. Read about common digital payment scams in India.
        </p>

        {/* Spot the Scam Interactive Guide */}
        <section className="card" style={{ marginBottom: '48px' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Spot the Scam</h2>
          <p style={{ color: 'var(--text-muted)' }}>Click the numbered hotspots on this example SMS to learn the red flags.</p>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '24px' }}>
            <div style={{ 
              position: 'relative', 
              background: 'var(--bg-card-raised)', 
              padding: '24px', 
              borderRadius: '16px 16px 16px 4px', 
              border: '1px solid var(--border)',
              maxWidth: '350px'
            }}>
              <p style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text)' }}>
                Dear customer, your bank account will be <strong style={{color: 'var(--scam)'}}>blocked today</strong>. Complete KYC immediately at <strong style={{color: 'var(--scam)'}}>verify-kyc-example.test</strong> and do not share your OTP.
              </p>
              {HOTSPOTS.map(spot => (
                <button 
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot.id)}
                  style={{
                    position: 'absolute',
                    top: spot.top,
                    left: spot.left,
                    background: 'var(--accent)',
                    color: 'var(--on-accent)',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translate(-50%, -50%)',
                    border: activeHotspot === spot.id ? '2px solid white' : 'none'
                  }}
                >
                  {spot.id}
                </button>
              ))}
            </div>
            
            <div style={{ flex: 1, minWidth: '250px' }}>
              {activeHotspot ? (
                <div style={{ background: 'var(--bg-card-raised)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h3 style={{ marginTop: 0, color: 'var(--text)', marginBottom: '8px' }}>Red Flag {activeHotspot}</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{HOTSPOTS.find(h => h.id === activeHotspot)?.explanation}</p>
                  <button 
                    onClick={() => speech?.speak(HOTSPOTS.find(h => h.id === activeHotspot)?.explanation || '')}
                    className="btn-outline" 
                    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                  >
                    <Volume2 size={16} /> Listen to explanation
                  </button>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', padding: '24px', border: '1px dashed var(--border)', borderRadius: '12px', textAlign: 'center' }}>
                  Tap a number to see why this message is dangerous.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Topics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {TOPICS.map(topic => (
            <div key={topic.id} id={topic.id} className="card" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                {getIllustration(topic.id)}
              </div>
              <div>
                <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.25rem', color: 'var(--text)' }}>{topic.title}</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
