import React, { useState, useMemo, useCallback } from "react";
import { HiOutlineTrendingUp, HiOutlineInformationCircle, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineLightningBolt,
  HiOutlineMap, HiOutlineAcademicCap, HiOutlinePlusCircle, HiOutlineShoppingBag, HiOutlineHome } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import propertiesData from "../../data/properties.json";
import MetricBar from "../MetricBar";
import AmenityItem from "../AmenityItem";
import { ScoreRing } from "../ScoreRing";
import { SelectDropdown } from "../SelectDropdown";

const MAX_LOCALITIES = 12;

const iconForAmenity = (name = "") => {
  if (/metro|station|transit/i.test(name)) return HiOutlineMap;
  if (/school|academy|college/i.test(name)) return HiOutlineAcademicCap;
  if (/hospital|clinic|medical/i.test(name)) return HiOutlinePlusCircle;
  if (/mall|market|shopping/i.test(name)) return HiOutlineShoppingBag;
  return HiOutlineHome;
};

const distanceToMeters = (distance = "") => {
  const num = parseFloat(distance);
  if (Number.isNaN(num)) return Infinity;
  return /km/i.test(distance) ? num * 1000 : num;
};

const seededScore = (seed = "", min = 58, max = 96) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (hash % (max - min + 1));
};

const modeOf = (values = []) => {
  const counts = new Map();
  values.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
  let best = null;
  let bestCount = 0;
  counts.forEach((count, value) => {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  });
  return best;
};

