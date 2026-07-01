import React, { memo } from 'react';
import { motion } from 'framer-motion';

const MetricBar = memo(({ label = '', value = 0, display = '' }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-dwelling-primary">{label}</span>
        <span className="text-xs font-bold text-dwelling-dark">{display}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <motion.div className="h-full rounded-full bg-dwelling-accent"
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} />
      </div>
    </div>
  );
});

export default MetricBar;