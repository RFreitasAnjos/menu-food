"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Loading() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-20">
      {/* Animated ring */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-color)] border-t-transparent animate-spin" />
      </div>
      <p
        className="text-xl font-bold text-[var(--primary-color)]"
        style={{ fontFamily: "var(--font-merienda)" }}
      >
        MenuFood
      </p>
      <p className="text-sm text-gray-400">{t("loading_text")}</p>
    </main>
  );
}
