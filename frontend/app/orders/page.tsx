"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, ShoppingBag, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { userApi, type OrderResponse } from "@/api/api";

const STATUS_COLORS: Record<string, string> = {
  CREATED:          "bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-400",
  WAITING_PAYMENT:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID:             "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  IN_PREPARATION:   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SENT:             "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  DELIVERED:        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELED:         "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABEL: Record<string, string> = {
  CREATED:         "Criado",
  WAITING_PAYMENT: "Aguardando Pagamento",
  PAID:            "Pago",
  IN_PREPARATION:  "Em Preparo",
  SENT:            "Enviado",
  DELIVERED:       "Entregue",
  CANCELED:        "Cancelado",
};

export default function HistoricPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");
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

      {/* Banner de retorno do Mercado Pago */}
      {payment === "success" && (
        <div className="mb-6 flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3">
          <CheckCircle2 size={20} className="shrink-0" />
          <span className="text-sm font-medium">Pagamento confirmado! Seu pedido está sendo processado.</span>
        </div>
      )}
      {payment === "pending" && (
        <div className="mb-6 flex items-center gap-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-xl px-4 py-3">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">Pagamento pendente. Assim que confirmado, seu pedido será processado.</span>
        </div>
      )}

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
            const statusLabel = STATUS_LABEL[order.status] ?? order.status;

            return (
              <div
                key={order.id}
                className="bg-surface-1 rounded-xl shadow-sm border border-border p-4 md:p-5 flex flex-col"
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
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}`}>
                    {statusLabel}
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

                <Link
                  href={`/orders/${order.id}`}
                  className="mt-4 flex items-center justify-center gap-1.5 w-full text-sm font-medium text-(--primary-color) border border-(--primary-color) rounded-lg py-2 hover:bg-(--primary-color) hover:text-white transition-colors"
                >
                  Ver detalhes
                  <ChevronRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

