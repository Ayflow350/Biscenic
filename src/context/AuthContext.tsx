// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: "admin" | "customer" | "guest"; // <-- added role
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log("[AuthContext] Loading from localStorage...");
    console.log("Token found:", storedToken);
    console.log("User found:", storedUser ? JSON.parse(storedUser) : null);

    if (storedToken) setTokenState(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));

    setIsLoading(false);
  }, []);

  const setToken = (newToken: string | null) => {
    console.log("[AuthContext] Setting token:", newToken);
    setTokenState(newToken);
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  };

  const setUserWithLog = (newUser: User | null) => {
    console.log("[AuthContext] Setting user:", newUser);
    setUser(newUser);
    if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
    else localStorage.removeItem("user");
  };

  const logout = () => {
    console.log("[AuthContext] Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setTokenState(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    setUser: setUserWithLog,
    setToken,
    logout,
  };

  useEffect(() => {
    console.log("[AuthContext] Current state:", { user, token, isLoading });
  }, [user, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
