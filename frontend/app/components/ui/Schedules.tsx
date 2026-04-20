"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import isOpenNow from "@/public/utils/TimeNow";

/** Horário de cada dia: [abertura, fechamento] ou null se fechado */
const SCHEDULE: (string | null)[][] = [
  ["17:00", "00:00"], // Domingo
  ["17:00", "23:00"], // Segunda
  ["17:00", "23:00"], // Terça
  ["17:00", "23:00"], // Quarta
  ["17:00", "23:00"], // Quinta
  ["17:00", "00:00"], // Sexta
  ["17:00", "00:00"], // Sábado
];

export default function Schedules() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const dayKeys = [
    "schedule_sun",
    "schedule_mon",
    "schedule_tue",
    "schedule_wed",
    "schedule_thu",
    "schedule_fri",
    "schedule_sat",
  ];

  const dayFallbacks = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const today = new Date().getDay();
  const isOpen = isOpenNow();

  const visibleDays = expanded ? SCHEDULE.map((_, i) => i) : [today];

  return (
    <div className="space-y-1 text-sm">
      {visibleDays.map((index) => {
        const isToday = index === today;
        const hours = SCHEDULE[index];
        const label = t(dayKeys[index]) !== dayKeys[index] ? t(dayKeys[index]) : dayFallbacks[index];
        const closed = !hours || hours.length < 2;

        return (
          <div
            key={index}
            className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors ${
              isToday
                ? isOpen
                  ? "bg-green-500/15 border border-green-500/30"
                  : "bg-[var(--primary-color)]/15 border border-[var(--primary-color)]/30"
                : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={isToday ? "text-white font-semibold" : "text-gray-400"}>
                {label}
              </span>
              {isToday && (
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                    isOpen
                      ? "text-green-400 bg-green-500/20"
                      : "text-red-400 bg-red-500/15"
                  }`}
                >
                  {isOpen
                    ? t("schedule_open") !== "schedule_open" ? t("schedule_open") : "Aberto"
                    : t("schedule_closed_now") !== "schedule_closed_now" ? t("schedule_closed_now") : "Fechado"}
                </span>
              )}
            </div>
            <span
              className={
                isToday
                  ? isOpen
                    ? "text-green-400 font-semibold"
                    : "text-[var(--primary-color)] font-semibold"
                  : "text-gray-500"
              }
            >
              {closed ? (
                <span className="text-gray-600 text-xs">
                  {t("schedule_closed") !== "schedule_closed" ? t("schedule_closed") : "Fechado"}
                </span>
              ) : (
                `${hours[0]} – ${hours[1]}`
              )}
            </span>
          </div>
        );
      })}

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-center gap-1.5 mt-1 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
      >
        {expanded ? (
          <>
            <ChevronUp size={13} />
            {t("schedule_show_less") !== "schedule_show_less" ? t("schedule_show_less") : "Recolher horários"}
          </>
        ) : (
          <>
            <ChevronDown size={13} />
            {t("schedule_show_all") !== "schedule_show_all" ? t("schedule_show_all") : "Ver todos os horários"}
          </>
        )}
      </button>
    </div>
  );
}
