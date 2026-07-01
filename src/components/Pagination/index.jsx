import React, { useMemo } from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange, ariaLabel = "Pagination" }) => {

  const pageRange = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const result = [];
    const left = Math.max(1, currentPage - 2);
    const right = Math.min(totalPages, currentPage + 2);

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
  }, [totalPages, currentPage]);

  const handlePageChange = (p) => {
    if (typeof p !== "number" || p === currentPage || p < 1 || p > totalPages)
      return;
    onPageChange(p);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center" aria-label={ariaLabel}>
      <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page"
        className="px-3 py-2 rounded-md mr-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50
         disabled:cursor-not-allowed transition">Prev</button>

      <div className="inline-flex items-center gap-2">
        {pageRange.map((p, idx) => {
          if (p === "left-ellipsis" || p === "right-ellipsis") {
            return (
              <span key={p + idx} className="px-2 text-sm text-dwelling-muted">…</span>);
          }
          return (
            <button key={p} onClick={() => handlePageChange(p)} aria-current={p === currentPage ? "page" : undefined} aria-label={`Go to page ${p}`}
              className={`px-3 py-2 rounded-md text-sm font-medium border transition ${
                p === currentPage ? "bg-dwelling-accent text-white border-dwelling-accent"
                  : "bg-white text-dwelling-dark border-gray-200 hover:bg-gray-50"}`}>{p}</button>
          );
        })}
      </div>

      <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
       aria-label="Next page" className="px-3 py-2 rounded-md ml-2 text-sm border border-gray-200 bg-white 
       hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">Next</button>
    </nav>
  );
}
