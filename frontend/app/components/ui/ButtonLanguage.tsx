"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import type { Language } from "@/app/types";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "pt-br", label: "PT", flag: "🇧🇷" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
];

export default function ButtonLanguage() {
  const { language, setLanguage } = useLanguage();

  const currentIndex = LANGUAGES.findIndex((l) => l.code === language);
  const current = LANGUAGES[currentIndex] ?? LANGUAGES[0];
  const next = LANGUAGES[(currentIndex + 1) % LANGUAGES.length];

  return (
    <button
      onClick={() => setLanguage(next.code)}
      className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity"
      title={`Switch to ${next.label}`}
      aria-label={`Current language: ${current.label}. Click to switch to ${next.label}`}
    >
      <Globe size={16} />
      <span>
        {current.flag} {current.label}
      </span>
    </button>
  );
}
