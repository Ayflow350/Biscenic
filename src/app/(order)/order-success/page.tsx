// app/order-success/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Home,
  Download,
  Share2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// --- REQUIRED CONTEXT/MUTATION IMPORTS ---
import { useCart } from "@/context/cart-context";
import { useCheckout, CheckoutProvider } from "@/context/checkout-context";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/lib/PaymentApi"; // Backend write API
import { useVerifyPayment } from "@/lib/flutterwave-queries"; // Verification hook
// ------------------------------------------

// PDF Imports (Ensure these packages are installed!)
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import { OrderSummarySkeleton } from "../components/OrderSummarySkeleton"; // Assuming path is correct

pdfMake.vfs = pdfFonts.vfs;

// --- Order Details Structure (The confirmed structure) ---
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
interface OrderDetails {
  orderId: string;
  date: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  items: OrderItem[];
}

// -------------------------------------------------------------------
// --- NEW: Order Creation Mutation Hook (Centralized backend write) ---
// -------------------------------------------------------------------
const useOrderCreationMutation = (
  clearCart: () => void,
  setFinalOrderId: (id: string) => void
) => {
  const router = useRouter();
  // The promise returns: Promise<{ data: { orderId: string } }>
  return useMutation<{ data: { orderId: string } }, Error, any>({
    mutationFn: createOrder,
    onSuccess: (result) => {
      const orderId = result.data.orderId; // Access through result.data

      toast.success("Order Placed Successfully!", {
        description: `Your order #${orderId} has been confirmed.`,
      });
      // 🚨 SUCCESS: Backend save is complete, now safe to clear frontend state
      clearCart();
      setFinalOrderId(orderId); // Update local state with confirmed ID
    },
    onError: (error) => {
      console.error("Order creation failed after payment:", error);
      toast.error("Failed to Save Order", {
        description:
          "Payment successful, but order save failed. Contact support.",
      });
      // Route to error page on backend write failure
      router.replace("https://biscenic-leun.vercel.app/order-error");
    },
  });
};
// -------------------------------------------------------------------

