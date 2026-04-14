"use client";

import Link from "next/link";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <UtensilsCrossed size={80} className="text-[var(--primary-color)] opacity-30 mb-6" />
      <h1
        className="text-8xl font-bold text-[var(--primary-color)] mb-2"
        style={{ fontFamily: "var(--font-merienda)" }}
      >
        404
      </h1>
      <p className="text-xl font-semibold text-gray-700 mb-2">{t("notfound_title")}</p>
      <p className="text-gray-400 max-w-sm mb-8">
        {t("notfound_desc")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
      >
        <ArrowLeft size={18} />
        {t("notfound_back")}
      </Link>
    </main>
  );
}
