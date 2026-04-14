"use client";

import { useState } from "react";
import { ShoppingCart, ImageOff } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import type { FoodItem } from "@/app/types";

interface CardProps {
  item: FoodItem;
  onAdd: (food: FoodItem) => void;
}

export default function Card({ item, onAdd }: CardProps) {
  const { t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[var(--surface-1)] rounded-xl shadow-md overflow-hidden flex flex-col w-full hover:shadow-lg transition-shadow">
      <div className="w-full h-44 landscape:h-28 bg-[var(--surface-3)] flex items-center justify-center overflow-hidden">
        {imgError ? (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <ImageOff size={48} />
            <span className="text-xs text-gray-400">{item.title}</span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h2 className="font-semibold text-[var(--foreground)] text-lg leading-tight">{item.title}</h2>
        <p className="text-[var(--muted)] text-sm mt-1 flex-1">{item.description}</p>
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-[var(--primary-color)] font-bold text-lg">
            {item.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
          <button
            onClick={() => onAdd(item)}
            className="flex items-center gap-1.5 bg-[var(--primary-color)] text-white px-3 py-1.5 rounded-lg text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            <ShoppingCart size={16} />
            {t("card_add")}
          </button>
        </div>
      </div>
    </div>
  );
}
