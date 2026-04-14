"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Language } from "@/app/types";

import en from "@/public/i18n/en.json";
import ptBr from "@/public/i18n/pt-br.json";
import es from "@/public/i18n/es.json";

type Translations = Record<string, string>;

const translations: Record<Language, Translations> = {
  en,
  "pt-br": ptBr,
  es,
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "pt-br",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt-br");

  useEffect(() => {
    const saved = localStorage.getItem("menu-language") as Language | null;
    if (saved && saved in translations) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("menu-language", lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
