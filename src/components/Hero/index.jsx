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
    <section className="relative bg-white overflow-hidden flex items-center min-h-screen pt-24 pb-12">
      <div className="absolute inset-0 z-0">
        <img alt="Luxury Modern Home" className="w-full h-full object-cover object-center"
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" />
      </div>

      {/* Scrim overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="hidden md:block h-full w-full"
          style={{ background:
              "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 20%, rgba(255,255,255,0.7) 46%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 60%)",
            WebkitMaskImage: "linear-gradient(90deg, black 0%, black 6%, transparent 100%)",
            maskImage: "linear-gradient(90deg, black 0%, black 66%, transparent 100%)" }} />
        <div className="md:hidden h-full w-full" style={{ background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.82) 18%, rgba(255,255,255,0.45) 42%, rgba(255,255,255,0) 100%)" }} />
        <div className="absolute left-0 top-0 bottom-0 hidden md:block"
          style={{ width: 56, opacity: 0.98, background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.0) 100%)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 w-full">
        <div className="w-full lg:w-1/2 max-w-xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold text-gray-950 leading-[1.1] tracking-tight mb-6">
              Find a home <br />
              that <span className="text-dwelling-accent">inspires</span> you.
            </h1>

            <p className="text-dwelling-primary font-medium text-base sm:text-lg mb-8 max-w-md leading-relaxed">
              Search curated premium properties tailored exactly to your unique lifestyle footprints.</p>

            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-950/5 border border-gray-100 p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-3">
                <div>
                  <SelectDropdown options={locations} value={selectedLocation} onChange={setSelectedLocation} placeholder="Location"
                    searchable icon={HiOutlineLocationMarker} size="sm" panelMaxHeight="8rem" className="w-full" />
                </div>
                <div>
                  <SelectDropdown options={["Any Type", ...propertyTypes]} value={selectedType || "Any Type"}
                    onChange={(v) => setSelectedType(v === "Any Type" ? "" : v)} placeholder="Property Type"
                    icon={HiOutlineHome} size="sm" panelMaxHeight="8rem" />
                </div>

                <div>
                  <SelectDropdown options={budgetRanges.map((b) => ({
                      value: b.label,
                      label: b.label,
                    }))}
                    value={selectedBudgetLabel} onChange={setSelectedBudgetLabel} placeholder="Budget"
                    icon={HiOutlineCurrencyDollar} size="sm" panelMaxHeight="8rem" />
                </div>
              </div>
            </div>

            <button onClick={handleExplore} type="button" className="w-full sm:w-auto px-8 py-3.5 bg-dwelling-accent 
              text-white text-sm font-bold tracking-wide rounded-xl shadow-lg shadow-dwelling-accent/20 hover:shadow-xl
               hover:shadow-dwelling-accent/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all 
               duration-300 text-center inline-block">Explore Properties</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
