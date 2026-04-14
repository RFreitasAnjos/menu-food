"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { userApi, type OrderResponse } from "@/api/api";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PREPARING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  READY: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DELIVERED: "bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-400",
  CANCELLED: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function HistoricPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getMe()
      .then((user) => userApi.getOrders(user.id))
      .then((data) => setOrders(data))
      .catch((err: unknown) => {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
        } else {
          setOrders([]);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center flex-1 py-24">
        <p className="text-gray-400 dark:text-gray-500 animate-pulse">
          {t("profile_loading")}
        </p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-2xl md:max-w-4xl xl:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 flex-1">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {t("hist_title")}
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 md:py-24">
          <ShoppingBag size={80} className="text-gray-200" />
          <p className="text-gray-400">{t("hist_empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order, index) => {
            const statusClass =
              STATUS_COLORS[order.status] ??
              "bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-400";

            return (
              <div
                key={order.id}
                className="bg-surface-1 rounded-xl shadow-sm border border-border p-4 md:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    #{orders.length - index}
                  </span>
                </div>

                <div className="mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-200">
                      {item.quantity}× {item.productName}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {Number(item.totalPrice).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span className="text-gray-700 dark:text-gray-200">
                    {t("hist_total")}
                  </span>
                  <span className="text-(--primary-color)">
                    {Number(order.totalPrice).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
