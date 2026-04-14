"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authApi, userApi } from "@/api/api";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.adminLogin({ email, password });
      const me = await userApi.getMe();
      login(me);
      router.push("/admin");
    } catch (err: unknown) {
      if (err instanceof Error && err.message.startsWith("403")) {
        setError("Acesso negado. Esta área é exclusiva para administradores.");
      } else {
        setError("E-mail ou senha inválidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-zinc-800 dark:bg-zinc-700 text-white rounded-2xl p-4 mb-4">
              <ShieldCheck size={36} />
            </div>
            <h1
              className="text-2xl font-bold text-gray-800 dark:text-gray-100"
              style={{ fontFamily: "var(--font-merienda)" }}
            >
              Painel Admin
            </h1>
            <p className="text-gray-400 text-sm mt-1 text-center">
              Acesso restrito a administradores
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@menufood.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            {error && (
              <p className="text-sm text-red-500 text-center -mt-1">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-800 dark:bg-zinc-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Entrar como Administrador"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
