import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FakeKycSvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="fakeKycTitle fakeKycDesc"
    >
      <title id="fakeKycTitle">{t('illustrations.fakeKyc.title')}</title>
      <desc id="fakeKycDesc">{t('illustrations.fakeKyc.desc')}</desc>
      
      {/* Phone Body */}
      <rect x="35" y="10" width="50" height="100" rx="6" fill="#172B3A"/>
      {/* Screen */}
      <rect x="39" y="14" width="42" height="92" rx="4" fill="#E8F4F1"/>
      
      {/* SMS Bubble */}
      <path d="M45 30 h 30 v 20 h -25 l -5 5 v -5 z" fill="#FFFFFF" stroke="#116466" strokeWidth="2"/>
      <line x1="50" y1="36" x2="70" y2="36" stroke="#172B3A" strokeWidth="2" strokeLinecap="round"/>
      <line x1="50" y1="42" x2="65" y2="42" stroke="#172B3A" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Red Warning Mark */}
      <circle cx="85" cy="70" r="14" fill="#FFFFFF" stroke="#C43D3D" strokeWidth="2"/>
      <line x1="85" y1="63" x2="85" y2="72" stroke="#C43D3D" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="85" cy="77" r="1.5" fill="#C43D3D"/>
    </svg>
  );
}
