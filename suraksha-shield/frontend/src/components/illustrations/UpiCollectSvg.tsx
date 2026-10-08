import React from 'react';
import { useTranslation } from 'react-i18next';

export default function UpiCollectSvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="upiCollectTitle upiCollectDesc"
    >
      <title id="upiCollectTitle">{t('illustrations.upiCollect.title')}</title>
      <desc id="upiCollectDesc">{t('illustrations.upiCollect.desc')}</desc>
      
      {/* Two Phones */}
      <rect x="15" y="30" width="35" height="60" rx="4" fill="#E8F4F1" stroke="#172B3A" strokeWidth="3"/>
      <rect x="70" y="30" width="35" height="60" rx="4" fill="#FFFFFF" stroke="#116466" strokeWidth="3"/>
      
      {/* Arrows (Money going out) */}
      <path d="M 55 50 h 10" stroke="#C43D3D" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="65,46 65,54 73,50" fill="#C43D3D"/>
      
      {/* Label "You Pay" */}
      <rect x="42" y="60" width="40" height="16" rx="8" fill="#C43D3D"/>
      <text x="47" y="71" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">YOU PAY</text>
    </svg>
  );
}
