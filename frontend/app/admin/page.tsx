"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminDashboardPage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/admin/login");
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isLoggedIn, user, router]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 py-24 px-4">
      <div className="bg-zinc-800 text-white rounded-2xl p-5">
        <ShieldCheck size={48} />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Painel Administrativo
      </h1>
      <p className="text-gray-400 text-center max-w-sm">
        Olá, <strong>{user.name}</strong>! O painel de gerenciamento de pedidos e
        produtos será implementado na próxima fase.
      </p>
    </main>
  );
}
