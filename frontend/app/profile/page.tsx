"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, MapPin, Trash2, Plus, X, Loader2, Pencil, Check } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { userApi, type UserResponse, type AddressResponse, type CreateAddressRequest } from "@/api/api";

interface AddressFormData {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

const emptyForm: AddressFormData = {
  street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "",
};

export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Edit profile state
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    userApi
      .getMe()
      .then((data) => {
        setUser(data);
        setAddressLoading(true);
        // Carrega endereços separadamente — erro aqui não derruba o perfil
        userApi.listAddresses(data.id)
          .then((addrs) => setAddresses(addrs))
          .catch(() => setAddressError(t("addr_error_save")))
          .finally(() => setAddressLoading(false));
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleEditOpen = () => {
    setEditName(user?.name ?? "");
    setEditPhone(user?.phone ?? "");
    setProfileError(null);
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setProfileError(null);
  };

  const handleProfileSave = async () => {
    if (!editName.trim()) {
      setProfileError(t("profile_name_required") !== "profile_name_required" ? t("profile_name_required") : "O nome não pode estar vazio.");
      return;
    }
    setProfileSaving(true);
    setProfileError(null);
    try {
      const updated = await userApi.updateMe({ name: editName.trim(), phone: editPhone.trim() });
      setUser(updated);
      setEditMode(false);
    } catch {
      setProfileError(t("error_generic"));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;
    const { street, number, neighborhood, city, state, zipCode } = formData;
    if (!street || !number || !neighborhood || !city || !state || !zipCode) {
      setAddressError(t("cart_address_required"));
      return;
    }
    setSaving(true);
    setAddressError(null);
    try {
      const payload: CreateAddressRequest = {
        street, number,
        complement: formData.complement || undefined,
        neighborhood, city, state, zipCode,
      };
      const created = await userApi.addAddress(user.id, payload);
      setAddresses((prev) => [...prev, created]);
      setFormData(emptyForm);
      setShowAddForm(false);
    } catch {
      setAddressError(t("addr_error_save"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;
    setDeletingId(addressId);
    try {
      await userApi.deleteAddress(user.id, addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch {
      setAddressError(t("addr_error_delete"));
    } finally {
      setDeletingId(null);
    }
  };

  const updateField = (field: keyof AddressFormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

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

      {/* User info */}
      <div className="bg-surface-1 rounded-2xl shadow-sm border border-border p-6 md:p-8 flex flex-col items-center gap-6 mb-6">
        {/* Avatar + edit button */}
        <div className="relative">
          <UserCircle size={80} className="text-(--primary-color)" strokeWidth={1.5} />
          <button
            onClick={handleEditOpen}
            aria-label="Editar perfil"
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-500 hover:text-(--primary-color) hover:border-(--primary-color) transition-colors shadow-sm"
          >
            <Pencil size={13} />
          </button>
        </div>

        {/* Edit form */}
        {editMode ? (
          <div className="w-full flex flex-col gap-3">
            {profileError && (
              <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t("profile_name")}
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t("profile_email")}
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/40"
              />

            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t("profile_phone")}
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/40"
              />
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary-color)] text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {profileSaving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {t("Salvar")}
              </button>
              <button
                onClick={handleEditCancel}
                disabled={profileSaving}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                {t("Cancelar")}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full divide-y divide-border">
            <ProfileRow label={t("profile_name")} value={user.name} />
            <ProfileRow label={t("profile_email")} value={user.email} />
            <ProfileRow label={t("profile_phone")} value={user.phone || "-"} />
            {user.createdAt && (
              <ProfileRow
                label={t("profile_member_since")}
                value={formatDate(user.createdAt)}
              />
            )}
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="bg-surface-1 rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <MapPin size={20} className="text-(--primary-color)" />
            {t("profile_addresses")}
          </h2>
          {!showAddForm && (
            <button
              onClick={() => { setShowAddForm(true); setAddressError(null); }}
              className="flex items-center gap-1.5 text-sm font-medium text-(--primary-color) hover:opacity-80 transition-opacity"
            >
              <Plus size={16} />
              {t("addr_add_btn")}
            </button>
          )}
        </div>

        {addressError && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{addressError}</p>
        )}

        {/* Add form */}
        {showAddForm && (
          <div className="mb-4 p-4 border border-dashed border-gray-200 dark:border-zinc-600 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("addr_add_btn")}
              </span>
              <button
                onClick={() => { setShowAddForm(false); setFormData(emptyForm); setAddressError(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { field: "street", label: t("addr_street"), required: true, span: true },
                  { field: "number", label: t("addr_number"), required: true },
                  { field: "complement", label: t("addr_complement"), required: false },
                  { field: "neighborhood", label: t("addr_neighborhood"), required: true },
                  { field: "city", label: t("addr_city"), required: true },
                  { field: "state", label: t("addr_state"), required: true, maxLength: 2 },
                  { field: "zipCode", label: t("addr_zipcode"), required: true, placeholder: "00000-000" },
                ] as Array<{ field: keyof AddressFormData; label: string; required: boolean; span?: boolean; maxLength?: number; placeholder?: string }>
              ).map(({ field, label, required, span, maxLength, placeholder }) => (
                <div key={field} className={span ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {label}{required && " *"}
                  </label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/40"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleAddAddress}
              disabled={saving}
              className="mt-4 w-full bg-[var(--primary-color)] text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t("addr_saving")}
                </>
              ) : (
                t("addr_save")
              )}
            </button>
          </div>
        )}

        {/* List */}
        {addressLoading ? (
          <p className="text-sm text-gray-400 animate-pulse">{t("addr_loading")}</p>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">{t("addr_empty")}</p>
        ) : (
          <div className="divide-y divide-border">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start justify-between py-3 gap-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {addr.street}, {addr.number}
                    {addr.complement ? `, ${addr.complement}` : ""} — {addr.neighborhood},{" "}
                    {addr.city}/{addr.state}
                    {addr.zipCode && (
                      <span className="text-gray-400"> · {addr.zipCode}</span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  disabled={deletingId === addr.id}
                  className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50"
                  aria-label={t("cart_remove")}
                >
                  {deletingId === addr.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
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
