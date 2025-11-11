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
      router.push(`/order-success?orderId=${data.orderId}`);
    },
    onError: (error) => {
      console.error("Order creation failed:", error);
      toast.error("Failed to Save Order", {
        description:
          "Your payment was successful, but we failed to save the order. Please contact support.",
      });
      router.push(`/order-error`);
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
        customerInfo: checkoutData.customerInfo,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentDetails: {
          ...verificationData.data,
          gateway: "flutterwave",
        },
        shippingInfo: {
          address: checkoutData.shippingInfo.address,
          state: checkoutData.shippingInfo.state,
          city: checkoutData.shippingInfo.city,
          country: checkoutData.shippingInfo.country ?? "",
          postalCode: checkoutData.shippingInfo.zipCode ?? "",
          apartment: checkoutData.shippingInfo.apartment ?? "",
        },
        paymentMethod: "flutterwave" as const,
      };

      createOrderMutation.mutate(orderData);
    }
    if (isVerificationError) {
      toast.error("Payment Verification Failed", {
        description:
          "We could not confirm your payment. Please contact support if you were debited.",
      });
      router.push(`/order-error`);
    }
  }, [
    isVerificationSuccess,
    isVerificationError,
    verificationData,
    checkoutData,
    cart,
    total,
    createOrderMutation,
    router,
  ]);

  const handlePlaceOrderCOD = () => {
    const orderData = {
      customerInfo: checkoutData.customerInfo,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      totalAmount: total,
      paymentMethod: "cod" as "cod",
      shippingInfo: {
        address: checkoutData.shippingInfo.address,
        state: checkoutData.shippingInfo.state,
        city: checkoutData.shippingInfo.city,
        country: checkoutData.shippingInfo.country ?? "",
        postalCode: checkoutData.shippingInfo.zipCode ?? "",
        apartment: checkoutData.shippingInfo.apartment ?? "",
      },
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: (data) => {
        toast.success("Order Placed Successfully!", {
          description: `Your order #${data.orderId} has been confirmed.`,
        });
        router.push(
          `https://biscenic-leun.vercel.app/order-success?orderId=${data.orderId}`
        );
      },
      onError: (error) => {
        console.error("COD order save failed:", error);
        toast.error("Failed to Save Order", {
          description:
            "There was an issue saving your COD order. Please try again.",
        });
        router.push(`https://biscenic-leun.vercel.app/order-error`);
      },
    });
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
      <div className="flex flex-col items-center justify-center space-y-4 py-16 px-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl sm:text-2xl font-semibold">
          {isVerifying
            ? "Verifying your payment..."
            : "Finalizing your order..."}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Please do not close this window.
        </p>
      </div>
    );
  }

  const isProcessing =
    initializePaymentMutation.isPending || createOrderMutation.isPending;

  return (
    <div className="space-y-8 px-3 sm:px-6 md:px-8 py-6 max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-center md:text-left">
        Order Summary & Confirmation
      </h2>

      {/* ✅ Layout grid with mobile stacking */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
        {/* Left column */}
        <div className="flex flex-col space-y-5">
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm sm:text-base space-y-1">
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

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm sm:text-base space-y-1">
              <p>{checkoutData.shippingInfo.address}</p>
              <p>
                {checkoutData.shippingInfo.city},{" "}
                {checkoutData.shippingInfo.state}
              </p>
              <p>{checkoutData.shippingInfo.country}</p>
              <p className="italic text-muted-foreground text-xs sm:text-sm">
                Shipping: {shippingText}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <Card className="w-full md:h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Order Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shippingText}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-base sm:text-lg">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-sm sm:text-base">
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

      {/* ✅ Button group - stacks on mobile */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
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
