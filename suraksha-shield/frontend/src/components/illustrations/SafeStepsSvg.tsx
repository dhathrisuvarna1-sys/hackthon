import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SafeStepsSvg({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="safeStepsTitle safeStepsDesc"
    >
      <title id="safeStepsTitle">{t('illustrations.safeSteps.title')}</title>
      <desc id="safeStepsDesc">{t('illustrations.safeSteps.desc')}</desc>
      
      {/* Shield Base */}
      <path d="M 60 10 L 20 25 V 50 C 20 80 50 105 60 110 C 70 105 100 80 100 50 V 25 Z" fill="#E8F4F1"/>
      
      {/* Checkmark */}
      <path d="M 45 55 L 55 65 L 75 40" stroke="#16835D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      
      {/* Helpline text 1930 */}
      <rect x="35" y="80" width="50" height="20" rx="10" fill="#172B3A"/>
      <text x="44" y="94" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">1930</text>
    </svg>
  );
}
