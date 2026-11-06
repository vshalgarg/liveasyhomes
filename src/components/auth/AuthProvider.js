"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchSession,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/api/auth";
import { clearLegacyAuthStorage } from "@/lib/auth-storage";
import AuthModal from "./AuthModal";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    let cancelled = false;
    clearLegacyAuthStorage();

    async function hydrate() {
      try {
        const session = await fetchSession();
        if (!cancelled) {
          setUser(session?.authenticated ? session.user : null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const session = await loginUser({ email, password });
    setUser(session.user);
    setAuthOpen(false);
    return session;
  }, []);

  const register = useCallback(
    async ({ name, email, password, phone }) => {
      const session = await registerUser({
        name,
        email,
        password,
        phone,
        role: "TENANT",
      });
      setUser(session.user);
      setAuthOpen(false);
      return session;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // still clear local UI state
    }
    clearLegacyAuthStorage();
    setUser(null);
  }, []);

  const openAuth = useCallback((mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      isAdmin: String(user?.role || "").toUpperCase() === "ADMIN",
      login,
      register,
      logout,
      openAuth,
      closeAuth,
    }),
    [user, ready, login, register, logout, openAuth, closeAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={closeAuth}
        onLogin={login}
        onRegister={register}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
