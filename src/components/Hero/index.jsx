import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLocationMarker, HiOutlineHome, HiOutlineCurrencyDollar } from "react-icons/hi";
import { SelectDropdown } from "../SelectDropdown";
import { locations, propertyTypes, budgetRanges } from "@/data/filterOptions";

export default function Hero() {

  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBudgetLabel, setSelectedBudgetLabel] = useState("");

  const handleExplore = (e) => {
    e?.preventDefault?.();
    const params = new URLSearchParams();
    if (selectedType && selectedType !== "All") {
      params.set("type", selectedType);
    }
    if (selectedLocation) {
      params.set("location", selectedLocation);
    }
    if (selectedBudgetLabel) {
      const sel = budgetRanges.find((b) => b.label === selectedBudgetLabel);
      if (sel) {
        params.set("budget", `${sel.min}-${sel.max}`);
      }
    }

    const query = params.toString();
    navigate({
      pathname: "/properties",
      search: query ? `?${query}` : "",
    });
  };

  return (
    <section className="relative bg-slate-50 overflow-hidden flex items-center min-h-screen pt-24 pb-12">
      <div className="absolute inset-0 z-0">
        <img alt="Luxury Modern Home" className="w-full h-full object-cover object-center"
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="hidden md:block h-full w-full"
          style={{background:
              "linear-gradient(90deg, rgba(248,250,252,1) 0%, rgba(248,250,252,0.98) 25%, rgba(248,250,252,0.85) 50%, rgba(248,250,252,0.3) 70%, rgba(248,250,252,0) 90%)",
            WebkitMaskImage: "linear-gradient(90deg, black 0%, black 65%, transparent 100%)",
            maskImage: "linear-gradient(90deg, black 0%, black 65%, transparent 100%)" }} />
        <div className="md:hidden h-full w-full" style={{ background:
            "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(248,250,252,0.88) 40%, rgba(248,250,252,0.4) 75%, rgba(248,250,252,0) 100%)",
          }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 w-full">
        <div className="w-full lg:w-1/2 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold leading-[1.1] tracking-tight mb-6">
              Find a home <br />
              that{" "}
              <span className="text-dwelling-accent drop-shadow-[0_2px_10px_rgba(var(--dwelling-accent-rgb),0.15)]">
                inspires
              </span>{" "}
              you.
            </h1>

            <p className="text-slate-600 font-medium text-base sm:text-lg mb-8 max-w-md leading-relaxed">
              Search curated premium properties tailored exactly to your unique lifestyle footprints.</p>

            <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] border 
              border-white/60 p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/70 backdrop-blur-md border border-white/80
                 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:bg-white/90 hover:shadow-md">
                  <SelectDropdown options={locations} value={selectedLocation} onChange={setSelectedLocation} placeholder="Location"
                    searchable icon={HiOutlineLocationMarker} size="sm" panelMaxHeight="8rem"
                    className="w-full text-slate-800 placeholder-slate-400 font-medium" />
                </div>

                <div className="rounded-xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:bg-white/90 hover:shadow-md">
                  <SelectDropdown options={["Any Type", ...propertyTypes]} value={selectedType || "Any Type"}
                    onChange={(v) => setSelectedType(v === "Any Type" ? "" : v)} placeholder="Property Type" icon={HiOutlineHome}
                    size="sm" panelMaxHeight="8rem" className="w-full text-slate-800 placeholder-slate-400 font-medium" />
                </div>

                <div className="rounded-xl bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:bg-white/90 hover:shadow-md">
                  <SelectDropdown options={budgetRanges.map((b) => ({ value: b.label, label: b.label }))}
                    value={selectedBudgetLabel} onChange={setSelectedBudgetLabel} placeholder="Budget" icon={HiOutlineCurrencyDollar}
                    size="sm" panelMaxHeight="8rem" className="w-full text-slate-800 placeholder-slate-400 font-medium" />
                </div>
              </div>
            </div>

            <button onClick={handleExplore} type="button" className="w-full sm:w-auto px-8 py-3.5 bg-dwelling-accent 
            text-white hover:bg-dwelling-accent/90 text-sm font-bold tracking-wide rounded-xl shadow-lg 
              shadow-dwelling-accent/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-98 
              transition-all duration-300 text-center inline-block">Explore Properties</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
