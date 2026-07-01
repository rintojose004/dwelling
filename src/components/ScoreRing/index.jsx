import React, { memo } from 'react';
import { motion } from 'framer-motion';

export const ScoreRing = memo(({ score = 0, label = '', icon: Icon, size = 88, stroke = 7 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" className="stroke-gray-100" />
          <motion.circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none"
            stroke="var(--color-dwelling-accent)" strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }} transition={{ duration: 0.9, ease: 'easeOut' }} />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && <Icon className="text-sm text-dwelling-accent mb-0.5" aria-hidden />}
          <span className="text-lg font-bold text-dwelling-dark leading-none">{score}</span>
        </div>
      </div>

      <p className="mt-2.5 text-xs font-bold text-dwelling-dark tracking-wide">{label}</p>
    </div>
  );
});