import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LotterySvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="lotteryTitle lotteryDesc"
    >
      <title id="lotteryTitle">{t('illustrations.lottery.title')}</title>
      <desc id="lotteryDesc">{t('illustrations.lottery.desc')}</desc>
      
      {/* Gift Box Base */}
      <rect x="35" y="60" width="50" height="40" fill="#116466"/>
      <rect x="30" y="50" width="60" height="15" fill="#172B3A"/>
      <rect x="55" y="50" width="10" height="50" fill="#E8F4F1"/>
      
      {/* Rupee Coin floating out */}
      <circle cx="45" cy="35" r="12" fill="#E8F4F1" stroke="#116466" strokeWidth="2"/>
      <text x="40" y="40" fill="#172B3A" fontSize="14" fontWeight="bold" fontFamily="sans-serif">₹</text>

      {/* Fishing Hook */}
      <path d="M80 10 v 30 a 10 10 0 0 1 -20 0 v -5" stroke="#C43D3D" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <polygon points="57,35 63,35 60,30" fill="#C43D3D"/>
    </svg>
  );
}