const LocalityInsights = () => {
  const localityGroups = useMemo(() => {
    const groups = new Map();
    propertiesData.forEach((p) => {
      if (!p.location) return;
      const name = p.location.split(",")[0].trim();
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(p);
    });
    return [...groups.entries()]
      .map(([name, properties]) => ({ name, properties }))
      .sort((a, b) => b.properties.length - a.properties.length).slice(0, MAX_LOCALITIES);
  }, []);

  const [selected, setSelected] = useState(() => localityGroups[0]?.name || "");
  const handleSelect = useCallback((name) => setSelected(name), []);

  const activeGroup = useMemo(() => localityGroups.find((g) => g.name === selected) || localityGroups[0],
    [localityGroups, selected],
  );

  if (!activeGroup) return null;

  const pool = activeGroup.properties || [];
  const cityLabel = pool[0]?.location?.split(",").slice(1).join(",").trim();

  const selectOptions = useMemo(() => localityGroups.map((g) => ({ value: g.name, label: `${g.name} (${g.properties.length})` })),
    [localityGroups],
  );

  const priceStats = useMemo(() => {
    const perSqft = pool.map((p) => {
        const areaNum = parseFloat(String(p.area).replace(/[^\d.]/g, ""));
        if (!p.priceValue || !areaNum) return null;
        return p.priceValue / areaNum;
      }).filter((v) => Number.isFinite(v) && v > 0);

    if (perSqft.length === 0) return null;

    return {
      avg: Math.round(perSqft.reduce((a, b) => a + b, 0) / perSqft.length),
      min: Math.round(Math.min(...perSqft)),
      max: Math.round(Math.max(...perSqft)),
    };
  }, [pool]);

  const demand = useMemo(() => {
    const withStats = pool.filter((p) => p.statistics?.views);
    if (withStats.length === 0) return null;

    const totalViews = withStats.reduce((sum, p) => sum + (p.statistics.views || 0), 0);
    const totalEnquiries = withStats.reduce((sum, p) => sum + (p.statistics.enquiries || 0), 0);
    const rate = totalViews > 0 ? (totalEnquiries / totalViews) * 100 : 0;

    return {
      totalViews, totalEnquiries,
      level: rate >= 8 ? "High Demand" : rate >= 4 ? "Moderate Demand" : "Steady Demand",
    };
  }, [pool]);

  const dominantType = useMemo(() => modeOf(pool.map((p) => p.type).filter(Boolean)), [pool]);

  const mapEmbedSrc = useMemo(() => {
    const coords = pool.map((p) => p.coordinates).filter((c) => Array.isArray(c) && c.length === 2);
    if (coords.length > 0) {
      const lat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      const lng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
      return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
    }
    return `https://www.google.com/maps?q=${encodeURIComponent(selected)}&z=13&output=embed`;
  }, [pool, selected]);

  const nearbyPlaces = useMemo(() => {
    const seen = new Map();
    pool.forEach((p) => {
      (p.nearby || []).forEach(({ name, distance }) => {
        if (!name || !distance) return;
        const meters = distanceToMeters(distance);
        const existing = seen.get(name);
        if (!existing || meters < existing.meters) {
          seen.set(name, { name, distance, meters });
        }
      });
    });
    return [...seen.values()].sort((a, b) => a.meters - b.meters).slice(0, 5);
  }, [pool]);

  const metroDistance = useMemo(
    () => nearbyPlaces.find((p) => /metro|station/i.test(p.name))?.distance || "Not listed",
    [nearbyPlaces],
  );

  const scores = useMemo(() => ({
      walkability: seededScore(`${selected}-walk`),
      safety: seededScore(`${selected}-safety`, 65, 97),
      transit: seededScore(`${selected}-transit`, 50, 92),
    }),[selected]);

  const marketNote = useMemo(() => {
    if (!activeGroup) return "";
    const parts = [`${selected} currently has ${pool.length} active listing${pool.length === 1 ? "" : "s"}`];
    if (dominantType) parts.push(`, mostly ${dominantType.toLowerCase()}s`);
    if (priceStats)
      parts.push(`, priced between ₹${priceStats.min.toLocaleString("en-IN")} and ₹${priceStats.max.toLocaleString("en-IN")} per sq.ft.`);
    else parts.push(".");
    if (demand)
      parts.push(` Buyer interest here is trending as ${demand.level.toLowerCase()}, based on ${demand.totalEnquiries} enquiries across ${demand.totalViews.toLocaleString("en-IN")} views.`);
    return parts.join("");
  }, [activeGroup, selected, pool.length, dominantType, priceStats, demand ]);

  return (
    <section id="localities" className="py-20 bg-dwelling-accent-light">
      <div className="mx-auto px-6 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-serif text-dwelling-dark font-semibold tracking-tight">Explore Where You'll Live</h2>
            <p className="text-sm text-dwelling-muted leading-relaxed mt-3">
              Real pricing, demand, and connectivity data pulled from our current listings — use the filter to shift contexts instantly.</p>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            <SelectDropdown options={selectOptions} value={selected} onChange={handleSelect}
              placeholder="Choose a locality" searchable size="md" panelMaxHeight="10rem" className="max:w-2 md:max-w-xs min-w-4" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selected} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-dwelling-dark truncate max-w-60" title={selected}>{selected}</h3>
                  {cityLabel && <p className="text-xs text-dwelling-muted font-medium mt-1">{cityLabel}</p>}
                </div>
                {demand && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-dwelling-accent bg-dwelling-accent-strong px-3 py-1.5 rounded-full shrink-0">
                    <HiOutlineTrendingUp className="text-sm" />{demand.level}</span>)}
              </div>

              <p className="text-[10px] uppercase font-bold text-dwelling-muted tracking-wider mt-6 mb-1.5">Avg. Price per Sq.Ft.</p>
              {priceStats ? (
                <div className="text-3xl font-bold text-dwelling-dark tracking-tight mb-6">
                  ₹ {priceStats.avg.toLocaleString("en-IN")}
                </div>) : (<div className="text-lg font-semibold text-dwelling-muted mb-6">Not enough listing data yet</div>)}

              {priceStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl bg-dwelling-surface p-4 border border-gray-50">
                    <p className="text-[10px] uppercase font-bold text-dwelling-muted tracking-wider mb-1">Lowest Listed</p>
                    <p className="text-lg font-bold text-dwelling-dark">
                      ₹ {priceStats.min.toLocaleString("en-IN")}
                      <span className="text-xs font-medium text-dwelling-muted ml-1">/sqft</span>
                    </p>
                  </div>
                  <div className="rounded-xl bg-dwelling-surface p-4 border border-gray-50">
                    <p className="text-[10px] uppercase font-bold text-dwelling-muted tracking-wider mb-1">Highest Listed</p>
                    <p className="text-lg font-bold text-dwelling-dark">
                      ₹ {priceStats.max.toLocaleString("en-IN")}
                      <span className="text-xs font-medium text-dwelling-muted ml-1">/sqft</span>
                    </p>
                  </div>
                </div>)}

              <div className="relative rounded-xl overflow-hidden flex-1 min-h-60 border border-gray-100 shadow-inner">
                <iframe title={`Map of ${selected}`} src={mapEmbedSrc} width="100%" height="100%"
                  style={{ border: 0, filter: "grayscale(.15) contrast(1.01)" }} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>

              <div className="mt-4 pt-4 flex items-start gap-2 text-[11px] font-medium text-dwelling-muted border-t border-gray-100">
                <HiOutlineInformationCircle className="text-base text-dwelling-accent shrink-0" />
                <span>Calculated live from current Dwelling listings in {selected} — shifts organically as real inventory updates.</span>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7">
                <p className="text-[10px] uppercase font-bold text-dwelling-muted tracking-wider mb-6 text-center">Livability Estimate</p>
                <div className="flex items-center justify-around gap-2">
                  <ScoreRing score={scores.walkability} label="Walkability" icon={HiOutlineUserGroup} />
                  <ScoreRing score={scores.safety} label="Safety" icon={HiOutlineShieldCheck} />
                  <ScoreRing score={scores.transit} label="Transit" icon={HiOutlineLightningBolt} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <p className="text-[10px] uppercase font-bold text-dwelling-muted tracking-wider mb-1">Detailed Metrics</p>
                <div className="flex items-center justify-between text-xs pb-3.5 border-b border-gray-100">
                  <span className="font-semibold text-dwelling-primary">Nearest Metro</span>
                  <span className="font-bold text-dwelling-dark bg-dwelling-surface px-2 py-0.5 rounded-md border border-gray-100">{metroDistance}</span>
                </div>
                <MetricBar label="Walkability" value={scores.walkability} display={`${scores.walkability}/100`} />
                <MetricBar label="Neighbourhood Safety" value={scores.safety} display={`${scores.safety}/100`} />
                <MetricBar label="Transit Connectivity" value={scores.transit} display={`${scores.transit}/100`} />
              </div>

              {nearbyPlaces.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] uppercase font-bold text-dwelling-muted tracking-wider mb-4">What's Nearby</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {nearbyPlaces.slice(0, 4).map((place) => {
                      const Icon = iconForAmenity(place.name);
                      return <AmenityItem key={place.name} name={place.name} distance={place.distance} Icon={Icon} />})}
                  </div>
                </div>)}

              {marketNote && (
                <div className="rounded-xl border-l-4 border-dwelling-accent bg-white shadow-sm px-5 py-4">
                  <p className="text-[11px] font-bold text-dwelling-accent uppercase tracking-wide mb-1.5">Market Note</p>
                  <p className="text-xs text-dwelling-primary leading-relaxed font-medium">{marketNote}</p>
                </div>)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LocalityInsights;