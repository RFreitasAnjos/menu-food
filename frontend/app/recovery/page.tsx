"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

type Step = "email" | "code" | "password";

export default function RecoveryPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // TODO: chamar API de envio de código
      console.log("send recovery code to", email);
      setSuccessMsg(t("recovery_code_sent"));
      setStep("code");
    } catch {
      setError(t("recovery_error_send"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // TODO: chamar API de verificação do código
      console.log("verify code", { email, code });
      setSuccessMsg("");
      setStep("password");
    } catch {
      setError(t("recovery_error_code"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError(t("register_password_mismatch"));
      return;
    }
    setLoading(true);
    try {
      // TODO: chamar API de redefinição de senha com email, code, newPassword
      console.log("reset password", { email, code, newPassword });
      setSuccessMsg(t("recovery_success"));
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError(t("recovery_error_reset"));
    } finally {
      setLoading(false);
    }
  };

  const stepIndex: Record<Step, number> = { email: 0, code: 1, password: 2 };
  const current = stepIndex[step];

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
              {t("recovery_title")}
            </h1>
            <p className="text-gray-400 text-sm mt-1 text-center">
              {step === "email" && t("recovery_subtitle_step1")}
              {step === "code" && t("recovery_subtitle_step2")}
              {step === "password" && t("recovery_subtitle_step3")}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                  i <= current ? "bg-[var(--primary-color)]" : "bg-gray-200 dark:bg-zinc-600"
                }`}
              />
            ))}
          </div>

          {successMsg && (
            <p className="text-sm text-green-600 dark:text-green-400 text-center mb-4 bg-green-50 dark:bg-green-900/20 rounded-xl py-2 px-3">
              {successMsg}
            </p>
          )}

          {/* Step 1 — E-mail */}
          {step === "email" && (
            <form onSubmit={handleSendCode} noValidate className="space-y-5">
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

              {error && <p className="text-sm text-red-500 text-center -mt-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t("recovery_sending") : t("recovery_send_code")}
              </button>
            </form>
          )}

          {/* Step 2 — Código */}
          {step === "code" && (
            <form onSubmit={handleVerifyCode} noValidate className="space-y-5">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  {t("recovery_code_label")}
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="code"
                    type="text"
                    name="code"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder={t("recovery_code_placeholder")}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500 text-center -mt-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t("recovery_verifying") : t("recovery_verify_code")}
              </button>

              <button
                type="button"
                onClick={() => { setStep("email"); setError(""); setSuccessMsg(""); setCode(""); }}
                className="w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {t("recovery_resend_code")}
              </button>
            </form>
          )}

          {/* Step 3 — Nova senha */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} noValidate className="space-y-5">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  {t("recovery_new_password_label")}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    name="new-password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showNew ? t("login_hide_password") : t("login_show_password")}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  {t("recovery_confirm_password_label")}
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    name="confirm-password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                className="w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? t("recovery_resetting") : t("recovery_reset_btn")}
              </button>
            </form>
          )}

          {/* Back to login */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100 dark:bg-zinc-700" />
          </div>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-zinc-600 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            {t("recovery_back_login")}
          </Link>
        </div>
      </div>
    </main>
  );
}