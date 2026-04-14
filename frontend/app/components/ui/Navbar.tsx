"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
   ShoppingCart,
   User,
   UtensilsCrossed,
   History,
   Menu,
   X,
   ChevronDown,
   LogOut,
   UserCircle,
} from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useAuth } from "@/app/contexts/AuthContext";
import ButtonLanguage from "./ButtonLanguage";
import DarkModeButton from "./DarkModeButton";

export default function Navbar() {
   const { totalItems } = useCart();
   const { t } = useLanguage();
   const { isLoggedIn, logout } = useAuth();
   const router = useRouter();
   const [menuOpen, setMenuOpen] = useState(false);
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const close = () => setMenuOpen(false);

   // Fecha dropdown ao clicar fora
   useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
         if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setDropdownOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   const handleLogout = () => {
      logout();
      setDropdownOpen(false);
      setMenuOpen(false);
      router.push("/");
   };

   return (
      <nav className="bg-[var(--primary-color)] text-white shadow-md sticky top-0 z-50">
         {/* Main bar */}
         <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link
               href="/"
               onClick={close}
               className="flex items-center gap-2 font-bold text-xl flex-shrink-0"
               style={{ fontFamily: "var(--font-merienda)" }}
            >
               <UtensilsCrossed size={26} />
               <span>MenuFood</span>
            </Link>

            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-5">


               <ButtonLanguage />
               <DarkModeButton className="text-white cursor-pointer" />

               <Link
                  href="/cart"
                  className="relative flex items-center hover:opacity-80 transition-opacity"
               >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                     <span className="absolute -top-2 -right-2 bg-white text-[var(--primary-color)] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                        {totalItems > 99 ? "99+" : totalItems}
                     </span>
                  )}
               </Link>

               {/* Auth — desktop */}
               {isLoggedIn ? (
                  <div className="relative" ref={dropdownRef}>
                     <button
                        onClick={() => setDropdownOpen((o) => !o)}
                        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-full px-3 py-1.5 text-sm"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                     >
                        <UserCircle size={18} />
                        <ChevronDown
                           size={14}
                           className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        />
                     </button>

                     {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden z-50">
                           <Link
                              href="/profile"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                           >
                              <User size={15} />
                              {t("nav_profile") !== "nav_profile" ? t("nav_profile") : "Meu Perfil"}
                           </Link>
                           <Link
                              href="/historic"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                           >
                              <History size={15} />
                              {t("nav_historic")}
                           </Link>
                           <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                           >
                              <LogOut size={15} />
                              {t("nav_logout") !== "nav_logout" ? t("nav_logout") : "Sair"}
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <Link href="/login">
                     <button className="flex items-center cursor-pointer gap-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-full px-3 py-1.5 text-sm">
                        <User size={16} />
                        {t("nav_login")}
                     </button>
                  </Link>
               )}
            </div>

            {/* Mobile: cart badge + hamburger */}
            <div className="flex sm:hidden items-center gap-4">
               <Link
                  href="/cart"
                  onClick={close}
                  className="relative flex items-center hover:opacity-80 transition-opacity"
               >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                     <span className="absolute -top-2 -right-2 bg-white text-[var(--primary-color)] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                        {totalItems > 99 ? "99+" : totalItems}
                     </span>
                  )}
               </Link>

               <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="p-1 hover:opacity-80 transition-opacity"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
               >
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
            </div>
         </div>

         {/* Mobile dropdown */}
         {menuOpen && (
            <div className="sm:hidden border-t border-white/20 bg-[var(--primary-color)] px-4 py-4 flex flex-col gap-4">
               <Link
                  href="/historic"
                  onClick={close}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm"
               >
                  <History size={18} />
                  {t("nav_historic")}
               </Link>

               {/* Auth — mobile */}
               {isLoggedIn ? (
                  <>
                     <Link
                        href="/profile"
                        onClick={close}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm"
                     >
                        <UserCircle size={18} />
                        {t("nav_profile") !== "nav_profile" ? t("nav_profile") : "Meu Perfil"}
                     </Link>
                     <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm text-left text-red-200"
                     >
                        <LogOut size={18} />
                        {t("nav_logout") !== "nav_logout" ? t("nav_logout") : "Sair"}
                     </button>
                  </>
               ) : (
                  <Link
                     href="/login"
                     onClick={close}
                     className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm"
                  >
                     <User size={18} />
                     {t("nav_login")}
                  </Link>
               )}

               <div className="pt-1 border-t border-white/20 flex items-center justify-between">
                  <ButtonLanguage />
                  <DarkModeButton className="text-white cursor-pointer" />
               </div>
            </div>
         )}
      </nav>
   );
}

