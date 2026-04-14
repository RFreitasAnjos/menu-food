"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Plus, Minus, ShoppingCart, Save } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useCart } from "@/app/contexts/CartContext";
import { productApi, type ProductOptionGroupResponse } from "@/api/api";
import type { FoodItem, Extra, CartItem } from "@/app/types";

interface OrderModalProps {
  food: FoodItem | null;
  onClose: () => void;
  /** When provided, the modal opens in edit mode pre-populated with this cart item */
  editCartItem?: CartItem;
  /** Called when saving edits; receives the updated fields */
  onSaveEdit?: (uid: string, quantity: number, extras: Extra[], observation: string) => void;
}

export default function OrderModal({ food, onClose, editCartItem, onSaveEdit }: OrderModalProps) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState("");

  // Option groups fetched from the backend
  const [optionGroups, setOptionGroups] = useState<ProductOptionGroupResponse[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  /**
   * selectedPerGroup: groupId â†’ Set of selected optionIds
   * Radio-like groups (maxSelection === 1) replace; checkbox groups accumulate.
   */
  const [selectedPerGroup, setSelectedPerGroup] = useState<Record<string, Set<string>>>({});

  // â”€â”€ Fetch option groups when product changes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!food) return;
    setOptionGroups([]);
    setLoadingOptions(true);
    productApi
      .getById(food.id)
      .then((product) => {
        setOptionGroups(product.optionGroups ?? []);
      })
      .catch(() => setOptionGroups([]))
      .finally(() => setLoadingOptions(false));
  }, [food?.id]);

  // â”€â”€ Pre-populate state when modal opens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!food) return;

    if (editCartItem) {
      setQuantity(editCartItem.quantity);
      setObservation(editCartItem.observation);

      // Rebuild selectedPerGroup from the saved extras + fetched groups
      if (optionGroups.length > 0 && editCartItem.extras.length > 0) {
        const selectedIds = new Set(editCartItem.extras.map((e) => e.id));
        const rebuilt: Record<string, Set<string>> = {};
        for (const group of optionGroups) {
          const matches = group.options
            .filter((opt) => selectedIds.has(opt.id))
            .map((opt) => opt.id);
          if (matches.length > 0) {
            rebuilt[group.id] = new Set(matches);
          }
        }
        setSelectedPerGroup(rebuilt);
      } else {
        setSelectedPerGroup({});
      }
    } else {
      setQuantity(1);
      setObservation("");
      setSelectedPerGroup({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [food?.id, editCartItem?.uid, optionGroups]);

  // â”€â”€ Close on Escape â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // â”€â”€ Prevent body scroll when open â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (food) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [food]);

  // â”€â”€ Toggle option selection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const toggleOption = useCallback(
    (groupId: string, optionId: string, maxSelection: number) => {
      setSelectedPerGroup((prev) => {
        const current = new Set(prev[groupId] ?? []);

        if (current.has(optionId)) {
          current.delete(optionId);
        } else {
          if (maxSelection === 1) {
            // Radio behaviour: clear previous and select new
            return { ...prev, [groupId]: new Set([optionId]) };
          }
          if (current.size < maxSelection) {
            current.add(optionId);
          }
        }
        return { ...prev, [groupId]: current };
      });
    },
    []
  );

  // â”€â”€ Derive flat extras array from selections + groups â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const selectedExtras: Extra[] = optionGroups.flatMap((group) => {
    const selectedIds = selectedPerGroup[group.id] ?? new Set();
    return group.options
      .filter((opt) => selectedIds.has(opt.id))
      .map((opt) => ({ id: opt.id, name: opt.name, price: Number(opt.price) }));
  });

  // â”€â”€ Confirm action â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleAdd = () => {
    if (!food) return;
    if (editCartItem && onSaveEdit) {
      onSaveEdit(editCartItem.uid, quantity, selectedExtras, observation);
    } else {
      addItem(food, quantity, selectedExtras, observation);
    }
    onClose();
  };

  const isEditMode = !!editCartItem;

  if (!food) return null;

  const extrasTotal = selectedExtras.reduce((s, e) => s + e.price, 0);
  const total = (food.value + extrasTotal) * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header image */}
        <div className="relative h-40 bg-gray-100 dark:bg-zinc-700 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={food.img}
            alt={food.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full p-1.5 hover:bg-white transition-colors"
            aria-label={t("modal_cancel")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-5 overflow-y-auto flex-1">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {isEditMode
              ? (t("modal_edit_title") !== "modal_edit_title" ? t("modal_edit_title") : `Editar â€” ${food.title}`)
              : food.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{food.description}</p>

          {/* Quantity */}
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t("modal_quantity")}
            </label>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-lg w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Option Groups */}
          {loadingOptions && (
            <p className="mt-4 text-sm text-gray-400 animate-pulse">
              {t("loading_text")}
            </p>
          )}

          {!loadingOptions && optionGroups.map((group) => {
            const selectedIds = selectedPerGroup[group.id] ?? new Set<string>();
            const isRadio = group.maxSelection === 1;
            const remaining = group.maxSelection - selectedIds.size;

            return (
              <div key={group.id} className="mt-5">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {group.name}
                    </span>
                    {group.required && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  {!isRadio && (
                    <span className="text-xs text-gray-400">
                      {group.minSelection > 0
                        ? `${group.minSelection}â€“${group.maxSelection} opções`
                        : `até ${group.maxSelection} opções `}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {group.options.map((opt) => {
                    const checked = selectedIds.has(opt.id);
                    // Radio groups: nunca desabilita outras opções (troca é sempre permitida)
                    // Checkbox groups: desabilita quando o limite máximo foi atingido
                    const disabled = !isRadio && !checked && remaining === 0;

                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between cursor-pointer p-2 rounded-lg transition-colors ${
                          disabled
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-50 dark:hover:bg-zinc-700"
                        } ${checked ? "bg-gray-50 dark:bg-zinc-700" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type={isRadio ? "radio" : "checkbox"}
                            name={isRadio ? `group-${group.id}` : undefined}
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleOption(group.id, opt.id, group.maxSelection)}
                            className="accent-[var(--primary-color)] w-4 h-4"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {opt.name}
                          </span>
                        </div>
                        {Number(opt.price) > 0 && (
                          <span className="text-sm text-gray-400">
                            +{Number(opt.price).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Observations */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t("modal_obs")}
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder={t("modal_obs_placeholder")}
              rows={2}
              className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] resize-none"
            />
          </div>
        </div>

        {/* Footer: total + add button */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-zinc-700 flex-shrink-0">
          <div>
            <span className="text-xs text-gray-500">{t("modal_total")}</span>
            <p className="text-xl font-bold text-[var(--primary-color)]">
              {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all"
          >
            {isEditMode ? <Save size={18} /> : <ShoppingCart size={18} />}
            {isEditMode
              ? (t("modal_save") !== "modal_save" ? t("modal_save") : "Salvar")
              : t("modal_add")}
          </button>
        </div>
      </div>
    </div>
  );
}
