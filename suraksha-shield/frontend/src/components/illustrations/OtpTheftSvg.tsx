import React from 'react';
import { useTranslation } from 'react-i18next';

export default function OtpTheftSvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="otpTheftTitle otpTheftDesc"
    >
      <title id="otpTheftTitle">{t('illustrations.otpTheft.title')}</title>
      <desc id="otpTheftDesc">{t('illustrations.otpTheft.desc')}</desc>
      
      {/* Phone Screen Base */}
      <rect x="25" y="20" width="45" height="80" rx="4" fill="#E8F4F1" stroke="#172B3A" strokeWidth="4"/>
      
      {/* OTP Text box */}
      <rect x="32" y="40" width="31" height="20" rx="4" fill="#FFFFFF" stroke="#116466" strokeWidth="2"/>
      <text x="35" y="54" fill="#172B3A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">OTP</text>
      
      {/* Stop Hand */}
      <path d="M75 50 c -5 -15 -25 -15 -25 5 v 25 a 15 15 0 0 0 30 0 v -30 z" fill="#C43D3D"/>
      <path d="M60 55 v 20 M68 55 v 20 M52 60 v 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
