"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface DarkModeButtonProps {
  className?: string;
}

export default function DarkModeButton({ className = "" }: DarkModeButtonProps) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? t("dark_mode_on") : t("dark_mode_off")}
      className={`flex items-center justify-center rounded-full p-1.5 transition-opacity hover:opacity-80 ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
