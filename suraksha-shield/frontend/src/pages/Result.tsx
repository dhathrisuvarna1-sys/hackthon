import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResult } from '../services/api';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Volume2, Copy, Bookmark, 
  Download, CheckCircle2, ArrowLeft, RefreshCw, Check
} from 'lucide-react';
import { AudioPlayerContext } from '../components/SpeechPlayer';
import { useTranslation } from 'react-i18next';

// Vernacular action mapping dictionary
const ACTION_MAP: Record<string, Record<string, string>> = {
  do_not_share_otp: {
    en: "Never share your OTP, UPI PIN, or banking passwords with anyone.",
    kn: "ನಿಮ್ಮ ಒಟಿಪಿ, ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಬ್ಯಾಂಕಿಂಗ್ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
    hi: "अपना ओटीपी, यूपीआई पिन या बैंकिंग पासवर्ड कभी किसी के साथ साझा न करें।"
  },
  do_not_click_link: {
    en: "Do not tap on the link or download any APK attachments in the message.",
    kn: "ಸಂದೇಶದಲ್ಲಿರುವ ಯಾವುದೇ ಲಿಂಕ್ ಒತ್ತಬೇಡಿ ಅಥವಾ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಡಿ.",
    hi: "संदेश में दिए गए लिंक पर क्लिक न करें और कोई फ़ाइल डाउनलोड न करें।"
  },
  block_sender: {
    en: "Block this sender number or UPI ID immediately on your phone.",
    kn: "ಕಳುಹಿಸಿದವರ ಸಂಖ್ಯೆ ಅಥವಾ ಯುಪಿಐ ಐಡಿಯನ್ನು ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ ತಕ್ಷಣ ನಿರ್ಬಂಧಿಸಿ (Block).",
    hi: "भेजने वाले का नंबर या यूपीआई आईडी अपने फ़ोन पर तुरंत ब्लॉक करें।"
  },
  verify_official_bank: {
    en: "Verify directly via your bank's official app or the phone number printed on your debit card.",
    kn: "ನಿಮ್ಮ ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಆ್ಯಪ್ ತೆರೆದು ಅಥವಾ ಡೆಬಿಟ್ ಕಾರ್ಡ್ ಮೇಲಿರುವ ಅಧಿಕೃತ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    hi: "अपने बैंक के आधिकारिक ऐप से या डेबिट कार्ड पर लिखे नंबर पर कॉल करके पुष्टि करें।"
  },
  report_1930: {
    en: "If money was lost or to report cyber fraud, immediately dial 1930 or visit cybercrime.gov.in.",
    kn: "ಹಣ ಕಳೆದುಕೊಂಡಿದ್ದರೆ ತಕ್ಷಣ ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್ ಸಹಾಯವಾಣಿ 1930 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ cybercrime.gov.in ಗೆ ಭೇಟಿ ನೀಡಿ.",
    hi: "यदि पैसे कटे हों तो तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें।"
  },
  verify_independently: {
    en: "Low risk indicators detected: No obvious scam signs found. Always verify independently with the sender before transferring money.",
    kn: "ಕಡಿಮೆ ಅಪಾಯದ ಸೂಚನೆಗಳು: ಯಾವುದೇ ಸ್ಪಷ್ಟ ವಂಚನೆಯ ಲಕ್ಷಣಗಳಿಲ್ಲ. ಹಣ ವರ್ಗಾಯಿಸುವ ಮುನ್ನ ಕಳುಹಿಸಿದವರನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    hi: "कम जोखिम के संकेत: कोई स्पष्ट धोखाधड़ी नहीं मिली। पैसे भेजने से पहले स्वतंत्र रूप से पुष्टि अवश्य करें।"
  },
  decline_collect_request: {
    en: "Decline the collect request. Approving it will deduct money from your account instantly.",
    kn: "ಕಲೆಕ್ಟ್ ವಿನಂತಿಯನ್ನು ತಿರಸ್ಕರಿಸಿ. ಅನುಮೋದಿಸಿದರೆ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ತಕ್ಷಣ ಕಡಿತವಾಗುತ್ತದೆ.",
    hi: "कलेक्ट रिक्वेस्ट को अस्वीकार करें। इसे स्वीकार करने से तुरंत आपके खाते से पैसे कट जाएंगे।"
  },
  never_enter_pin_to_receive: {
    en: "Remember: Entering a UPI PIN sends money OUT. You NEVER enter a PIN to receive payment.",
    kn: "ನೆನಪಿಡಿ: ಯುಪಿಐ ಪಿನ್ ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ. ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಪಿನ್ ಅಗತ್ಯವಿಲ್ಲ.",
    hi: "याद रखें: यूपीआई पिन पैसे भेजने के लिए होता है। पैसे प्राप्त करने के लिए कभी पिन नहीं डालना होता।"
  },
  never_share_pin: {
    en: "Keep your UPI PIN and credentials strictly private.",
    kn: "ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್ ವಿವರಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಗೌಪ್ಯವಾಗಿಡಿ.",
    hi: "अपना यूपीआई पिन और पासवर्ड पूरी तरह गोपनीय रखें।"
  },
  check_official_app: {
    en: "Check status directly in your official banking application.",
    kn: "ಸ್ಥಿತಿಯನ್ನು ನೇರವಾಗಿ ನಿಮ್ಮ ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಆ್ಯಪ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    hi: "अपने आधिकारिक बैंकिंग ऐप में जाकर स्थिति की जांच करें।"
  }
};

