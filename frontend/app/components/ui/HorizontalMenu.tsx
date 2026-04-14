"use client";

import { SearchX } from "lucide-react";
import Card from "./Card";
import type { FoodItem } from "@/app/types";
import { useLanguage } from "@/app/contexts/LanguageContext";

const CATEGORY_EMOJI: Record<string, string> = {
   pizza: "🍕",
   burger: "🍔",
   sushi: "🍣",
   pasta: "🍝",
   salad: "🥗",
   bebida: "🥤",
};

/**
 * Fundo branco puro — destaca do background #f6f6f6 no light,
 * superfície elevada no dark.
 */
const CATEGORY_BG =
   "bg-[var(--surface-1)] dark:bg-[var(--surface-3)] border border-[var(--border)] border-l-4 border-l-[var(--primary)]";

interface HorizontalMenuProps {
   items: FoodItem[];
   onAdd: (food: FoodItem) => void;
}

export default function HorizontalMenu({ items, onAdd }: HorizontalMenuProps) {
   const { t } = useLanguage();

   if (items.length === 0) {
      return (
         <div className="flex-1 flex flex-col bg-[var(--surface-1)] rounded-xl shadow-sm p-5">
            <div className="flex flex-col items-center gap-4 py-20">
               <SearchX size={72} className="text-[var(--border)]" />
               <p className="text-gray-400 text-lg text-center">
                  {t("no_results")}
               </p>
            </div>
         </div>
      );
   }

   const grouped = new Map<string, FoodItem[]>();
   for (const item of items) {
      const cat = item.category ?? "other";
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(item);
   }

   return (
      <div className="flex flex-col gap-4">
         {Array.from(grouped.entries()).map(([cat, catItems]) => {
            const emoji = CATEGORY_EMOJI[cat] ?? "🍽️";
            const rawLabel = t(`cat_${cat}`);
            const label = rawLabel !== `cat_${cat}` ? rawLabel : cat;

            return (
               <div key={cat} className={`rounded-xl p-4 shadow-sm ${CATEGORY_BG}`}>
                  {/* HEADER */}
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-lg">{emoji}</span>
                     <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                        {label}
                     </h3>
                     <span className="text-xs text-gray-400">
                        ({catItems.length})
                     </span>
                  </div>

                  {/* ROW — cards side by side, scroll only within this row */}
                  <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1">
                     {catItems.map((item) => (
                        <div
                           key={item.id}
                           className="flex-none w-[200px] flex"
                        >
                           <Card item={item} onAdd={onAdd} />
                        </div>
                     ))}
                  </div>
               </div>
            );
         })}
      </div>
   );
}
