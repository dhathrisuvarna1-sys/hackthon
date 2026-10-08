import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FakeSupportSvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="fakeSupportTitle fakeSupportDesc"
    >
      <title id="fakeSupportTitle">{t('illustrations.fakeSupport.title')}</title>
      <desc id="fakeSupportDesc">{t('illustrations.fakeSupport.desc')}</desc>
      
      {/* Bank Building Background */}
      <rect x="20" y="50" width="80" height="50" fill="#E8F4F1"/>
      <polygon points="10,50 60,25 110,50" fill="#116466"/>
      <rect x="30" y="50" width="10" height="40" fill="#172B3A"/>
      <rect x="55" y="50" width="10" height="40" fill="#172B3A"/>
      <rect x="80" y="50" width="10" height="40" fill="#172B3A"/>
      
      {/* Headset (Fake Support) overlapping */}
      <path d="M 40 70 a 20 20 0 0 1 40 0" stroke="#C43D3D" strokeWidth="4" fill="none"/>
      <rect x="35" y="65" width="10" height="20" rx="5" fill="#C43D3D"/>
      <rect x="75" y="65" width="10" height="20" rx="5" fill="#C43D3D"/>
      <path d="M 40 80 Q 50 90 60 85" stroke="#C43D3D" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="62" cy="84" r="3" fill="#172B3A"/>
    </svg>
  );
}
