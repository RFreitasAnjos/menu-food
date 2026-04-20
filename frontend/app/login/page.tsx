"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff } from "lucide-react";
import GoogleIcon from '@mui/icons-material/Google';
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { authApi, userApi } from "@/api/api";

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/profile");
    }
  }, [isLoggedIn, router]);
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
      await authApi.login({ email, password });
      const me = await userApi.getMe();
      login(me);
      router.push("/");
    } catch {
      setError(t("login_error") !== "login_error" ? t("login_error") : "E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[var(--primary-color)] text-white rounded-2xl p-4 mb-4">
              <UtensilsCrossed size={36} />
            </div>
            <h1
              className="text-2xl font-bold text-gray-800 dark:text-gray-100"
              style={{ fontFamily: "var(--font-merienda)" }}
            >
              MenuFood
            </h1>
            <p className="text-gray-400 text-sm mt-1 text-center">{t("login_subtitle")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
              >
                {t("login_email_label")}
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
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t("login_password_label")}
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
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? t("login_hide_password") : t("login_show_password")}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-end -mt-1">
              <Link href="/recovery" className="text-sm text-[var(--primary-color)] hover:underline">
                {t("login_forgot")}
              </Link>
            </div>

            {/* Submit */}
            {error && (
              <p className="text-sm text-red-500 text-center -mt-1">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "..." : t("login_btn")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-700" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-700" />
          </div>

          {/* Continue as guest */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <GoogleIcon size={18} className="text-gray-400" />
            {t("login_google")}
          </Link>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            {t("login_no_account")}{" "}
            <Link href="/register">
              <button className="text-[var(--primary-color)] font-semibold hover:opacity-80 transition-opacity">
                {t("login_register")}
              </button>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
