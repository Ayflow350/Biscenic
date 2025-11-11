// app/order-error/page.tsx
"use client";

import Link from "next/link";
import { XCircle, HelpCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="text-center max-w-lg w-full p-8 border rounded-lg shadow-xl space-y-6">
        <XCircle className="h-16 w-16 text-red-600 mx-auto" />
        <h1 className="text-3xl font-bold">Order Processing Failed</h1>

        <p className="text-lg text-muted-foreground">
          We encountered a critical issue while finalizing your order. This
          typically means the order could not be saved to our system, or your
          payment could not be confirmed.
        </p>

        <div className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 p-4 rounded-md">
          <h3 className="text-base font-semibold text-red-700 dark:text-red-400 mb-2">
            Important: Check Your Billing
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            If you were charged, please **do not attempt to re-order**
            immediately. Contact our support team with your transaction details
            for a manual check and confirmation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild className="flex items-center gap-2">
            <Link href="/contact">
              <HelpCircle className="h-4 w-4" /> Contact Support
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/collections">
              <ShoppingBag className="h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Error codes have been logged for our team to review.
        </p>
      </div>
    </div>
  );
}
