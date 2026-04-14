"use client";

import React from "react";
import { 
   Search, 
   DollarSign,
   Pizza,
   Sandwich,
   Fish,
   UtensilsCrossed,
   Salad,
   CupSoda,
 } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface FilterProps {
  search: string;
  minPrice: string;
  maxPrice: string;
  onSearch: (v: string) => void;
  onMinPrice: (v: string) => void;
  onMaxPrice: (v: string) => void;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (cat: string) => void;
}

/** Formata dígitos brutos → R$ 1.234,56 (estilo caixa eletrônico) */
function applyMaskBRL(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const num = Number(digits) / 100;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Converte "R$ 1.234,56" → número para comparação */
function parseValue(v: string): number {
  const digits = v.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

/** Emoji categorias */
const CATEGORY_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  pizza: Pizza,
  burger: Sandwich,
  sushi: Fish,
  pasta: UtensilsCrossed,
  salad: Salad,
  bebida: CupSoda,
};

export default function Filter({
  search,
  minPrice,
  maxPrice,
  onSearch,
  onMinPrice,
  onMaxPrice,
  categories,
  selectedCategories,
  onToggleCategory,
}: FilterProps) {
  const { t } = useLanguage();

  const hasRangeError =
    !!minPrice && !!maxPrice && parseValue(minPrice) > parseValue(maxPrice);

  const baseInput =
    "w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 bg-[var(--surface-3)] text-[var(--foreground)]";
  const normalBorder =
    "border-[var(--border)] focus:ring-[var(--primary-color)]";
  const errorBorder = "border-red-400 dark:border-red-400 focus:ring-red-400";

  return (
    <div className="bg-[var(--surface-2)] rounded-xl shadow-sm mb-4 overflow-hidden">

      {/* ROW 1 */}
      <div className="flex flex-col sm:flex-row gap-3 p-4">

        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("filter_search")}
            className="w-full pl-9 pr-3 py-2 border border-[var(--border)] bg-[var(--surface-3)] text-[var(--foreground)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>

        {/* PRICE RANGE */}
        <div className="flex gap-3 flex-shrink-0">

          {/* MIN */}
          <div className="relative w-36">
            <DollarSign
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              inputMode="decimal"
              value={minPrice}
              onChange={(e) => onMinPrice(applyMaskBRL(e.target.value))}
              placeholder={t("filter_min")}
              className={`${baseInput} ${hasRangeError ? errorBorder : normalBorder}`}
            />
          </div>

          {/* MAX */}
          <div className="relative w-36">
            <DollarSign
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              inputMode="decimal"
              value={maxPrice}
              onChange={(e) => onMaxPrice(applyMaskBRL(e.target.value))}
              placeholder={t("filter_max")}
              className={`${baseInput} ${hasRangeError ? errorBorder : normalBorder}`}
            />
          </div>

        </div>
      </div>

      {/* Range error message */}
      {hasRangeError && (
        <p className="px-4 pb-2 text-xs text-red-500">
          {t("filter_range_error") !== "filter_range_error"
            ? t("filter_range_error")
            : "O valor mínimo não pode ser maior que o máximo."}
        </p>
      )}

      {/* ROW 2 */}
      {categories.length > 0 && (
          <div className="px-4 pb-4 border-t border-[var(--border)]">
          <p className="text-xs text-gray-400 font-medium uppercase mt-2 mb-2">
            {t("filter_categories")}
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategories.includes(cat);
              const Icon = CATEGORY_ICON[cat] ?? Pizza;
              const label =
                t(`cat_${cat}`) !== `cat_${cat}` ? t(`cat_${cat}`) : cat;

              return (
                <button
                  key={cat}
                  onClick={() => onToggleCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                    active
                      ? "bg-[var(--primary-color)] border-[var(--primary-color)] text-white"
                      : "bg-[var(--surface-3)] border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
