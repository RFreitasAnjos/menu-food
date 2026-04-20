"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Edit2, Loader2, MapPin } from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useAuth } from "@/app/contexts/AuthContext";
import OrderModal from "@/app/components/ui/OrderModal";
import { checkoutApi, userApi, type AddressResponse, type CreateAddressRequest } from "@/api/api";
import type { CartItem } from "@/app/types";

type AddressMode = "saved" | "new";

interface AddressFormData {
   street: string;
   number: string;
   complement: string;
   neighborhood: string;
   city: string;
   state: string;
   zipCode: string;
}

const emptyAddressForm: AddressFormData = {
   street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "",
};

export default function CartPage() {
   const { items, removeItem, updateQuantity, clearCart, totalPrice, editItem } = useCart();
   const { t } = useLanguage();
   const { user, isLoggedIn } = useAuth();
   const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
   const [checkoutLoading, setCheckoutLoading] = useState(false);
   const [checkoutError, setCheckoutError] = useState<string | null>(null);

   // Address state
   const [savedAddresses, setSavedAddresses] = useState<AddressResponse[]>([]);
   const [addressLoading, setAddressLoading] = useState(false);
   const [addressMode, setAddressMode] = useState<AddressMode>("new");
   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
   const [newAddress, setNewAddress] = useState<AddressFormData>(emptyAddressForm);

   useEffect(() => {
      if (!isLoggedIn || !user) return;
      setAddressLoading(true);
      userApi
         .listAddresses(user.id)
         .then((addrs) => {
            setSavedAddresses(addrs);
            if (addrs.length > 0) {
               setAddressMode("saved");
               setSelectedAddressId(addrs[0].id);
            }
         })
         .catch(() => {})
         .finally(() => setAddressLoading(false));
   }, [isLoggedIn, user]);

   const updateField = (field: keyof AddressFormData, value: string) =>
      setNewAddress((prev) => ({ ...prev, [field]: value }));

   const handleFinalize = async () => {
      if (items.length === 0) return;
      if (!isLoggedIn || !user) {
         window.location.href = "/login?redirect=/cart";
         return;
      }

      // Validate address
      if (addressMode === "new") {
         const { street, number, neighborhood, city, state, zipCode } = newAddress;
         if (!street || !number || !neighborhood || !city || !state || !zipCode) {
            setCheckoutError(t("cart_address_required"));
            return;
         }
      } else if (!selectedAddressId) {
         setCheckoutError(t("cart_address_required"));
         return;
      }

      setCheckoutLoading(true);
      setCheckoutError(null);

      try {
         const orderItems = items.map((item) => ({
            productId: item.food.id,
            quantity: item.quantity,
            optionsIds: item.extras.map((e) => e.id),
         }));

         const checkoutData =
            addressMode === "saved" && selectedAddressId
               ? { userId: user.id, items: orderItems, addressId: selectedAddressId }
               : {
                    userId: user.id,
                    items: orderItems,
                    address: {
                       street: newAddress.street,
                       number: newAddress.number,
                       complement: newAddress.complement || undefined,
                       neighborhood: newAddress.neighborhood,
                       city: newAddress.city,
                       state: newAddress.state,
                       zipCode: newAddress.zipCode,
                    } satisfies CreateAddressRequest,
                 };

         const response = await checkoutApi.createCheckout(checkoutData);
         clearCart();
         // Mantém loading=true — a página vai navegar, não precisa resetar
         window.location.href = response.checkoutUrl;
      } catch (err) {
         setCheckoutError(
            err instanceof Error ? err.message : "Erro ao iniciar pagamento. Tente novamente."
         );
         setCheckoutLoading(false);
      }
      // Não há finally aqui — loading só é removido em caso de erro
   };

   if (items.length === 0) {
      return (
         <main className="w-full max-w-2xl md:max-w-4xl xl:max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16 flex flex-col items-center gap-6 flex-1">
            <ShoppingBag size={80} className="text-gray-200" />
            <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">{t("cart_title")}</h1>
            <p className="text-gray-400">{t("cart_empty")}</p>
            <Link
               href="/"
               className="flex items-center gap-2 bg-(--primary-color) text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
               <ArrowLeft size={18} />
               {t("cart_go_menu")}
            </Link>
         </main>
      );
   }

   return (
      <>
      {/* Overlay de redirecionamento para pagamento */}
      {checkoutLoading && (
         <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-5 p-8 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl border border-gray-100 dark:border-zinc-700">
               <Loader2 size={48} className="animate-spin text-(--primary-color)" />
               <div className="text-center">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
                     Redirecionando para o pagamento
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                     Aguarde, estamos preparando seu checkout...
                  </p>
               </div>
            </div>
         </div>
      )}
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
                     <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-100 dark:bg-zinc-700 overflow-hidden shrink-0">
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

                           <div className="flex items-center gap-1 ml-2 shrink-0">
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

                           <span className="font-bold text-(--primary-color)">
                              {lineTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                           </span>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* ENDEREÇO DE ENTREGA */}
         {isLoggedIn && (
            <div className="mt-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4 md:p-5">
               <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-(--primary-color)" />
                  {t("addr_select_title")}
               </h2>

               {addressLoading ? (
                  <p className="text-sm text-gray-400 animate-pulse">{t("addr_loading")}</p>
               ) : (
                  <>
                     {savedAddresses.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                           {savedAddresses.map((addr) => (
                              <label
                                 key={addr.id}
                                 className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-lg border transition-colors ${
                                    addressMode === "saved" && selectedAddressId === addr.id
                                       ? "border-(--primary-color) bg-orange-50 dark:bg-orange-950/20"
                                       : "border-transparent hover:bg-gray-50 dark:hover:bg-zinc-700"
                                 }`}
                              >
                                 <input
                                    type="radio"
                                    name="address"
                                    value={addr.id}
                                    checked={addressMode === "saved" && selectedAddressId === addr.id}
                                    onChange={() => {
                                       setAddressMode("saved");
                                       setSelectedAddressId(addr.id);
                                    }}
                                    className="mt-0.5 accent-(--primary-color)"
                                 />
                                 <span className="text-sm text-gray-700 dark:text-gray-200">
                                    {addr.street}, {addr.number}
                                    {addr.complement ? `, ${addr.complement}` : ""} —{" "}
                                    {addr.neighborhood}, {addr.city}/{addr.state}
                                    {addr.zipCode && (
                                       <span className="text-gray-400"> · {addr.zipCode}</span>
                                    )}
                                 </span>
                              </label>
                           ))}

                           <label
                              className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-lg border transition-colors ${
                                 addressMode === "new"
                                    ? "border-(--primary-color) bg-orange-50 dark:bg-orange-950/20"
                                    : "border-transparent hover:bg-gray-50 dark:hover:bg-zinc-700"
                              }`}
                           >
                              <input
                                 type="radio"
                                 name="address"
                                 value="new"
                                 checked={addressMode === "new"}
                                 onChange={() => setAddressMode("new")}
                                 className="mt-0.5 accent-(--primary-color)"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                 {t("addr_use_new")}
                              </span>
                           </label>
                        </div>
                     )}

                     {(addressMode === "new" || savedAddresses.length === 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                           <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                 {t("addr_street")} *
                              </label>
                              <input
                                 type="text"
                                 value={newAddress.street}
                                 onChange={(e) => updateField("street", e.target.value)}
                                 className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/40"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                 {t("addr_number")} *
                              </label>
                              <input
                                 type="text"
                                 value={newAddress.number}
                                 onChange={(e) => updateField("number", e.target.value)}
                                 className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/40"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                 {t("addr_complement")}
                              </label>
                              <input
                                 type="text"
                                 value={newAddress.complement}
                                 onChange={(e) => updateField("complement", e.target.value)}
                                 className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/40"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                 {t("addr_neighborhood")} *
                              </label>
                              <input
                                 type="text"
                                 value={newAddress.neighborhood}
                                 onChange={(e) => updateField("neighborhood", e.target.value)}
                                 className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/40"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                 {t("addr_city")} *
                              </label>
                              <input
                                 type="text"
                                 value={newAddress.city}
                                 onChange={(e) => updateField("city", e.target.value)}
                                 className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/40"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                 {t("addr_state")} *
                              </label>
                              <input
                                 type="text"
                                 value={newAddress.state}
                                 onChange={(e) => updateField("state", e.target.value)}
                                 maxLength={2}
                                 className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/40"
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                 {t("addr_zipcode")} *
                              </label>
                              <input
                                 type="text"
                                 value={newAddress.zipCode}
                                 onChange={(e) => updateField("zipCode", e.target.value)}
                                 placeholder="00000-000"
                                 className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-(--primary-color)/40"
                              />
                           </div>
                        </div>
                     )}
                  </>
               )}
            </div>
         )}

         {/* RESUMO */}
         <div className="mt-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4 md:p-5">
            <div className="flex justify-between items-center">
               <span className="text-gray-600 dark:text-gray-300 font-medium">{t("cart_total")}</span>
               <span className="text-2xl font-bold text-(--primary-color)">
                  {totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
               </span>
            </div>

            {checkoutError && (
               <p className="mt-3 text-sm text-red-600 dark:text-red-400 text-center">
                  {checkoutError}
               </p>
            )}

            <button
               onClick={handleFinalize}
               disabled={checkoutLoading}
               className="mt-4 w-full bg-(--primary-color) text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
               {checkoutLoading ? (
                  <>
                     <Loader2 size={20} className="animate-spin" />
                     Aguarde...
                  </>
               ) : (
                  t("cart_finalize")
               )}
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