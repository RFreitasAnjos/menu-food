"use client";

import { useLanguage } from "@/app/contexts/LanguageContext";

export default function PromotionSection() {
   const { t } = useLanguage();

   return (
      <section className="bg-[var(--primary-color)] text-[var(--on-primary-color)] mb-4 py-12 px-4 text-center">
        <h2 className="text-3xl text-yellow-400 font-bold mb-4">{t("promo_title")}</h2>
        <p className="text-lg mb-6">{t("promo_desc")}</p>
        <a
          href="/"
          className="inline-block bg-white text-[var(--primary-color)]   font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
        >
          {t("promo_cta")}
        </a>
      </section>         
   );
}