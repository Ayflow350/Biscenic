// CREATE THIS FILE AND PASTE THE CODE: components/checkout/SummaryStep.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCheckout } from "@/context/checkout-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// App-specific hooks and utilities
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/lib/PaymentApi"; // Your existing function to create an order in the DB
import {
  useInitializePayment,
  useVerifyPayment,
} from "@/lib/flutterwave-queries"; // Ensure this path is correct

export function SummaryStep() {
  // --- Core Hooks ---
  const { checkoutData, goToPreviousStep } = useCheckout();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Calculations ---
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shipping =
    checkoutData.shippingInfo.state?.toLowerCase() === "lagos" ? 0 : 6000;
  const total = subtotal + shipping;

  // --- Payment & Order Mutations ---
  const initializePaymentMutation = useInitializePayment();
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Order Placed Successfully!", {
        description: `Your order #${data.orderId} has been confirmed.`,
      });
      clearCart();
      // Redirect to a success page to clear URL params and prevent re-triggering
      router.push(`/order-success?orderId=${data.orderId}`);
    },
    onError: (error) => {
      toast.error("Failed to Save Order", {
        description:
          "Your payment was successful, but we failed to save the order. Please contact support.",
      });
    },
  });

  // --- Flutterwave Verification Flow ---
  const tx_ref = searchParams.get("tx_ref");
  const status = searchParams.get("status");

  const {
    data: verificationData,
    isLoading: isVerifying,
    isSuccess: isVerificationSuccess,
    isError: isVerificationError,
  } = useVerifyPayment(
    tx_ref as string,
    !!tx_ref && status === "successful" // Only run query if params are present and status is 'successful'
  );

  // EFFECT: Runs after successful payment verification to create the order
  useEffect(() => {
    if (isVerificationSuccess && verificationData) {
      // The payment has been verified by our backend, now we can safely create the order.
      const orderData = {
        ...checkoutData,
        items: cart.map((item) => ({ ...item, price: Number(item.price) })),
        totalAmount: total,
        paymentDetails: {
          ...verificationData.data,
          gateway: "flutterwave",
        },
        shippingInfo: {
          ...checkoutData.shippingInfo,
          postalCode: checkoutData.shippingInfo.zipCode || "",
          country: checkoutData.shippingInfo.country || "",
        },
      };
      createOrderMutation.mutate(orderData);
    }
    if (isVerificationError) {
      toast.error("Payment Verification Failed", {
        description:
          "We could not confirm your payment. Please contact support if you were debited.",
      });
    }
  }, [isVerificationSuccess, isVerificationError, verificationData]);

  // --- Event Handlers ---
  const handlePlaceOrderCOD = () => {
    const orderData = {
      ...checkoutData,
      items: cart.map((item) => ({ ...item, price: Number(item.price) })),
      totalAmount: total,
      paymentMethod: "cod" as "cod",
      shippingInfo: {
        ...checkoutData.shippingInfo,
        postalCode: checkoutData.shippingInfo.zipCode || "",
        country: checkoutData.shippingInfo.country || "",
      },
    };
    createOrderMutation.mutate(orderData);
  };

  const handleFlutterwavePayment = () => {
    initializePaymentMutation.mutate({
      email: checkoutData.customerInfo.email,
      amount: total,
      currency: "NGN",
      name: checkoutData.customerInfo.name,
      phonenumber: checkoutData.customerInfo.phone,
      gateway: "flutterwave",
    });
  };

  // --- Loading State for Verification ---
  if (isVerifying || createOrderMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-semibold">
          {isVerifying
            ? "Verifying your payment..."
            : "Finalizing your order..."}
        </h2>
        <p className="text-muted-foreground">
          Please do not close this window.
        </p>
      </div>
    );
  }

  // --- Component JSX ---
  const isProcessing =
    initializePaymentMutation.isPending || createOrderMutation.isPending;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Order Summary & Confirmation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer & Shipping Details Cards (No Change) */}
        <div className="space-y-6">
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
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>{checkoutData.shippingInfo.address}</p>
              <p>
                {checkoutData.shippingInfo.city},{" "}
                {checkoutData.shippingInfo.state}
              </p>
              <p>{checkoutData.shippingInfo.country}</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Totals Card (No Change) */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">
                {checkoutData.paymentMethod === "cod"
                  ? "Pay on Delivery"
                  : "Flutterwave"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isProcessing}
        >
          Back to Payment
        </Button>

        {checkoutData.paymentMethod === "cod" ? (
          <Button
            type="button"
            onClick={handlePlaceOrderCOD}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Place Order
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFlutterwavePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Pay ₦{total.toLocaleString()}
          </Button>
        )}
      </div>
    </div>
  );
}
