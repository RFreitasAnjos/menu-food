"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { userApi, type UserResponse } from "@/api/api";

export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    userApi
      .getMe()
      .then((data) => setUser(data))
      .catch((err: unknown) => {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <main className="flex items-center justify-center flex-1 py-24">
        <p className="text-gray-400 dark:text-gray-500 animate-pulse">
          {t("profile_loading")}
        </p>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex items-center justify-center flex-1 py-24">
        <p className="text-red-500">{t("error_generic")}</p>
      </main>
    );
  }

  return (
    <main className="w-full max-w-2xl mx-auto px-4 md:px-6 py-10 flex-1">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        {t("profile_title")}
      </h1>

      <div className="bg-surface-1 rounded-2xl shadow-sm border border-border p-6 md:p-8 flex flex-col items-center gap-6">
        <UserCircle size={80} className="text-(--primary-color)" strokeWidth={1.5} />

        <div className="w-full divide-y divide-border">
          <ProfileRow label={t("profile_name")} value={user.name} />
          <ProfileRow label={t("profile_email")} value={user.email} />
          <ProfileRow label={t("profile_role")} value={user.role} />
          {user.createdAt && (
            <ProfileRow
              label={t("profile_member_since")}
              value={formatDate(user.createdAt)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-1">
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
      <span className="text-gray-800 dark:text-gray-100 font-semibold sm:text-right">
        {value}
      </span>
    </div>
  );
}