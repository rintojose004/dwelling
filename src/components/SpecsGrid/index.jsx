import React from "react";

const SpecsGrid = ({ specs }) => {
  if (!specs) return null;

  const items = Object.entries(specs);
  if (!items.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-dwelling-dark">Specifications</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-white p-4">
        {items.map(([key, value]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl
           border border-gray-100 bg-gray-50 p-3">
            <span className="text-sm font-medium text-dwelling-muted capitalize">{key?.replace(/([A-Z])/g, " $1")}</span>
            <span className="text-sm font-semibold text-dwelling-dark sm:text-right wrap-break-word">{value}</span>
          </div>))}
      </div>
    </div>
  );
};

export default SpecsGrid;