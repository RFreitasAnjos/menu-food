"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Card from "./Card";
import type { FoodItem } from "@/app/types";
import { useLanguage } from "@/app/contexts/LanguageContext";

const PAGE_SIZE = 12;

/** Returns the page numbers (and "..." placeholders) to show in the pagination bar. */
function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range: (number | "...")[] = [1];
  if (current > 3) range.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) range.push(i);
  if (current < total - 2) range.push("...");
  range.push(total);
  return range;
}

interface PrincipalMenuProps {
  /** Already-filtered list of items to display. */
  items: FoodItem[];
  onAdd: (food: FoodItem) => void;
}

export default function PrincipalMenu({ items, onAdd }: PrincipalMenuProps) {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the filtered list changes (filter applied upstream).
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const paginated = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex-1 flex flex-col bg-[var(--surface-1)] rounded-xl shadow-sm p-5">
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginated.map((item) => (
          <Card key={item.id} item={item} onAdd={onAdd} />
        ))}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20">
          <SearchX size={72} className="text-[var(--border)]" />
          <p className="text-[var(--muted)] text-lg text-center">{t("no_results")}</p>
        </div>
      )}

      {/* Pagination bar — only visible when there is more than one page */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border)] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-3)] text-[var(--foreground)] transition-colors"
          >
            <ChevronLeft size={16} />
            {t("page_prev")}
          </button>

          {getPageRange(currentPage, totalPages).map((item, i) =>
            item === "..." ? (
              <span
                key={`e-${i}`}
                className="px-2 text-gray-400 dark:text-gray-500 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item as number)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item
                    ? "bg-[var(--primary-color)] text-white shadow-sm"
                    : "border border-[var(--border)] hover:bg-[var(--surface-3)] text-[var(--foreground)]"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[var(--border)] text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-3)] text-[var(--foreground)] transition-colors"
          >
            {t("page_next")}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
