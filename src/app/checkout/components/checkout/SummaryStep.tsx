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
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/lib/PaymentApi";
import {
  useInitializePayment,
  useVerifyPayment,
} from "@/lib/flutterwave-queries";

export function SummaryStep() {
  const { checkoutData, goToPreviousStep } = useCheckout();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const shippingText = "Details will be discussed";
  const total = subtotal;

  const initializePaymentMutation = useInitializePayment();
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Order Placed Successfully!", {
        description: `Your order #${data.orderId} has been confirmed.`,
      });
      clearCart();
      router.push(`/order-success?orderId=${data.orderId}`);
    },
    onError: () => {
      toast.error("Failed to Save Order", {
        description:
          "Your payment was successful, but we failed to save the order. Please contact support.",
      });
    },
  });

  const tx_ref = searchParams.get("tx_ref");
  const status = searchParams.get("status");

  const {
    data: verificationData,
    isLoading: isVerifying,
    isSuccess: isVerificationSuccess,
    isError: isVerificationError,
  } = useVerifyPayment(tx_ref as string, !!tx_ref && status === "successful");

  useEffect(() => {
    if (isVerificationSuccess && verificationData) {
      const orderData = {
        ...checkoutData,
        items: cart.map((item) => ({ ...item, price: Number(item.price) })),
        totalAmount: total,
        paymentDetails: {
          ...verificationData.data,
          gateway: "flutterwave",
        },
        shippingInfo: {
          city: checkoutData.shippingInfo.city,
          country: checkoutData.shippingInfo.country ?? "",
          postalCode: checkoutData.shippingInfo.zipCode ?? "",
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
  }, [
    isVerificationSuccess,
    isVerificationError,
    verificationData,
    checkoutData,
    cart,
    total,
    createOrderMutation,
  ]);

  const handlePlaceOrderCOD = () => {
    const orderData = {
      ...checkoutData,
      items: cart.map((item) => ({ ...item, price: Number(item.price) })),
      totalAmount: total,
      paymentMethod: "cod" as "cod",
      shippingInfo: {
        city: checkoutData.shippingInfo.city,
        country: checkoutData.shippingInfo.country ?? "",
        postalCode: checkoutData.shippingInfo.zipCode ?? "",
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

  if (isVerifying || createOrderMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12 px-4 text-center">
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

  const isProcessing =
    initializePaymentMutation.isPending || createOrderMutation.isPending;

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl font-semibold text-center md:text-left">
        Order Summary & Confirmation
      </h2>

      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left side */}
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
              <p className="italic text-muted-foreground">
                Shipping: {shippingText}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right side */}
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
              <span className="font-medium text-foreground">
                {shippingText}
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          Back to Payment
        </Button>

        {checkoutData.paymentMethod === "cod" ? (
          <Button
            type="button"
            onClick={handlePlaceOrderCOD}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Place Order
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFlutterwavePayment}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pay ₦{total.toLocaleString()}
          </Button>
        )}
      </div>
    </div>
  );
}
