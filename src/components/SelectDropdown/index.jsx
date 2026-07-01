import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import { HiChevronDown, HiCheck } from "react-icons/hi";

const normalizeOptions = (options = []) =>
  options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : { value: o.value ?? o.label, label: o.label ?? o.value, ...o }
  );

export const SelectDropdown = memo(({ options = [], value = "", onChange = () => {}, placeholder = "Select", searchable = false,
  icon: Icon = null, className = "", ariaLabel = "", size = "md", panelMaxHeight = "14rem" }) => {
  
    const opts = useMemo(() => normalizeOptions(options), [options]);

  const sizeMap = {
    sm: { btn: "px-3 py-2 text-sm", input: "px-2 py-1 text-sm", iconSize: "text-lg" },
    md: { btn: "px-4 py-3 text-sm", input: "px-3 py-2 text-sm", iconSize: "text-xl" },
    lg: { btn: "px-5 py-4 text-base", input: "px-4 py-3 text-base", iconSize: "text-2xl" },
  };
  const chosen = sizeMap[size] || sizeMap.md;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    const onDoc = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return opts;
    const q = query.toLowerCase();
    return opts.filter((o) => o.label.toLowerCase().includes(q));
  }, [opts, query, searchable]);

  const selectedOption = opts.find((o) => String(o.value) === String(value));

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(filtered.length - 1);
  }, [filtered.length, activeIndex]);

  // CHANGED: Implemented smooth native scroll effect targeting the active item
  const scrollToActive = (index) => {
    requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;
      const item = list.children[index];
      if (item) {
        item.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => {
        const next = Math.min(i + 1, filtered.length - 1);
        scrollToActive(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => {
        const prev = Math.max(i - 1, 0);
        scrollToActive(prev);
        return prev;
      });
    } else if (e.key === "Enter" || e.key === " ") {
      if (!open) {
        setOpen(true);
      } else if (activeIndex >= 0 && filtered[activeIndex]) {
        e.preventDefault();
        onChange(filtered[activeIndex].value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <label className="sr-only">{ariaLabel || placeholder}</label>

      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 bg-white text-dwelling-dark border border-gray-200 
        hover:border-dwelling-accent rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-dwelling-accent/20 
        transition-all ${chosen.btn} font-medium`}>
        <span className="flex items-center gap-3 truncate">
          {Icon && <Icon className={`${chosen.iconSize} text-dwelling-accent shrink-0`} />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-dwelling-muted">{placeholder}</span>}
          </span>
        </span>

        <span className="ml-auto flex items-center gap-2">
          <HiChevronDown className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-2 z-50">
          <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-1.5">
            {searchable && (
              <div className="px-2 pb-2">
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${placeholder}...`}
                  className={`w-full rounded-lg border border-gray-200 outline-none focus:ring-2 
                    focus:ring-dwelling-accent/20 ${chosen.input}`} />
              </div>)}

            <ul role="listbox" ref={listRef} style={{ maxHeight: panelMaxHeight, msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              className="overflow-y-auto divide-y divide-gray-50 [&::-webkit-scrollbar]:hidden">
              {filtered.length === 0 && <li className="px-3 py-2 text-sm text-dwelling-muted">No results</li>}

              {filtered.map((opt, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = String(opt.value) === String(value);
                return (
                  <li key={opt.value}>
                    <button type="button" onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between gap-3 ${
                        isSelected ? "bg-dwelling-accent text-white font-semibold" : 
                        "text-dwelling-primary hover:bg-dwelling-surface"}
                        ${isActive && !isSelected ? "ring-2 ring-dwelling-accent/20" : ""}`}>
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <HiCheck className="text-white" />}
                    </button>
                  </li>);
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
});
