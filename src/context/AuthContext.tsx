// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      // --- ADDED LOGGING ---
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/me/profile`;
      console.log("[AuthContext] Checking user session at URL:", apiUrl);
      // ---------------------

      try {
        const response = await fetch(
          apiUrl, // Use the logged variable
          {
            credentials: "include",
          }
        );

        console.log(
          "[AuthContext] Session check response status:",
          response.status
        );

        if (response.ok) {
          const data = await response.json();
          console.log(
            "[AuthContext] Session found, setting user:",
            data.user || data
          );
          setUser(data.user || data);
        } else {
          console.log("[AuthContext] No active session found.");
          setUser(null);
        }
      } catch (error) {
        // This is where your "TypeError: Failed to fetch" is caught.
        console.error(
          "[AuthContext] CRITICAL: Failed to fetch user session. This is likely a network, CORS, or .env issue.",
          error
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const logout = async () => {
    /* ... your logout logic ... */
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
