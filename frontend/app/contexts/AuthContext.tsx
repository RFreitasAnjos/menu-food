"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authApi, userApi, type UserResponse } from "@/api/api";

interface AuthContextValue {
  isLoggedIn: boolean;
  user: UserResponse | null;
  login: (user: UserResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verifica sessão ativa ao carregar (cookie HttpOnly não é lido pelo JS)
  useEffect(() => {
    userApi
      .getMe()
      .then((data) => {
        setUser(data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
      });
  }, []);

  // Escuta o evento disparado pelo api.ts quando o refresh token expira
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setIsLoggedIn(false);
      router.push("/login");
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [router]);

  const login = useCallback((userData: UserResponse) => {
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignora erros de rede; limpa estado de qualquer forma
    }
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
