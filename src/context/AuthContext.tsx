"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser, AdminRole } from "@/types/admin";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: AdminUser | null;
  role: AdminRole;
  isAdmin: boolean;
  isStaff: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AUTH_KEY = "mole_store_admin_auth";

const DEFAULT_ADMIN: AdminUser = {
  id: "admin-master",
  email: "admin@molestore.com",
  name: "Master Admin",
  role: "admin",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const initAuth = async () => {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile for role
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            const adminUser: AdminUser = {
              id: session.user.id,
              email: session.user.email || "",
              name: profile?.full_name || session.user.email?.split("@")[0] || "Admin",
              role: (profile?.role as AdminRole) || "admin",
            };
            setUser(adminUser);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error("Supabase auth init error:", err);
        }
      }

      // Check local storage fallback
      try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Local auth state error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          const adminUser: AdminUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: profile?.full_name || session.user.email?.split("@")[0] || "Admin",
            role: (profile?.role as AdminRole) || "admin",
          };
          setUser(adminUser);
        } else {
          // If explicitly signed out in Supabase
          if (!localStorage.getItem(AUTH_KEY)) {
            setUser(null);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (error) {
          // If login fails with Supabase, check if mock dev fallback matches
          if (
            (email.trim().toLowerCase() === "admin@molestore.com" || email.trim() === "admin") &&
            pass === "admin123"
          ) {
            setUser(DEFAULT_ADMIN);
            localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_ADMIN));
            setIsLoading(false);
            return { success: true };
          }
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || "",
            name: profile?.full_name || data.user.email?.split("@")[0] || "Admin",
            role: (profile?.role as AdminRole) || "admin",
          };
          setUser(adminUser);
          localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.error("Supabase login error:", err);
      }
    }

    // Offline / Preview fallback
    if (
      (email.trim().toLowerCase() === "admin@molestore.com" || email.trim() === "admin") &&
      pass === "admin123"
    ) {
      setUser(DEFAULT_ADMIN);
      localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_ADMIN));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: "Email atau kata sandi tidak sesuai.",
    };
  };

  const logout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Supabase signOut error:", err);
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const role: AdminRole = user?.role || "staff";
  const isAdmin = role === "admin";
  const isStaff = role === "staff" || role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isStaff,
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
