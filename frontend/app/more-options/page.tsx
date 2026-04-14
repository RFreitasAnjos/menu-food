"use client";

import { Globe, MapPin, Clock, Phone, Info } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import type { Language } from "@/app/types";

const LANGUAGES: { code: Language; label: string; flag: string; name: string }[] =
  [
    { code: "pt-br", label: "PT", flag: "🇧🇷", name: "Português" },
    { code: "en", label: "EN", flag: "🇺🇸", name: "English" },
    { code: "es", label: "ES", flag: "🇪🇸", name: "Español" },
  ];



export default function MoreOptionsPage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 flex-1">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t("opts_title")}</h1>

      {/* Language section */}
      <section className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={20} className="text-[var(--primary-color)]" />
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">{t("opts_language")}</h2>
        </div>
        <div className="flex gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                language === lang.code
                  ? "border-[var(--primary-color)] bg-orange-50 dark:bg-orange-950 text-[var(--primary-color)]"
                  : "border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-300 hover:border-gray-300"
              }`}
            >
              <span className="text-xl block mb-0.5">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} className="text-[var(--primary-color)]" />
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">{t("opts_about")}</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{t("opts_address")}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{t("opts_hours")}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
            <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{t("opts_phone")}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
