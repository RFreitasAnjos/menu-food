"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Loader2,
  CreditCard,
} from "lucide-react";
import { orderApi, type OrderResponse } from "@/api/api";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";

const STATUS_LABEL: Record<string, string> = {
  CREATED:         "Criado",
  WAITING_PAYMENT: "Aguardando Pagamento",
  PAID:            "Pago",
  IN_PREPARATION:  "Em Preparo",
  SENT:            "Enviado",
  DELIVERED:       "Entregue",
  CANCELED:        "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  CREATED:         "bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-400",
  WAITING_PAYMENT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID:            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  IN_PREPARATION:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SENT:            "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  DELIVERED:       "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELED:        "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrderPage() {
  return (
    <Suspense>
      <OrderDetails />
    </Suspense>
  );
}

function OrderDetails() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const payment = searchParams.get("payment");

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const handlePayNow = () => {
    if (!params.id) return;
    setPayLoading(true);
    orderApi
      .getPaymentLink(params.id)
      .then((res) => { window.location.href = res.checkoutUrl; })
      .catch(() => { alert("Não foi possível gerar o link de pagamento. Tente novamente."); })
      .finally(() => setPayLoading(false));
  };

  useEffect(() => {
    if (!params.id) return;
    orderApi
      .getById(params.id)
      .then(setOrder)
      .catch((err: unknown) => {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
        } else {
          setError("Não foi possível carregar o pedido.");
        }
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center flex-1 py-24">
        <Loader2 size={32} className="animate-spin text-(--primary-color)" />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex flex-col items-center justify-center flex-1 py-24 gap-4">
        <ShoppingBag size={64} className="text-gray-200" />
        <p className="text-red-500">{error ?? "Pedido não encontrado."}</p>
        <Link href="/orders" className="text-sm text-(--primary-color) hover:underline">
          Ver todos os pedidos
        </Link>
      </main>
    );
  }

  const statusLabel = STATUS_LABEL[order.status] ?? order.status;
  const statusClass = STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600";

  const whatsappText = encodeURIComponent(
    `Olá! Tenho uma dúvida sobre meu pedido #${order.id.slice(0, 8).toUpperCase()}.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

  return (
    <main className="w-full max-w-2xl mx-auto px-4 md:px-6 py-6 flex-1">
      {/* Voltar */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-(--primary-color) transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Todos os pedidos
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Pedido #{order.id.slice(0, 8).toUpperCase()}
      </h1>

      {/* Banner de status do pagamento */}
      {payment === "success" && (
        <div className="mb-5 flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3">
          <CheckCircle2 size={20} className="shrink-0" />
          <span className="text-sm font-medium">
            Pagamento confirmado! Seu pedido está sendo processado.
          </span>
        </div>
      )}
      {payment === "pending" && (
        <div className="mb-5 flex items-center gap-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-xl px-4 py-3">
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">
            Pagamento pendente. Assim que confirmado, seu pedido será processado.
          </span>
        </div>
      )}

      {/* Card principal */}
      <div className="bg-surface-1 rounded-2xl shadow-sm border border-border p-5 md:p-6 space-y-5">

        {/* Status + data */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusClass}`}>
            {statusLabel}
          </span>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={15} />
            <span>{new Date(order.createdAt).toLocaleString("pt-BR")}</span>
          </div>
        </div>

        {/* Itens */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Itens do pedido
          </h2>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-200">
                  <span className="font-semibold text-(--primary-color)">{item.quantity}×</span>{" "}
                  {item.productName}
                </span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {Number(item.totalPrice).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-border" />

        {/* Total */}
        <div className="flex justify-between items-center font-bold text-base">
          <span className="text-gray-700 dark:text-gray-200">Total</span>
          <span className="text-(--primary-color) text-lg">
            {Number(order.totalPrice).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        {/* Endereço */}
        {order.address && (
          <>
            <div className="border-t border-border" />
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <MapPin size={14} />
                Endereço de entrega
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {order.address.street}, {order.address.number}
                {order.address.complement ? `, ${order.address.complement}` : ""}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.address.neighborhood} — {order.address.city}/{order.address.state}
                {order.address.zipCode && ` · ${order.address.zipCode}`}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Pagar agora — apenas se aguardando pagamento */}
      {order.status === "WAITING_PAYMENT" && (
        <button
          onClick={handlePayNow}
          disabled={payLoading}
          className="mt-5 w-full flex items-center justify-center gap-2.5 bg-(--primary-color) hover:opacity-90 active:scale-[0.98] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all"
        >
          {payLoading ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
          {payLoading ? "Gerando link..." : "Pagar agora"}
        </button>
      )}

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5c] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all"
      >
        <MessageCircle size={20} />
        Falar no WhatsApp
      </a>
    </main>
  );
}
