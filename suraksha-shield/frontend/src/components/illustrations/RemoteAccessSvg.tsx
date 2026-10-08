import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RemoteAccessSvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="remoteAccessTitle remoteAccessDesc"
    >
      <title id="remoteAccessTitle">{t('illustrations.remoteAccess.title')}</title>
      <desc id="remoteAccessDesc">{t('illustrations.remoteAccess.desc')}</desc>
      
      {/* Phone Screen Base */}
      <rect x="25" y="20" width="45" height="80" rx="4" fill="#E8F4F1" stroke="#172B3A" strokeWidth="4"/>
      
      {/* Eye looking in */}
      <circle cx="85" cy="45" r="15" fill="#FFFFFF" stroke="#C43D3D" strokeWidth="3"/>
      <circle cx="85" cy="45" r="5" fill="#172B3A"/>
      
      {/* Connection Beams */}
      <path d="M 55 40 Q 70 35 75 40" stroke="#C43D3D" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
      <path d="M 55 50 Q 70 55 75 50" stroke="#C43D3D" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
      
      {/* Screen Sharing Icon inside phone */}
      <rect x="32" y="45" width="20" height="15" rx="2" fill="none" stroke="#116466" strokeWidth="2"/>
      <path d="M 42 52 l 8 -8 l 0 5 m 0 -5 l -5 0" stroke="#116466" strokeWidth="2" fill="none"/>
    </svg>
  );
}