const REASON_MAP: Record<string, Record<string, string>> = {
  urgency: {
    en: "Creates artificial panic with imminent block or cancellation deadlines.",
    kn: "ಖಾತೆ ರದ್ದಾಗುತ್ತದೆ ಎಂದು ನಕಲಿ ತುರ್ತು ಎಚ್ಚರಿಕೆಯನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ.",
    hi: "खाता बंद होने की झूठी धमकी देकर तुरंत कार्रवाई का दबाव बनाता है।"
  },
  kyc_impersonation: {
    en: "Demands immediate KYC, PAN, or Aadhaar updates through unverified links.",
    kn: "ಅನಧಿಕೃತ ಲಿಂಕ್ ಮೂಲಕ ಕೆವೈಸಿ ಅಥವಾ ಪ್ಯಾನ್ ನವೀಕರಿಸಲು ಒತ್ತಾಯಿಸುತ್ತದೆ.",
    hi: "अनाधिकृत लिंक के माध्यम से केवाईसी या पैन अपडेट करने की मांग करता है।"
  },
  credential_theft: {
    en: "Attempts to solicit your secret OTP, UPI PIN, or password.",
    kn: "ನಿಮ್ಮ ರಹಸ್ಯ ಒಟಿಪಿ, ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಕದಿಯಲು ಯತ್ನಿಸುತ್ತದೆ.",
    hi: "आपका गोपनीय ओटीपी, यूपीआई पिन या पासवर्ड हासिल करने की कोशिश करता है।"
  },
  suspicious_link: {
    en: "Contains deceptive short links, APK downloads, or unofficial domain names.",
    kn: "ಅಪಾಯಕಾರಿ ಶಾರ್ಟ್ ಲಿಂಕ್ ಅಥವಾ ನಕಲಿ ವೆಬ್ ವಿಳಾಸವನ್ನು ಒಳಗೊಂಡಿದೆ.",
    hi: "संदिग्ध छोटा लिंक या बैंक जैसा दिखने वाला फर्जी डोमेन शामिल है।"
  },
  unverified_link: {
    en: "Directs recipient to an unverified external website.",
    kn: "ದೃಢೀಕರಿಸದ ಹೊರಗಿನ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಕರೆದೊಯ್ಯುತ್ತದೆ.",
    hi: "एक असत्यापित बाहरी वेबसाइट पर ले जाता है।"
  },
  lottery_fraud: {
    en: "Lures recipient with fake lottery jackpots, KBC awards, or prizes.",
    kn: "ಸುಳ್ಳು ಲಾಟರಿ ಗೆಲುವು ಅಥವಾ ನಕಲಿ ಬಹುಮಾನದ ಆಮಿಷ ಒಡ್ಡುತ್ತದೆ.",
    hi: "फर्जी लॉटरी, इनाम या रिवॉर्ड पॉइंट्स का लालच देता है।"
  },
  refund_scam: {
    en: "Deceptively claims you must approve a transaction or scan QR to receive money.",
    kn: "ರಿಫಂಡ್ ಅಥವಾ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ನೀಡುವ ನೆಪದಲ್ಲಿ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತಗೊಳಿಸಲು ಯತ್ನಿಸುತ್ತದೆ.",
    hi: "रिफंड या कैशबैक देने के बहाने आपके खाते से पैसे काटने की कोशिश करता है।"
  },
  authority_impersonation: {
    en: "Impersonates an electricity board, telecom official, police, or bank manager.",
    kn: "ವಿದ್ಯುತ್ ಮಂಡಳಿ, ಟೆಲಿಕಾಂ, ಪೊಲೀಸ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಯಂತೆ ಸೋಗು ಹಾಕುತ್ತದೆ.",
    hi: "बिजली विभाग, टेलीकॉम, पुलिस या बैंक अधिकारी का झूठा रूप धारण करता है।"
  },
  payment_pressure: {
    en: "Demands urgent payment under threat of immediate legal penalty or arrest.",
    kn: "ಕಾನೂನು ಕ್ರಮ ಅಥವಾ ದಂಡದ ಬೆದರಿಕೆ ಹಾಕಿ ತಕ್ಷಣ ಹಣ ನೀಡುವಂತೆ ಒತ್ತಡ ಹೇರುತ್ತದೆ.",
    hi: "कानूनी कार्रवाई या जुर्माने का डर दिखाकर तुरंत भुगतान का दबाव बनाता है।"
  },
  remote_access_fraud: {
    en: "Directs installation of screen-sharing applications like AnyDesk or TeamViewer.",
    kn: "ಎನಿಡೆಸ್ಕ್ ಅಥವಾ ಟೀಮ್‌ವೀವರ್‌ನಂತಹ ಸ್ಕ್ರೀನ್‌ಶೇರಿಂಗ್ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸೂಚಿಸುತ್ತದೆ.",
    hi: "एनीडेस्क या टीमव्यूअर जैसी स्क्रीन शेयरिंग ऐप डाउनलोड करने के लिए कहता है।"
  },
  collect_reverse_deception: {
    en: "Disguises a debit Collect Request as a refund or reward deposit.",
    kn: "ಹಣ ಪಡೆಯುವ ಬದಲು ಹಣ ಕಳುಹಿಸುವ ಕಲೆಕ್ಟ್ ವಿನಂತಿಯನ್ನು ಮರೆಮಾಚಿ ಕಳುಹಿಸಲಾಗಿದೆ.",
    hi: "पैसे मिलने का झांसा देकर पैसे कटने वाली कलेक्ट रिक्वेस्ट भेजी गई है।"
  }
};

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [consentSave, setConsentSave] = useState(false);
  const speech = React.useContext(AudioPlayerContext);
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language === 'kn' ? 'kn' : i18n.language === 'hi' ? 'hi' : 'en';

  useEffect(() => {
    if (id) {
      getResult(id).then(res => {
        setResult(res);
        setLoading(false);
        if (localStorage.getItem('audio-guide') === 'true' && speech) {
          playAudioSummary(res);
        }
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  const playAudioSummary = (res = result) => {
    if (!res || !speech) return;
    const isScam = res.status === 'SCAM';
    const isSafe = res.status === 'SAFE';

    let headline = isScam 
      ? (currentLang === 'kn' ? 'ಎಚ್ಚರಿಕೆ! ಇದು ಮೋಸದ ಸಂದೇಶವಾಗಿದೆ. ಮುಂದುವರಿಯಬೇಡಿ.' : currentLang === 'hi' ? 'सावधान! यह फर्जी संदेश है। कोई कार्रवाई न करें।' : 'Warning! This is likely a scam. Do not proceed.')
      : isSafe
      ? (currentLang === 'kn' ? 'ಕಡಿಮೆ ಅಪಾಯದ ಸೂಚನೆಗಳು ಪತ್ತೆಯಾಗಿವೆ. ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಿ.' : currentLang === 'hi' ? 'कम जोखिम के संकेत। स्वतंत्र रूप से जांच करें।' : 'Low risk indicators detected. No obvious scam signs found. Verify independently.')
      : (currentLang === 'kn' ? 'ಜಾಗರೂಕರಾಗಿರಿ. ಈ ಸಂದೇಶದಲ್ಲಿ ಸಂಶಯಾಸ್ಪದ ಸೂಚನೆಗಳಿವೆ.' : currentLang === 'hi' ? 'सावधानी बरतें। इसमें कुछ संदेहास्पद संकेत पाए गए हैं।' : 'Be careful with this message. Warning signs found.');

    let actionsText = '';
    if (res.recommended_action_codes && res.recommended_action_codes.length > 0) {
      actionsText = ' ' + (res.recommended_action_codes.map((code: string) => ACTION_MAP[code]?.[currentLang] || '').join('. '));
    }

    speech.speak(headline + ' ' + actionsText);
  };

  const handleCopyExplanation = () => {
    if (!result) return;
    const textToCopy = `Suraksha Shield Scan Analysis:
Status: ${result.status} (Risk: ${result.risk_level})
Method: ${result.analysis_method}
Signals Found: ${result.evidence.length}
National Cyber Helpline: 1930 / cybercrime.gov.in`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    if (!result || !consentSave) return;
    const historyItem = {
      id: result.id,
      timestamp: new Date().toISOString(),
      type: 'Message Scan',
      status: result.status,
      risk_level: result.risk_level,
      snippet: result.original_text?.slice(0, 80) || 'Scan result'
    };
    const existing = JSON.parse(localStorage.getItem('suraksha-history') || '[]');
    localStorage.setItem('suraksha-history', JSON.stringify([historyItem, ...existing.slice(0, 19)]));
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Analyzing message indicators...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--warn)' }}>Analysis Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>Could not retrieve this scan record.</p>
        <Link to="/scan/message" className="btn-primary" style={{ marginTop: 16 }}>Start New Scan</Link>
      </div>
    );
  }

  const isSafe = result.status === 'SAFE';
  const isScam = result.status === 'SCAM';
  const statusColor = isScam ? 'var(--scam)' : isSafe ? 'var(--safe)' : 'var(--warn)';
  const StatusIcon = isScam ? AlertTriangle : isSafe ? ShieldCheck : ShieldAlert;

  // Render Highlighted Text
  let highlightedText = result.original_text || '';
  if (result.evidence && result.evidence.length > 0) {
    const sortedEvidence = [...result.evidence].sort((a: any, b: any) => (b.matched_text?.length || 0) - (a.matched_text?.length || 0));
    sortedEvidence.forEach((e: any) => {
      if (e.matched_text && highlightedText.includes(e.matched_text)) {
        const bg = isScam ? 'rgba(255, 92, 92, 0.25)' : 'rgba(245, 177, 61, 0.25)';
        highlightedText = highlightedText.split(e.matched_text).join(
          `<mark style="background: ${bg}; color: ${statusColor}; padding: 2px 4px; border-radius: 4px; font-weight: 600;">${e.matched_text}</mark>`
        );
      }
    });
  }

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Top Breadcrumb & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Link to="/scan/message" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Scan another message
        </Link>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Analysis Method: <strong style={{ color: 'var(--text)' }}>{result.analysis_method}</strong>
        </span>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* Left Column (60%): Status, Message Text, Signal Breakdown */}
        <div style={{ flex: '1 1 580px' }}>
          
          {/* Status Card */}
          <div style={{ 
            background: 'var(--bg-card)', 
            borderLeft: `6px solid ${statusColor}`,
            borderTop: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '24px',
            display: 'flex',
            gap: '18px',
            alignItems: 'flex-start'
          }} role="status" aria-live="polite">
            <div style={{ color: statusColor, marginTop: '2px' }}>
              <StatusIcon size={36} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{
                  background: statusColor,
                  color: '#0A0F16',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase'
                }}>
                  {result.risk_level} RISK
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Language: <strong>{result.detected_language?.toUpperCase() || 'EN'}</strong>
                </span>
              </div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: 'var(--text)' }}>
                {isScam 
                  ? 'Likely scam. Do not proceed.' 
                  : isSafe 
                  ? 'Low risk indicators detected: No obvious scam signs.' 
                  : 'Be careful with this message.'}
              </h1>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {isScam
                  ? 'This message contains high-risk indicators associated with financial fraud, deceptive links, or credential theft.'
                  : isSafe
                  ? 'No recognized fraud triggers detected in this text. However, "Safe" is never a guarantee. Always verify independently.'
                  : 'We found warning signs that require independent verification before taking any action.'}
              </p>
            </div>
          </div>

          {/* Original Analyzed Message with Evidence Offsets Highlighted */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--text)' }}>
              Analyzed Text & Evidence Offsets
            </h2>
            <div 
              style={{ 
                fontSize: '1.15rem', 
                lineHeight: 1.7, 
                color: 'var(--text)',
                background: 'var(--bg-card-raised)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                whiteSpace: 'pre-wrap'
              }}
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>

          {/* Why this result? (Real evidence reasons only) */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text)' }}>
              Why this result?
            </h2>
            {result.evidence && result.evidence.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {result.evidence.map((ev: any, idx: number) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'flex-start',
                    background: 'var(--bg-card-raised)',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ color: statusColor, marginTop: 2 }}>
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem', marginBottom: 2 }}>
                        {REASON_MAP[ev.code]?.[currentLang] || ev.category || ev.code}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Matched text: <code style={{ color: statusColor }}>"{ev.matched_text}"</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                No active scam keywords, urgent deadlines, or credential theft patterns were detected in this message.
              </p>
            )}
          </div>

          {/* Real Signal Strength Breakdown (Derived ONLY from real detected categories) */}
          {result.signals && result.signals.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '14px', color: 'var(--text)' }}>
                Scam Signal Breakdown
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {result.signals.map((sig: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text)', width: 160 }}>{sig.category}</span>
                    <div style={{ flex: 1, background: 'var(--bg-card-raised)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(100, sig.score * 100)}%`, 
                        background: sig.level === 'High' ? 'var(--scam)' : 'var(--warn)',
                        borderRadius: 4
                      }} />
                    </div>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: sig.level === 'High' ? 'var(--scam)' : 'var(--warn)',
                      width: 60,
                      textAlign: 'right'
                    }}>
                      {sig.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Sidebar (40%): Action checklist, Listen, Save */}
        <div style={{ flex: '1 1 340px', maxWidth: '420px' }}>
          <div className="card" style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* What should you do? */}
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '14px', color: 'var(--text)' }}>
                What should you do?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {result.recommended_action_codes.map((actionCode: string, i: number) => {
                  const actionText = ACTION_MAP[actionCode]?.[currentLang] || actionCode.replace(/_/g, ' ');
                  return (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5 }}>
                        {actionText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official reporting hotline box */}
            <div style={{
              background: 'var(--bg-card-raised)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--warn)', fontSize: '0.9rem', marginBottom: 4 }}>
                Victim of a scam?
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Call National Cyber Helpline <strong style={{ color: 'var(--accent)' }}>1930</strong> immediately. Freeze your bank account by dialing the customer care on your debit card.
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => playAudioSummary()} 
                className="btn-primary" 
                style={{ width: '100%', padding: '12px' }}
              >
                <Volume2 size={18} /> Listen to explanation
              </button>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleCopyExplanation}
                  className="btn-outline" 
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }} 
                  aria-label="Copy explanation"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span style={{ marginLeft: 6 }}>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                
                <button 
                  onClick={() => window.print()}
                  className="btn-outline" 
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }} 
                  aria-label="Download or print report"
                >
                  <Download size={16} />
                  <span style={{ marginLeft: 6 }}>Report</span>
                </button>
              </div>

              {/* Consent-gated save to local history */}
              <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={consentSave} 
                    onChange={(e) => setConsentSave(e.target.checked)} 
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span>I consent to saving this scan locally in my browser history.</span>
                </label>
                <button
                  disabled={!consentSave || saved}
                  onClick={handleSaveToHistory}
                  style={{
                    width: '100%',
                    marginTop: 8,
                    padding: '8px',
                    borderRadius: 8,
                    background: consentSave && !saved ? 'var(--bg-card-raised)' : 'transparent',
                    color: saved ? 'var(--safe)' : consentSave ? 'var(--text)' : 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    cursor: consentSave && !saved ? 'pointer' : 'default'
                  }}
                >
                  <Bookmark size={15} />
                  <span>{saved ? 'Saved to local history' : 'Save to History'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
