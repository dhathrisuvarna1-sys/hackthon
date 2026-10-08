import React, { useState, useRef, useEffect } from 'react';
import { Shield, Volume2, VolumeX, ChevronDown, Sun, Moon, Menu, X, MessageSquareText, ImageUp, IndianRupee } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [audioGuide, setAudioGuide] = useState(localStorage.getItem('audio-guide') === 'true');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const [scanDropdownOpen, setScanDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setScanDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setScanDropdownOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleTextSize = () => {
    const isLarge = document.documentElement.getAttribute('data-large-text') === 'true';
    document.documentElement.setAttribute('data-large-text', isLarge ? 'false' : 'true');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleAudioGuide = () => {
    const newState = !audioGuide;
    setAudioGuide(newState);
    localStorage.setItem('audio-guide', newState.toString());
  };

  const isScanActive = location.pathname.startsWith('/scan');

  return (
    <>
      <header style={{ 
        borderBottom: '1px solid var(--border)', 
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-page)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Left: Brand */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', 
            background: 'var(--accent-tint)',
            border: '1px solid var(--accent)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <Shield size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Suraksha Shield
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Vernacular Fraud Shield
            </span>
          </div>
        </Link>

        {/* Center: Nav (Desktop) */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{
              textDecoration: 'none',
              color: location.pathname === '/' ? 'var(--accent)' : 'var(--text)',
              fontWeight: 600,
              borderBottom: location.pathname === '/' ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            {t('nav.home', 'Home')}
          </Link>

          {/* Scan Dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setScanDropdownOpen(!scanDropdownOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isScanActive ? 'var(--accent)' : 'var(--text)',
                fontWeight: 600,
                borderBottom: isScanActive ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
              aria-expanded={scanDropdownOpen}
            >
              {t('nav.scan', 'Scan')}
              <ChevronDown size={14} style={{ transform: scanDropdownOpen ? 'rotate(180deg)' : 'none', transition: '150ms' }} />
            </button>

            {scanDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                background: 'var(--bg-card-raised)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '8px',
                minWidth: '220px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <Link
                  to="/scan/message"
                  onClick={() => setScanDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-tint)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MessageSquareText size={16} color="var(--accent)" />
                  <span>Check SMS / Message</span>
                </Link>

                <Link
                  to="/scan/image"
                  onClick={() => setScanDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-tint)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <ImageUp size={16} color="var(--accent)" />
                  <span>Scan Screenshot (OCR)</span>
                </Link>

                <Link
                  to="/scan/upi"
                  onClick={() => setScanDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-tint)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <IndianRupee size={16} color="var(--accent)" />
                  <span>Check UPI Request</span>
                </Link>
              </div>
            )}
          </div>

          <Link 
            to="/learn" 
            style={{
              textDecoration: 'none',
              color: location.pathname === '/learn' ? 'var(--accent)' : 'var(--text)',
              fontWeight: 600,
              borderBottom: location.pathname === '/learn' ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            {t('nav.learn', 'Learn')}
          </Link>

          <Link 
            to="/history" 
            style={{
              textDecoration: 'none',
              color: location.pathname === '/history' ? 'var(--accent)' : 'var(--text)',
              fontWeight: 600,
              borderBottom: location.pathname === '/history' ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            {t('nav.history', 'History')}
          </Link>

          <Link 
            to="/about" 
            style={{
              textDecoration: 'none',
              color: location.pathname === '/about' ? 'var(--accent)' : 'var(--text)',
              fontWeight: 600,
              borderBottom: location.pathname === '/about' ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '4px'
            }}
          >
            {t('nav.about', 'About')}
          </Link>
        </nav>

        {/* Right: Controls & CTAs */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Segmented Language Selector */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-card-raised)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '2px 4px',
            fontSize: '0.85rem'
          }}>
            <button
              onClick={() => changeLanguage('en')}
              style={{
                background: i18n.language === 'en' ? 'var(--accent)' : 'transparent',
                color: i18n.language === 'en' ? 'var(--on-accent)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '18px',
                padding: '4px 8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('kn')}
              style={{
                background: i18n.language === 'kn' ? 'var(--accent)' : 'transparent',
                color: i18n.language === 'kn' ? 'var(--on-accent)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '18px',
                padding: '4px 8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              style={{
                background: i18n.language === 'hi' ? 'var(--accent)' : 'transparent',
                color: i18n.language === 'hi' ? 'var(--on-accent)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '18px',
                padding: '4px 8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              हिंदी
            </button>
          </div>
          
          {/* Audio Guide Toggle */}
          <button 
            onClick={toggleAudioGuide} 
            aria-label={audioGuide ? "Disable audio guide" : "Enable audio guide"}
            title={audioGuide ? "Audio guide is ON" : "Audio guide is OFF"}
            style={{
              background: audioGuide ? 'var(--accent-tint)' : 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: audioGuide ? 'var(--accent)' : 'var(--text-muted)'
            }}
          >
            {audioGuide ? <Volume2 size={18} color="var(--accent)" /> : <VolumeX size={18} />}
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            aria-label="Toggle light or dark theme"
            title="Toggle theme"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {/* Large text toggle */}
          <button 
            onClick={toggleTextSize} 
            aria-label="Toggle large text mode"
            title="Toggle font scaling"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}
          >
            Aa
          </button>
          
          {/* CTA Pill button (Desktop) */}
          <Link 
            to="/scan/message" 
            className="btn-primary desktop-nav" 
            style={{ 
              padding: '8px 18px', 
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: '30px',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            Check a Message
          </Link>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only"
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--bg-page)',
          zIndex: 40,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          borderTop: '1px solid var(--border)'
        }}>
          <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
            {t('nav.home', 'Home')}
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '12px', borderLeft: '2px solid var(--accent)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>SCAN TOOLS</span>
            <Link to="/scan/message" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquareText size={16} color="var(--accent)" /> Check SMS / Message
            </Link>
            <Link to="/scan/image" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ImageUp size={16} color="var(--accent)" /> Scan Screenshot
            </Link>
            <Link to="/scan/upi" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IndianRupee size={16} color="var(--accent)" /> Check UPI Request
            </Link>
          </div>
          <Link to="/learn" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
            {t('nav.learn', 'Learn Center')}
          </Link>
          <Link to="/history" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
            {t('nav.history', 'History')}
          </Link>
          <Link to="/about" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
            {t('nav.about', 'About & Privacy')}
          </Link>
        </div>
      )}
    </>
  );
}
