"use client";

import { TriangleAlert, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="bg-red-50 rounded-full p-6 mb-6">
        <TriangleAlert size={56} className="text-[var(--primary-color)]" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("error_title")}</h1>
      <p className="text-gray-400 max-w-sm mb-8">
        {t("error_desc")}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          <RefreshCcw size={18} />
          {t("error_retry")}
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          {t("error_back")}
        </Link>
      </div>
    </main>
  );
}
