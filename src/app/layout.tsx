// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. IMPORT ALL YOUR PROVIDERS AND GLOBAL COMPONENTS
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/AuthContext"; // <-- The missing Auth provider
import Providers from "@/components/providers"; // Your TanStack Query provider
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header"; // Your Header component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Biscenic",
  description: "Crafted for Elegance. Designed for Living.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* 2. WRAP EVERYTHING IN THE CORRECT PROVIDER ORDER */}
        {/* The order can matter. A good general practice is:
            - Outermost: Low-level providers like ThemeProvider, QueryProvider.
            - Innermost: Specific context providers like AuthProvider, CartProvider.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {" "}
            {/* TanStack Query Provider */}
            <AuthProvider>
              {" "}
              {/* The Auth Provider that provides user data */}
              <CartProvider>
                {/* 3. PLACE THE HEADER AND CHILDREN *INSIDE* ALL PROVIDERS */}
                <Header />{" "}
                {/* The Header can now use useAuth() and useCart() */}
                <main>{children}</main>
                <Toaster richColors position="top-center" />
              </CartProvider>
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
