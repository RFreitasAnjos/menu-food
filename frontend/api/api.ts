// ──────────────────────────────────────────────
//  Base
// ──────────────────────────────────────────────
// Em desenvolvimento o Next.js faz proxy de /api/** → localhost:8080 (ver next.config.ts).
// Em produção defina NEXT_PUBLIC_API_URL como string vazia ou a mesma origem.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Faz refresh do access token usando o refresh_token cookie. */
async function doRefresh(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("refresh_failed");
}

let refreshPromise: Promise<void> | null = null;

async function request<T>(
  path: string,
  options: RequestInit = {},
  skipRefresh = false
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  // Tenta renovar o access token automaticamente em caso de 401
  if (res.status === 401 && !skipRefresh) {
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null;
      });
    }
    try {
      await refreshPromise;
      return request<T>(path, options, true);
    } catch {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
      throw new Error("401 Unauthorized");
    }
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────
//  Types  (espelham os DTOs do backend)
// ──────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

/** Resposta de login — token agora é cookie HttpOnly; body traz dados do usuário. */
export interface AuthResponse {
  id: string;
  name: string;
  role: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface ProductOptionResponse {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroupResponse {
  id: string;
  name: string;
  required: boolean;
  minSelection: number;
  maxSelection: number;
  options: ProductOptionResponse[];
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  basePrice: number;
  isActive: boolean;
  optionGroups: ProductOptionGroupResponse[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  description?: string;
  optionsIds: string[];
}

export interface CreateAddressRequest {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CreateOrderRequest {
  userId: string;
  addressId?: string;
  address?: CreateAddressRequest;
  items: OrderItemRequest[];
}

export interface AddressResponse {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  basePrice: number;
  totalPrice: number;
}

export interface OrderResponse {
  id: string;
  status: string;
  totalPrice: number;
  address: AddressResponse | null;
  createdAt: string;
  checkoutUrl: string | null;
  items: OrderItemResponse[];
}

// ──────────────────────────────────────────────
//  Auth
// ──────────────────────────────────────────────
export const authApi = {
  /** Login de cliente: define cookies HttpOnly e retorna dados do usuário. */
  login: (data: LoginRequest) =>
    request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Login de administrador: define cookies HttpOnly e retorna dados do usuário. */
  adminLogin: (data: LoginRequest) =>
    request<AuthResponse>("/api/v1/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /** Atualiza o access token usando o refresh token cookie. */
  refresh: () =>
    request<void>("/api/v1/auth/refresh", { method: "POST" }, true),

  /** Encerra a sessão e limpa os cookies. */
  logout: () =>
    request<void>("/api/v1/auth/logout", { method: "POST" }, true),
};

// ──────────────────────────────────────────────
//  Users
// ──────────────────────────────────────────────
export const userApi = {
  create: (data: CreateUserRequest) =>
    request<UserResponse>("/api/v1/client/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => request<UserResponse>("/api/v1/client/users/me"),

  updateMe: (data: { name?: string; phone?: string }) =>
    request<UserResponse>("/api/v1/client/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getOrders: (userId: string) =>
    request<OrderResponse[]>(`/api/v1/client/users/${userId}/orders`),

  addAddress: (_userId: string, data: CreateAddressRequest) =>
    request<AddressResponse>("/api/v1/client/users/me/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  listAddresses: (_userId: string) =>
    request<AddressResponse[]>("/api/v1/client/users/me/addresses"),

  deleteAddress: (_userId: string, addressId: string) =>
    request<void>(`/api/v1/client/users/me/addresses/${addressId}`, {
      method: "DELETE",
    }),
};

// ──────────────────────────────────────────────
//  Products
// ──────────────────────────────────────────────
export const productApi = {
  list: () => request<ProductResponse[]>("/api/v1/client/products"),

  getById: (id: string) =>
    request<ProductResponse>(`/api/v1/client/products/${id}`),
};

// ──────────────────────────────────────────────
//  Checkout (Mercado Pago)
// ──────────────────────────────────────────────
export interface CheckoutResponse {
  orderId: string;
  checkoutUrl: string;
}

// ──────────────────────────────────────────────
//  Orders
// ──────────────────────────────────────────────
export const orderApi = {
  create: (data: CreateOrderRequest) =>
    request<unknown>("/api/v1/client/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getById: (id: string) =>
    request<OrderResponse>(`/api/v1/client/orders/${id}`),

  getPaymentLink: (id: string) =>
    request<CheckoutResponse>(`/api/v1/client/orders/${id}/payment-link`, {
      method: "POST",
    }),
};

export const checkoutApi = {
  /**
   * Cria o pedido na API e retorna a URL de checkout do Mercado Pago.
   * O frontend deve redirecionar o usuário para `checkoutUrl`.
   */
  createCheckout: (data: CreateOrderRequest) =>
    request<CheckoutResponse>("/api/v1/client/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
