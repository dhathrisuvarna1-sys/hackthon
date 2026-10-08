import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SuspiciousLinkSvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="suspiciousLinkTitle suspiciousLinkDesc"
    >
      <title id="suspiciousLinkTitle">{t('illustrations.suspiciousLink.title')}</title>
      <desc id="suspiciousLinkDesc">{t('illustrations.suspiciousLink.desc')}</desc>
      
      {/* Search Bar / Browser UI */}
      <rect x="10" y="30" width="100" height="25" rx="12" fill="#FFFFFF" stroke="#172B3A" strokeWidth="2"/>
      <text x="20" y="47" fill="#172B3A" fontSize="12" fontFamily="sans-serif">http://</text>
      <text x="58" y="47" fill="#C43D3D" fontSize="12" fontFamily="sans-serif" fontWeight="bold">b4nk</text>
      <text x="88" y="47" fill="#172B3A" fontSize="12" fontFamily="sans-serif">.co</text>
      
      {/* Magnifying Glass */}
      <circle cx="70" cy="42" r="16" fill="#E8F4F1" fillOpacity="0.8" stroke="#116466" strokeWidth="3"/>
      <line x1="82" y1="54" x2="95" y2="67" stroke="#116466" strokeWidth="4" strokeLinecap="round"/>
      
      {/* Warning icon */}
      <path d="M 65 37 l 10 0 l -5 8 z" fill="#C43D3D"/>
    </svg>
  );
}