// Helper component for clean rendering
const OrderDisplay = ({
  orderToDisplay,
  formatCurrency,
}: {
  orderToDisplay: OrderDetails;
  formatCurrency: (val: number) => string;
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Items Ordered</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orderToDisplay.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-2 last:border-b-0"
          >
            <p className="font-medium">
              {item.name}{" "}
              <span className="text-muted-foreground">x{item.quantity}</span>
            </p>
            <p className="font-semibold">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(orderToDisplay.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {orderToDisplay.shippingFee > 0
              ? formatCurrency(orderToDisplay.shippingFee)
              : "To be discussed"}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>{formatCurrency(orderToDisplay.totalAmount)}</span>
        </div>
        <h3 className="font-semibold pt-4">Shipping To:</h3>
        <p className="text-xs text-muted-foreground leading-snug">
          {orderToDisplay.shippingAddress.address},{" "}
          {orderToDisplay.shippingAddress.city},{" "}
          {orderToDisplay.shippingAddress.state},{" "}
          {orderToDisplay.shippingAddress.country}
        </p>
      </CardContent>
    </Card>
  </div>
);

// -------------------------------------------------------------------
// --- INNER COMPONENT (Contains all hooks - Renamed for clarity) ---
// -------------------------------------------------------------------
function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get frontend state data immediately
  const { cart, clearCart } = useCart();
  const { checkoutData } = useCheckout(); // Hooks are safe here

  // 1. Get Payment Params from URL
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");
  const status = searchParams.get("status");

  const [finalOrderId, setFinalOrderId] = useState<string | null>(
    searchParams.get("orderId")
  );

  // 2. Trigger Verification if Flutterwave Redirect Params Exist
  const isFlutterwaveRedirect = !!transaction_id && status === "successful";

  const {
    data: verificationData,
    isLoading: isVerifying,
    isSuccess: isVerificationSuccess,
    isError: isVerificationError,
  } = useVerifyPayment(transaction_id as string, isFlutterwaveRedirect);

  const createOrderMutation = useOrderCreationMutation(
    clearCart,
    setFinalOrderId
  );
  const isCreatingOrder = createOrderMutation.isPending;

  // 3. OPTIMISTIC DATA CALCULATION
  const orderToDisplay: OrderDetails | null = useMemo(() => {
    const orderIdToUse = finalOrderId || tx_ref;

    if (!orderIdToUse && cart.length === 0) return null; // Hard failure, no ID and no items

    const subtotal = cart.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    // If cart is empty, render null (handled by logic below)
    if (cart.length === 0 && !finalOrderId) return null;

    return {
      orderId: orderIdToUse || "PENDING_ID",
      date: new Date().toLocaleDateString("en-US"),
      subtotal: subtotal,
      shippingFee: 0,
      totalAmount: subtotal,
      paymentMethod: finalOrderId
        ? "Confirmed Payment"
        : "Flutterwave (Verifying)",
      shippingAddress: {
        address: checkoutData.shippingInfo.address || "N/A",
        city: checkoutData.shippingInfo.city || "N/A",
        state: checkoutData.shippingInfo.state || "N/A",
        country: checkoutData.shippingInfo.country || "N/A",
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
    };
  }, [finalOrderId, tx_ref, cart, checkoutData]);

  // --- 4. Verification/Backend Write Effect ---
  useEffect(() => {
    if (
      isVerificationSuccess &&
      verificationData &&
      !finalOrderId &&
      !isCreatingOrder &&
      orderToDisplay // Only proceed if optimistic data is available
    ) {
      // 🚨 FIX IMPLEMENTED HERE: Construct payload to match OrderCreationPayload
      const orderData = {
        // 1. Customer Info (Top Level)
        customerInfo: checkoutData.customerInfo,

        // 2. Items (Use items from orderToDisplay, which were derived from cart)
        items: orderToDisplay.items,

        // 3. Total Amount
        totalAmount: orderToDisplay.totalAmount,

        // 4. Payment Method
        paymentMethod: "flutterwave" as const,

        // 5. Payment Details (Gateway response)
        paymentDetails: {
          ...verificationData.data,
          gateway: "flutterwave",
          transactionReference: tx_ref,
        },

        // 6. Shipping Info (Fully detailed object matching Mongoose/Payload)
        shippingInfo: {
          address: checkoutData.shippingInfo.address,
          state: checkoutData.shippingInfo.state,
          city: checkoutData.shippingInfo.city,
          country: checkoutData.shippingInfo.country ?? "",
          postalCode: checkoutData.shippingInfo.zipCode ?? "",
          apartment: checkoutData.shippingInfo.apartment ?? "",
        },
      };

      createOrderMutation.mutate(orderData);
    }

    if (isVerificationError && isFlutterwaveRedirect) {
      router.replace(`/order-error`);
    }
  }, [
    isVerificationSuccess,
    isVerificationError,
    verificationData,
    checkoutData,
    createOrderMutation,
    router,
    isFlutterwaveRedirect,
    finalOrderId,
    tx_ref,
    orderToDisplay,
    isCreatingOrder,
  ]);

  const formatCurrency = (val: number) => `₦${val.toLocaleString()}`;

  // -------------------------------------------------------------------
  // PDF DOWNLOAD & SHARE LOGIC
  // -------------------------------------------------------------------
  const handleDownloadPDF = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();

    if (!orderToDisplay) {
      console.error("Order details missing for PDF generation.");
      return;
    }

    // Build HTML for invoice
    const invoiceHtml = `
      <h2>Order Invoice</h2>
      <p><strong>Order ID:</strong> ${orderToDisplay.orderId}</p>
      <p><strong>Date:</strong> ${orderToDisplay.date}</p>
      <h3>Items</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="border:1px solid #ccc;padding:4px;">Name</th>
            <th style="border:1px solid #ccc;padding:4px;">Qty</th>
            <th style="border:1px solid #ccc;padding:4px;">Price</th>
            <th style="border:1px solid #ccc;padding:4px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderToDisplay.items
            .map(
              (item) => `
            <tr>
              <td style="border:1px solid #ccc;padding:4px;">${item.name}</td>
              <td style="border:1px solid #ccc;padding:4px;">${
                item.quantity
              }</td>
              <td style="border:1px solid #ccc;padding:4px;">${formatCurrency(
                item.price
              )}</td>
              <td style="border:1px solid #ccc;padding:4px;">${formatCurrency(
                item.price * item.quantity
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <h3>Summary</h3>
      <p><strong>Subtotal:</strong> ${formatCurrency(
        orderToDisplay.subtotal
      )}</p>
      <p><strong>Shipping:</strong> ${
        orderToDisplay.shippingFee > 0
          ? formatCurrency(orderToDisplay.shippingFee)
          : "To be discussed"
      }</p>
      <p><strong>Total:</strong> ${formatCurrency(
        orderToDisplay.totalAmount
      )}</p>
      <h3>Shipping Address</h3>
      <p>
        ${orderToDisplay.shippingAddress.address},<br/>
        ${orderToDisplay.shippingAddress.city}, ${
      orderToDisplay.shippingAddress.state
    },<br/>
        ${orderToDisplay.shippingAddress.country}
      </p>
    `;

    // Convert HTML to pdfmake format
    const pdfContent = htmlToPdfmake(invoiceHtml);

    // Download PDF
    pdfMake
      .createPdf({ content: pdfContent, defaultStyle: { font: "Helvetica" } })
      .download(`Order_${orderToDisplay.orderId}.pdf`);
  };

  const handleShare = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault();

    if (!orderToDisplay) {
      console.error("Order details missing for share.");
      return;
    }

    const shareData = {
      title: "Order Confirmation",
      text: `Order #${orderToDisplay.orderId} placed on ${
        orderToDisplay.date
      }. Total: ${formatCurrency(orderToDisplay.totalAmount)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => {
        console.error("Failed to share order via navigator.share", error);
      });
    } else {
      // Fallback: copy to clipboard (keep success toast for user feedback)
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      toast.success("Order details copied to clipboard!");
    }
  };

  // --- RENDER LOGIC ---

  if (!orderToDisplay) {
    // This is the clean, non-error path for missing data
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-background text-foreground">
        <div className="text-center max-w-lg w-full p-8 border rounded-lg shadow-lg space-y-6">
          <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-bold">Thank You!</h1>
          <p className="text-lg text-muted-foreground">
            We are confirming your transaction. Please check your email for the
            final confirmation or contact support if you believe there was an
            issue.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isVerifying || isCreatingOrder || !finalOrderId) {
    const statusMessage = isVerifying
      ? "Verifying payment with Flutterwave..."
      : "Finalizing order and sending confirmation email...";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
        {/* Optimistic Status Banner */}
        <div className="w-full text-center mb-4 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg flex items-center justify-center gap-2 max-w-4xl">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>

        {/* Render the actual order details in a functional, but visually subdued state */}
        <div className="text-center max-w-4xl w-full p-8 border rounded-lg shadow-lg space-y-8 opacity-70 pointer-events-none">
          <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
          <p className="text-lg text-muted-foreground">
            Order Ref:{" "}
            <span className="font-mono">{orderToDisplay.orderId}</span>
          </p>
          <OrderDisplay
            orderToDisplay={orderToDisplay}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    );
  }

  // FINAL SUCCESS VIEW (When finalOrderId is set)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="text-center max-w-4xl w-full p-8 border rounded-lg shadow-lg space-y-8">
        <div className="space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Your Order ID is:{" "}
            <span className="font-mono font-semibold text-primary">
              {orderToDisplay.orderId}
            </span>
            <br />
            Date: {orderToDisplay.date}
          </p>
        </div>

        {/* 🚨 MODIFICATION START: Replicate the Summary Step's detail layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
          {/* Left Column: Customer and Shipping */}
          <div className="space-y-6">
            {/* CUSTOMER DETAILS CARD (NEW) */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>
                  <strong>Name:</strong> {checkoutData.customerInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {checkoutData.customerInfo.email}
                </p>
                <p>
                  <strong>Phone:</strong> {checkoutData.customerInfo.phone}
                </p>
              </CardContent>
            </Card>

            {/* SHIPPING ADDRESS CARD (Replicated for clarity) */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>{orderToDisplay.shippingAddress.address}</p>
                <p>
                  {orderToDisplay.shippingAddress.city},{" "}
                  {orderToDisplay.shippingAddress.state}
                </p>
                <p>{orderToDisplay.shippingAddress.country}</p>
                <p className="italic text-muted-foreground">
                  Payment: {orderToDisplay.paymentMethod}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Totals and Items */}
          <div className="space-y-6">
            {/* Order Items Display */}
            <OrderDisplay
              orderToDisplay={orderToDisplay}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
        {/* 🚨 MODIFICATION END */}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          {/* ... (Buttons remain the same) ... */}
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Invoice
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" /> Share Order
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link href="/collections">
              <Home className="h-4 w-4" /> Back to Collections
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// --- DEFAULT EXPORT (The Wrapper to fix the context error) ---
// -------------------------------------------------------------------
export default function OrderSuccessPageWrapper() {
  // Provide a minimal default state for CheckoutProvider
  const defaultCheckoutState = {
    currentStep: 0,
    customerInfo: { name: "", email: "", phone: "" },
    // Use an empty object for shippingInfo if that's what the context expects for a null state
    shippingInfo: { address: "", city: "", state: "", country: "" },
    paymentMethod: "flutterwave",
    updateCheckoutData: () => {}, // Provide dummy functions
    goToNextStep: () => {},
    goToPreviousStep: () => {},
  };

  return (
    // The original OrderSuccessPage is renamed to OrderSuccessContent
    <Suspense fallback={<OrderSummarySkeleton />}>
      <CheckoutProvider>
        <OrderSuccessContent />
      </CheckoutProvider>
    </Suspense>
  );
}
