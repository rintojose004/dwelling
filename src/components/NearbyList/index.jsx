import React from "react";

const NearbyList = ({ nearby = [] }) => {
  if (!nearby.length) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dwelling-dark">What's Nearby</h3>
        <span className="text-sm text-dwelling-muted">{nearby.length} Places</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearby.map(({ name, distance }) => (
          <div key={name} className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all
           duration-300 hover:-translate-y-1 hover:border-dwelling-accent/30 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-dwelling-dark wrap-break-word" title={name}>{name}</h4>
                <p className="mt-1 text-sm text-dwelling-muted">Nearby Landmark</p>
              </div>
              <span className="shrink-0 rounded-full bg-dwelling-accent/10 px-3 py-1.5 text-xs font-semibold text-dwelling-accent">
                {distance}
              </span>
            </div>
          </div>))}
      </div>
    </section>
  );
};

export default NearbyList;
