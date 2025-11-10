"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ShoppingBag } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useState } from "react"; // <--- IMPORT useState
import { useRouter } from "next/navigation"; // <--- IMPORT useRouter

// --- FIXES START HERE ---

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/user-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { CartDrawerContent } from "../components/CartSidebar"; // Assuming CartDrawerContent is correct

const getInitials = (name?: string | null): string => {
  if (!name) return "U";

  const names = name.split(" ").filter(Boolean);
  if (names.length === 0) return "U";
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// --- FIXES END HERE ---

const navLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { itemCount } = useCart();
  const { user, isLoading, logout } = useAuth();
  const router = useRouter(); // <--- Initialize router

  // 1. Add state to control the Cart Sheet
  const [isCartOpen, setIsCartOpen] = useState(false);
  // 1b. Add state to control the Mobile Menu Sheet
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <--- NEW STATE

  // 2. Function to close the menu and navigate
  const handleMobileNavLinkClick = (href: string) => {
    setIsMenuOpen(false); // Close the menu sheet
    // Use a small delay for smoother transition if the sheet has an animation
    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  // 3. Helper function for auth links to close menu before routing
  const handleAuthLinkClick = (href: string) => {
    setIsMenuOpen(false); // Close the menu sheet
    setTimeout(() => {
      // Use Link directly for non-page-transition links, but the Sheet must close first
    }, 150);
  };

  return (
    <header className="sticky top-0 left-0 w-full flex items-center justify-between p-4 md:px-8 z-50 bg-background/80 backdrop-blur-sm border-b">
      <Link
        href="/"
        className="text-2xl md:text-3xl font-serif font-semibold text-inherit"
      >
        <Image
          src={"/Biscenic.PNG"}
          alt="Biscenic Logo"
          width={50}
          height={50}
          priority
          className="h-auto rounded-lg"
        />
      </Link>

      {/* Middle: Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right Side: Actions & Mobile Menu Trigger */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop Authentication Section (Dynamic) */}
        <div className="hidden md:flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-10 w-24 rounded-md" />
          ) : user ? (
            <UserNav />
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>

        {/* Cart Icon - CART DRAWER */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <button className="relative p-2">
              <ShoppingBag className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="sr-only">Open cart</span>
              {itemCount > 0 && (
                <div className="absolute top-0 right-0 h-5 w-5 bg-black text-white rounded-full text-xs font-bold flex items-center justify-center dark:bg-white dark:text-black">
                  {itemCount}
                </div>
              )}
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[380px] p-6 flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold">
                Your Cart
              </SheetTitle>
            </SheetHeader>

            <CartDrawerContent onClose={() => setIsCartOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Mobile Menu Trigger (Hamburger Icon) */}
        <div className="md:hidden">
          {/* 4. Use the isMenuOpen state */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="p-4 mt-8 flex flex-col h-full">
                <nav className="flex flex-col gap-6 text-lg">
                  {navLinks.map((link) => (
                    // 5. Change Link to Button/div with custom onClick handler
                    <div
                      key={link.href}
                      onClick={() => handleMobileNavLinkClick(link.href)}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {link.label}
                    </div>
                  ))}
                </nav>

                {/* Mobile Authentication Section (Dynamic) */}
                <div className="mt-auto space-y-4">
                  {isLoading ? (
                    <Skeleton className="h-10 w-full rounded-md" />
                  ) : user ? (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsMenuOpen(false); // Close before logout
                          logout();
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-2 border-t pt-4">
                      {/* 6. Update Sign Up/In to close the sheet first */}
                      <Button
                        asChild
                        onClick={() => handleAuthLinkClick("/signup")}
                      >
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        onClick={() => handleAuthLinkClick("/signin")}
                      >
                        <Link href="/signin">Sign In</Link>
                      </Button>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
