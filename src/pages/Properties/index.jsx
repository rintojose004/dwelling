import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { HiOutlineSearch, HiOutlineAdjustments } from "react-icons/hi";
import propertiesData from "../../data/properties.json";
import { locations, propertyTypes, budgetRanges } from "@/data/filterOptions";
import { PropertyCard } from "@/components/PropertyCard";
import { SelectDropdown } from "@/components/SelectDropdown";

const ITEMS_PER_PAGE = 9;
const SORT_OPTIONS = [
  { value: "relevance", label: "Featured & Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newly Listed" },
];

function resolveBudgetLabel(param) {
  if (!param) return "";
  const [min, max] = param.split("-").map(Number);
  const match = budgetRanges.find(
    (b) => b.min === min && (b.max === max || (!isFinite(b.max) && !isFinite(max)))
  );
  return match ? match.label : "";
}

const selectLabelStyle = `block text-xs font-semibold text-dwelling-muted uppercase mb-1.5`;

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  // pagination (initialized from URL)
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  // Filters seeded cleanly from URL state mapping
  const [filterType, setFilterType] = useState(() => searchParams.get("type") || "All");
  const [filterLocation, setFilterLocation] = useState(() => searchParams.get("location") || "");
  const [filterBudget, setFilterBudget] = useState(() => resolveBudgetLabel(searchParams.get("budget")));
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Dynamic calculations for state indicators
  const currentAveragePrice = useMemo(() => {
    const subset = propertiesData.filter((p) => {
      const matchesType = filterType === "All" || p.type === filterType;
      const matchesLoc = !filterLocation || p.location.toLowerCase().includes(filterLocation.toLowerCase());
      return matchesType && matchesLoc;
    });
    if (!subset.length) return 0;
    return Math.round(subset.reduce((sum, item) => sum + (item.priceValue || 0), 0) / subset.length);
  }, [filterType, filterLocation]);

  // Synchronize dynamic updates directly into routing context layers (include page)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterType && filterType !== "All") params.set("type", filterType);
    if (filterLocation) params.set("location", filterLocation);
    if (filterBudget) {
      const sel = budgetRanges.find((b) => b.label === filterBudget);
      if (sel) params.set("budget", `${sel.min}-${sel.max}`);
    }
    if (sortBy && sortBy !== "relevance") params.set("sort", sortBy);
    // only include page when > 1 to keep clean URLs
    if (page && page > 1) params.set("page", String(page));
    setSearchParams(params, { replace: true });
  }, [filterType, filterLocation, filterBudget, sortBy, page, setSearchParams]);

  // when filters/sort change, reset to first page
  useEffect(() => {
    setPage(1);
  }, [filterType, filterLocation, filterBudget, sortBy]);

  // Filter & sort
  const filtered = useMemo(() => {
    return propertiesData
      .filter((p) => {
        const matchesType = filterType === "All" || p.type === filterType;
        const matchesLocation = !filterLocation || p.location.toLowerCase().includes(filterLocation.toLowerCase());
        let matchesBudget = true;
        if (filterBudget) {
          const selected = budgetRanges.find((b) => b.label === filterBudget);
          if (selected) {
            matchesBudget = p.priceValue >= selected.min && p.priceValue < selected.max;
          }
        }
        return matchesType && matchesLocation && matchesBudget;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.priceValue - b.priceValue;
        if (sortBy === "price-desc") return b.priceValue - a.priceValue;
        if (sortBy === "newest") return (b.listedAt || 0) - (a.listedAt || 0);
        return 0;
      });
  }, [filterType, filterLocation, filterBudget, sortBy]);

  // pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  // clamp page to valid range if necessary (e.g., after filtering)
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      const params = new URLSearchParams(searchParams.toString());
      if (totalPages > 1) params.set("page", String(totalPages));
      else params.delete("page");
      setSearchParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]); // intentionally only run when totalPages changes

  const visibleProperties = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const hasActiveFilters = filterType !== "All" || filterLocation || filterBudget;

  const clearFilters = useCallback(() => {
    setFilterType("All");
    setFilterLocation("");
    setFilterBudget("");
    setSortBy("relevance");
  }, []);

  // pagination helpers: compact range with ellipses
  const pageRange = useMemo(() => {
    // keep small numeric pager with ellipses
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const result = [];
    const left = Math.max(1, page - 2);
    const right = Math.min(totalPages, page + 2);

    if (left > 1) {
      result.push(1);
      if (left > 2) result.push("left-ellipsis");
    }

    for (let i = left; i <= right; i++) result.push(i);

    if (right < totalPages) {
      if (right < totalPages - 1) result.push("right-ellipsis");
      result.push(totalPages);
    }

    return result;
  }, [totalPages, page]);

  const goToPage = useCallback(
    (p) => {
      if (p === page || p === "left-ellipsis" || p === "right-ellipsis") return;
      const target = Number(p);
      if (!Number.isFinite(target) || target < 1 || target > totalPages) return;
      setPage(target);
      const params = new URLSearchParams(searchParams.toString());
      if (target > 1) params.set("page", String(target));
      else params.delete("page");
      setSearchParams(params, { replace: true });

      // scroll to results top
      setTimeout(() => {
        const el = document.getElementById("properties-grid-top");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    },
    [page, totalPages, searchParams, setSearchParams]
  );

  return (
    <div className="bg-white min-h-screen pt-24 lg:pt-32 pb-24 selection:bg-dwelling-accent/10 selection:text-dwelling-accent">
      {/* Clean Minimalist Hero Banner */}
      <div className="mx-auto px-6 md:px-12 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-br from-dwelling-accent via-[#153b80] to-dwelling-dark p-8 md:p-12 shadow-xl shadow-dwelling-accent/10">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-4">
              Find your next premium home
            </h1>
            <p className="text-white/70 text-base md:text-lg font-normal leading-relaxed">
              Handpicked properties for discerning clients. Filter through our exclusive assets listed natively below.
            </p>
          </div>
        </div>
      </div>

      {/* Main Structural Column Canvas */}
      <div className="mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Left Sidebar Filters Module */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 z-20">
            {/* Desktop Filter Panel */}
            <div className="hidden lg:block space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-50">
                  <h4 className="text-sm font-bold text-dwelling-dark uppercase tracking-wider">Search Filters</h4>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-dwelling-accent hover:underline font-medium">
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={selectLabelStyle}>Type</label>
                    <SelectDropdown options={useMemo(() => ["All", ...propertyTypes].map((t) => ({ value: t, label: t })), [])} value={filterType} onChange={setFilterType} size="md" panelMaxHeight="12rem" />
                  </div>
                  <div>
                    <label className={selectLabelStyle}>Location</label>
                    <SelectDropdown options={locations} value={filterLocation} onChange={setFilterLocation} searchable size="md" panelMaxHeight="12rem" />
                  </div>
                  <div>
                    <label className={selectLabelStyle}>Budget</label>
                    <SelectDropdown options={budgetRanges.map((b) => ({ value: b.label, label: b.label }))} value={filterBudget} onChange={setFilterBudget} size="md" panelMaxHeight="12rem" />
                  </div>
                </div>
              </div>

              {/* Dynamic Market Performance Snapshot Widget */}
              <div className="bg-dwelling-surface/60 border border-dwelling-primary/5 rounded-2xl p-5">
                <h5 className="text-xs font-bold text-dwelling-muted uppercase tracking-wider mb-3">Market Intelligence</h5>
                <div>
                  <p className="text-xs text-dwelling-muted">Filtered Segment Average</p>
                  <p className="text-xl font-bold text-dwelling-dark mt-0.5">
                    {currentAveragePrice > 0 ? `$${currentAveragePrice.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200/60 text-xs text-dwelling-muted space-y-2">
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live MLS direct inventory feed
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Action Configure Drawer Button */}
            <div className="lg:hidden w-full">
              <div className="bg-dwelling-surface/80 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-gray-100">
                <button onClick={() => setMobileFiltersOpen((v) => !v)} className="flex items-center gap-2 px-4 py-2.5 bg-dwelling-accent text-white rounded-xl shadow-sm hover:bg-dwelling-accent/90 active:scale-[0.98] transition-all text-sm font-medium">
                  <HiOutlineAdjustments className="text-lg" />
                  <span>Filter</span>
                </button>
                <div className="text-xs font-bold text-dwelling-muted uppercase tracking-wide px-3">{filtered.length} Matches</div>
              </div>

              {mobileFiltersOpen && (
                <div className="mt-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                  <SelectDropdown options={useMemo(() => ["All", ...propertyTypes].map((t) => ({ value: t, label: t })), [])} value={filterType} onChange={setFilterType} placeholder="Property Type" size="md" />
                  <SelectDropdown options={locations} value={filterLocation} onChange={setFilterLocation} placeholder="Location" searchable size="md" />
                  <SelectDropdown options={budgetRanges.map((b) => ({ value: b.label, label: b.label }))} value={filterBudget} onChange={setFilterBudget} placeholder="Budget" size="md" />
                  <div className="flex gap-2 pt-2">
                    <button onClick={clearFilters} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition">Clear</button>
                    <button onClick={() => setMobileFiltersOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-dwelling-accent text-white text-sm font-medium shadow-sm transition">Apply</button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Central Grid System */}
          <main className="lg:col-span-9">
            {/* Toolbar Header (Sorted selection option only) */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <span className="text-sm font-medium text-dwelling-muted">
                Showing <span className="text-dwelling-dark font-semibold">{filtered.length}</span> luxury listings
              </span>
              <div className="w-56">
                <SelectDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} size="sm" panelMaxHeight="10rem" />
              </div>
            </div>

            {/* Grid of results (has id for scroll-to when paginating) */}
            {visibleProperties.length > 0 ? (
              <>
                <div id="properties-grid-top" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleProperties.map((p, i) => (
                    <div key={p.id} className="">
                      <PropertyCard property={p} index={i % 9} />
                    </div>))}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <nav className="mt-8 flex items-center justify-center" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 rounded-md mr-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Previous page"
                    >
                      Prev
                    </button>

                    <div className="inline-flex items-center gap-2">
                      {pageRange.map((p, idx) => {
                        if (p === "left-ellipsis" || p === "right-ellipsis") {
                          return (
                            <span key={p + idx} className="px-2 text-sm text-dwelling-muted">
                              …
                            </span>
                          );
                        }
                        return (
                          <button
                            key={p}
                            onClick={() => goToPage(p)}
                            aria-current={p === page ? "page" : undefined}
                            aria-label={`Go to page ${p}`}
                            className={`px-3 py-2 rounded-md text-sm font-medium border ${
                              p === page
                                ? "bg-dwelling-accent text-white border-dwelling-accent"
                                : "bg-white text-dwelling-dark border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => goToPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-2 rounded-md ml-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            ) : (
              /* Fallback Zero State Display Dashboard */
              <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-dwelling-surface/20 px-6">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-4 shadow-sm text-dwelling-muted">
                  <HiOutlineSearch className="text-2xl" />
                </div>
                <h4 className="text-lg font-bold text-dwelling-dark mb-1">Zero Properties Found</h4>
                <p className="text-dwelling-muted text-sm max-w-sm mx-auto mb-6">
                  We currently do not track properties fitting your specialized metrics. Try relaxing global filter constraints.
                </p>
                <button onClick={clearFilters} className="px-5 py-2.5 bg-dwelling-accent text-white font-medium text-sm rounded-xl shadow-sm hover:bg-dwelling-accent/90 transition">
                  Clear Configurations
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}