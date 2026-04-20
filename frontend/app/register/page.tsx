"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, User, ArrowLeft, Phone } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useAuth } from "@/app/contexts/AuthContext";

export default function RegisterPage() {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) router.replace("/profile");
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError(t("register_password_mismatch"));
      return;
    }
    setLoading(true);
    try {
      // TODO: implementar chamada à API de registro
      console.log("register", { name, email, password });
    } catch {
      setError(t("register_error"));
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
            <div className="bg-[var(--primary-color)] text-white rounded-2xl p-4 mb-4">
              <UtensilsCrossed size={36} />
            </div>
            <h1
              className="text-2xl font-bold text-gray-800 dark:text-gray-100"
              style={{ fontFamily: "var(--font-merienda)" }}
            >
              MenuFood
            </h1>
            <p className="text-gray-400 text-sm mt-1 text-center">{t("register_subtitle")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                {t("register_name_label")}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("register_name_placeholder")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                {t("login_email_label")}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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

            {/* Phone Number */}
            <div>
               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  {t("register_phone_label")}
               </label>
               <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                     id="phone"
                     type="tel"
                     name="phone"
                     autoComplete="tel"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     placeholder={t("register_phone_placeholder")}
                     className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-shadow"
                  />
               </div>

            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                {t("login_password_label")}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                {t("register_confirm_password_label")}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirm ? t("login_hide_password") : t("login_show_password")}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center -mt-1">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("register_creating") : t("register_btn")}
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
            <ArrowLeft size={16} />
            {t("login_continue_guest")}
          </Link>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            {t("register_has_account")}{" "}
            <Link href="/login" className="text-[var(--primary-color)] font-semibold hover:opacity-80 transition-opacity">
              {t("register_login")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
