"use client";

import { useState, useMemo, useEffect } from "react";
import { LayoutGrid, AlignJustify } from "lucide-react";
import { useRouter } from "next/navigation";
import { productApi, type ProductResponse } from "@/api/api";
import type { FoodItem, ViewMode } from "@/app/types";
import { useLanguage } from "./contexts/LanguageContext";import { useAuth } from "./contexts/AuthContext";import Filter from "./components/ui/Filter";
import OrderModal from "./components/ui/OrderModal";
import PrincipalMenu from "./components/ui/PrincipalMenu";
import HorizontalMenu from "./components/ui/HorizontalMenu";
import PromotionSection from "./components/ui/PromotionSection";

/** Converte string BRL do Filter ("R$ 1.234,56") → número para comparação */
function parsePrice(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

/** Mapeia ProductResponse (backend) → FoodItem (frontend) */
function toFoodItem(p: ProductResponse): FoodItem {
  return {
    id: p.id,
    title: p.name,
    description: p.description,
    value: Number(p.basePrice),
    img: p.imageUrl,
    category: p.category?.toLowerCase(),
  };
}

export default function Home() {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    productApi
      .list()
      .then((products) => setItems(products.map(toFoodItem)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  /** Abre o modal de adicionar ao carrinho — exige login */
  const handleAdd = (food: FoodItem) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setSelectedFood(food);
  };

  // Derive unique categories preserving insertion order
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of items) {
      if (item.category && !seen.has(item.category)) {
        seen.add(item.category);
        result.push(item.category);
      }
    }
    return result;
  }, [items]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        search === "" ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const price = item.value;
      const minNum = minPrice === "" ? null : parsePrice(minPrice);
      const maxNum = maxPrice === "" ? null : parsePrice(maxPrice);
      const matchesMin = minNum === null || price >= minNum;
      const matchesMax = maxNum === null || price <= maxNum;

      const matchesCategory =
        selectedCategories.length === 0 ||
        (item.category != null && selectedCategories.includes(item.category));

      return matchesSearch && matchesMin && matchesMax && matchesCategory;
    });
  }, [items, search, minPrice, maxPrice, selectedCategories]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 landscape:py-2 flex-1 flex flex-col max-sm:w-full">

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <span className="text-[var(--muted)] text-sm animate-pulse">
            {t("loading_text")}
          </span>
        </div>
      ) : (
        <>
      <div>
        <Filter
          search={search}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onSearch={setSearch}
          onMinPrice={setMinPrice}
          onMaxPrice={setMaxPrice}
          categories={categories}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
        />
      </div>
      <div className="landscape:hidden">
        <PromotionSection />
      </div>

      {/* Menu container — toggle header + active menu view */}
      <div className="flex-1 flex flex-col">
        {/* Toggle bar — mobile only, hidden on desktop */}
        <div className="flex sm:hidden items-center justify-end mb-3">
          <div className="flex items-center border border-gray-200 dark:border-zinc-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              aria-label={t("view_grid")}
              title={t("view_grid")}
              className={`flex items-center justify-center p-2 transition-colors ${viewMode === "grid"
                ? "bg-[var(--primary-color)] text-white"
                : "bg-white dark:bg-zinc-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700"
                }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("horizontal")}
              aria-label={t("view_horizontal")}
              title={t("view_horizontal")}
              className={`flex items-center justify-center p-2 transition-colors ${viewMode === "horizontal"
                ? "bg-[var(--primary-color)] text-white"
                : "bg-white dark:bg-zinc-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-700"
                }`}
            >
              <AlignJustify size={16} />
            </button>
          </div>
        </div>

        {/* Desktop (sm+): always grid, no toggle */}
        <div className="hidden sm:flex flex-1 flex-col">
          <PrincipalMenu items={filtered} onAdd={handleAdd} />
        </div>

        {/* Mobile (<sm): respects viewMode choice */}
        <div className="flex flex-col flex-1 sm:hidden">
          {viewMode === "grid" ? (
            <PrincipalMenu items={filtered} onAdd={handleAdd} />
          ) : (
            <HorizontalMenu items={filtered} onAdd={handleAdd} />
          )}
        </div>
      </div>

      <OrderModal food={selectedFood} onClose={() => setSelectedFood(null)} />
        </>
      )}
    </main>
  );
}

