"use client";

import { UtensilsCrossed, Clock, MapPin, ChevronRight } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import SocialMedia from "./SocialMedia";
import Schedules from "./Schedules";

export default function Footer() {
   const { t } = useLanguage();

   return (
      <footer className="bg-[var(--footer-background)] text-gray-300 mt-auto">

         {/* === MAIN CONTENT === */}
         <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

               {/* ── COLUNA 1: MARCA + CONTATO ── */}
               <div className="flex flex-col gap-5">
                  {/* Logo */}
                  <div
                     className="flex items-center gap-2 text-white font-bold text-2xl"
                     style={{ fontFamily: "var(--font-merienda)" }}
                  >
                     <UtensilsCrossed size={26} className="text-[var(--primary-color)]" />
                     MenuFood
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                     {t("footer_slogan")}
                  </p>

                  {/* Endereço */}
                  <div className="flex items-start gap-2 text-sm text-gray-400">
                     <MapPin size={16} className="text-[var(--primary-color)] mt-0.5 flex-shrink-0" />
                     <span>Av. Bernardo Vieira de Melo, 2750<br />Piedade, Jaboatão dos Guararapes – PE</span>
                  </div>

                  {/* Redes sociais */}
                  <SocialMedia />
               </div>

               {/* ── COLUNA 2: HORÁRIOS ── */}
               <div className="flex flex-col gap-4">
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                     <Clock size={18} className="text-[var(--primary-color)]" />
                     {t("footer_hours_title")}
                  </h3>


                  <Schedules />
               </div>

               {/* ── COLUNA 3: MAPA ── */}
               <div className="flex flex-col gap-4">
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                     <MapPin size={18} className="text-[var(--primary-color)]" />
                     {t("footer_address_label")}
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-gray-800 h-[200px]">
                     <iframe
                        src="https://www.google.com/maps?q=Av.+Bernardo+Vieira+de+Melo,+2750,+Piedade,+Jaboat%C3%A3o+dos+Guararapes+-+PE&output=embed"
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                     />
                  </div>
                  <a
                     href="https://maps.google.com/?q=Av.+Bernardo+Vieira+de+Melo,+2750,+Piedade,+Jaboatão+dos+Guararapes"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 text-sm text-[var(--primary-color)] hover:underline"
                  >
                     <ChevronRight size={14} />
                     Ver no Google Maps
                  </a>
               </div>

            </div>
         </div>

         {/* === BOTTOM BAR === */}
         <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
               <span>&copy; {new Date().getFullYear()} MenuFood. {t("footer_rights")}</span>
               <span>
                  Powered by{" "}
                  <a
                     href="https://rfreitasanjos.github.io/meu-portifolio/"
                     className="text-[var(--primary-color)] hover:underline"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     RFreitas Developer
                  </a>
               </span>
            </div>
         </div>

      </footer>
   );
}
