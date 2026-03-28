// components/common/Pagination.tsx
"use client";

import { useState, useEffect } from "react";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

const Pagination = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const [visiblePages, setVisiblePages] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      setVisiblePages(window.innerWidth >= 768 ? 6 : 4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const end = Math.min(totalPages, start + visiblePages - 1);

    if (end - start + 1 < visiblePages) {
      start = Math.max(1, end - visiblePages + 1);
    }

    const pages: (number | string)[] = [];

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-black dark:text-white dark:border-gray-300"
          >
            {[5, 10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`rounded-tl-sm p-[11px] rounded-bl-sm border-[#777777] border disabled:opacity-50 text-sm sm:text-base hover:cursor-pointer ${currentPage === 1 ? 'text-black dark:text-white' : 'bg-[#EE5A2C] text-white'}`}
        >
          Previous
        </button>

        <div className="flex items-center">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`min-w-[36px] p-[11px] border-[#777777] ${getPageNumbers()?.length !== index +1 ? 'border-r' : ''} border-t border-b text-sm sm:text-base ${
                page === currentPage
                  ? "bg-[#F53E32] text-white"
                  : "hover:cursor-pointer"
              } ${
                typeof page !== "number" && "pointer-events-none cursor-default"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-[11px] rounded-tr-sm rounded-br-sm border-[#777777] border disabled:opacity-50 text-sm sm:text-base hover:cursor-pointer ${currentPage === totalPages ? 'text-black dark:text-white' : 'bg-[#EE5A2C] text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;