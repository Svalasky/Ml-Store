"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser } from "@/types/admin";

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AUTH_KEY = "mole_store_admin_auth";

const DEFAULT_ADMIN: AdminUser = {
  id: "admin-1",
  email: "admin@molestore.com",
  name: "Master Admin",
  role: "superadmin",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read auth state", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Mock authentication: accepts admin credentials
    // Note: Can be easily replaced with fetch('/api/admin/login')
    if (
      (email.trim().toLowerCase() === "admin@molestore.com" || email.trim() === "admin") &&
      pass === "admin123"
    ) {
      const adminUser: AdminUser = {
        ...DEFAULT_ADMIN,
        email: email.includes("@") ? email : "admin@molestore.com",
      };
      setUser(adminUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
