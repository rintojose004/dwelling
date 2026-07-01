import React, { memo } from 'react';

const AmenityItem = memo(({ name = '', distance = '', Icon }) => {
  return (
    <div className="flex items-start gap-3 p-2 hover:bg-dwelling-surface rounded-xl transition-colors duration-200">
      <div className="p-2 bg-dwelling-surface rounded-lg text-dwelling-accent border border-gray-100 shadow-sm">
        {Icon && <Icon className="text-lg" aria-hidden />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-dwelling-dark truncate">{name}</p>
        <p className="text-[10px] text-dwelling-muted mt-0.5">{distance} away</p>
      </div>
    </div>
  );
});

export default AmenityItem;