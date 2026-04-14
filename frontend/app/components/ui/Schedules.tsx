"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";

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

  const dayKeys = [
    "schedule_sun",
    "schedule_mon",
    "schedule_tue",
    "schedule_wed",
    "schedule_thu",
    "schedule_fri",
    "schedule_sat",
  ];

  const dayFallbacks = [
    "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb",
  ];

  const today = new Date().getDay();

  return (
    <div className="space-y-1 text-sm">
      {SCHEDULE.map((hours, index) => {
        const isToday = index === today;
        const label = t(dayKeys[index]) !== dayKeys[index] ? t(dayKeys[index]) : dayFallbacks[index];
        const closed = !hours || hours.length < 2;

        return (
          <div
            key={index}
            className={`flex justify-between items-center px-3 py-2 rounded-lg transition-colors ${
              isToday
                ? "bg-[var(--primary-color)]/15 border border-[var(--primary-color)]/30"
                : "hover:bg-white/5"
            }`}
          >
            
            
            <span className={isToday ? "text-white font-semibold" : "text-gray-400"}>
              {label}
              {isToday && (
                <span className="ml-2 text-[10px] font-normal text-[var(--primary-color)] uppercase tracking-wide">
                  {t("schedule_today") !== "schedule_today" ? t("schedule_today") : "hoje"}
                </span>
              )}
            </span>
            <span className={isToday ? "text-[var(--primary-color)] font-semibold" : "text-gray-500"}>
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
    </div>
  );
}
