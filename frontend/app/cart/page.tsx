"use client";

import Link from "next/link";
import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Edit2 } from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import OrderModal from "@/app/components/ui/OrderModal";
import type { CartItem } from "@/app/types";

export default function CartPage() {
   const { items, removeItem, updateQuantity, clearCart, totalPrice, editItem } = useCart();
   const { t } = useLanguage();
   const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

   const handleFinalize = () => {
      if (items.length === 0) return;
      const order = {
         id: Date.now().toString(),
         date: new Date().toISOString(),
         items,
         total: totalPrice,
      };
      try {
         const raw = localStorage.getItem("menu-orders");
         const existing = raw ? (JSON.parse(raw) as unknown[]) : [];
         localStorage.setItem("menu-orders", JSON.stringify([order, ...existing]));
      } catch {
         // ignore storage errors
      }
      clearCart();
      alert(t("cart_confirmed"));
   };

   if (items.length === 0) {
      return (
         <main className="w-full max-w-2xl md:max-w-4xl xl:max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16 flex flex-col items-center gap-6 flex-1">
            <ShoppingBag size={80} className="text-gray-200" />
            <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">{t("cart_title")}</h1>
            <p className="text-gray-400">{t("cart_empty")}</p>
            <Link
               href="/"
               className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
               <ArrowLeft size={18} />
               {t("cart_go_menu")}
            </Link>
         </main>
      );
   }

   return (
      <>
      <main className="w-full max-w-2xl md:max-w-4xl xl:max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-6 flex-1">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("cart_title")}</h1>
            <button
               onClick={clearCart}
               className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
            >

               <Trash2 size={14} />
               {t("cart_clear")}
            </button>
         </div>

         {/* LISTA CONTINUA EM COLUNA */}
         <div className="space-y-4">
            {items.map((item) => {
               const foodPrice = item.food.value;
               const extrasTotal = item.extras.reduce((s, e) => s + e.price, 0);
               const lineTotal = (foodPrice + extrasTotal) * item.quantity;

               return (
                  <div
                     key={item.uid}
                     className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4 md:p-5 flex gap-4"
                  >
                     <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
                        <img
                           src={item.food.img}
                           alt={item.food.title}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                           }}
                        />
                     </div>

                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                           <div className="flex flex-col">
                           <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                              {item.food.title}
                           </h3>
                           <h3>
                              {item.food.description}
                           </h3>
                           </div>

                           <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                              <button
                                 onClick={() => setEditingCartItem(item)}
                                 className="p-1.5 text-gray-300 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                 aria-label={t("cart_edit") !== "cart_edit" ? t("cart_edit") : "Editar item"}
                              >
                                 <Edit2 size={14} />
                              </button>
                              <button
                                 onClick={() => removeItem(item.uid)}
                                 className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                 aria-label={t("cart_remove")}
                              >
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </div>

                        {item.extras.length > 0 && (
                           <p className="text-xs text-gray-400 mt-0.5">
                              {t("cart_extras")}:{" "}
                              {item.extras.map((e) => e.name).join(", ")}
                           </p>
                        )}

                        {item.observation && (
                           <p className="text-xs text-gray-400 truncate">
                              {t("cart_obs")} {item.observation}
                           </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                           <div className="flex items-center gap-2">
                              <button
                                 onClick={() => updateQuantity(item.uid, item.quantity - 1)}
                                 className="w-7 h-7 rounded-full border border-gray-200 dark:border-zinc-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                              >
                                 <Minus size={12} />
                              </button>

                              <span className="font-semibold w-6 text-center">
                                 {item.quantity}
                              </span>

                              <button
                                 onClick={() => updateQuantity(item.uid, item.quantity + 1)}
                                 className="w-7 h-7 rounded-full border border-gray-200 dark:border-zinc-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                              >
                                 <Plus size={12} />
                              </button>
                           </div>

                           <span className="font-bold text-[var(--primary-color)]">
                              {lineTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                           </span>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* RESUMO */}
         <div className="mt-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4 md:p-5">
            <div className="flex justify-between items-center">
               <span className="text-gray-600 dark:text-gray-300 font-medium">{t("cart_total")}</span>
               <span className="text-2xl font-bold text-[var(--primary-color)]">
                  {totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
               </span>
            </div>

            <button
               onClick={handleFinalize}
               className="mt-4 w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
               {t("cart_finalize")}
            </button>
         </div>
      </main>

      {/* Edit modal — reuses OrderModal in edit mode */}
      <OrderModal
         food={editingCartItem?.food ?? null}
         onClose={() => setEditingCartItem(null)}
         editCartItem={editingCartItem ?? undefined}
         onSaveEdit={(uid, qty, extras, obs) => {
            editItem(uid, qty, extras, obs);
            setEditingCartItem(null);
         }}
      />
   </>);
}