// CREATE THIS FILE AND PASTE THE CODE: components/checkout/SummaryStep.tsx
"use client";
import { useState } from "react";
import { useCheckout } from "@/context/checkout-context";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FlutterWaveButton } from "flutterwave-react-v3";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/lib/PaymentApi"; // Ensure this path is correct
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SummaryStep() {
  const { checkoutData, goToPreviousStep } = useCheckout();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const shipping =
    checkoutData.shippingInfo.state?.toLowerCase() === "lagos" ? 0 : 6000;
  const total = subtotal + shipping;

  const [txRef] = useState(() => Date.now().toString());

  const fwConfig = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: txRef,
    amount: total,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: checkoutData.customerInfo.email,
      phone_number: checkoutData.customerInfo.phone,
      name: checkoutData.customerInfo.name,
    },
    customizations: {
      title: "Biscenic Furniture",
      description: "Payment for items in cart",
      logo: "https://your-logo-url.com/logo.png",
    },
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Order Placed Successfully!", {
        description: `Your order #${data.orderId} has been confirmed.`,
      });
      clearCart();
      router.push(`/order-success?orderId=${data.orderId}`);
    },
    onError: (error) => {
      toast.error("Failed to Place Order", { description: error.message });
    },
  });

  const handlePlaceOrderCOD = () => {
    const orderData = {
      ...checkoutData,
      items: cart.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      totalAmount: total,
      shippingInfo: {
        ...checkoutData.shippingInfo,
        postalCode: checkoutData.shippingInfo.zipCode || "",
        country: checkoutData.shippingInfo.country || "",
      },
    };
    mutate(orderData);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Order Summary & Confirmation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isPending}
        >
          Back to Payment
        </Button>
        {checkoutData.paymentMethod === "cod" ? (
          <Button
            type="button"
            onClick={handlePlaceOrderCOD}
            disabled={isPending}
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </Button>
        ) : (
          <FlutterWaveButton
            {...fwConfig}
            text={
              isPending ? "Processing..." : `Pay ₦${total.toLocaleString()}`
            }
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            disabled={isPending}
            callback={(response) => {
              if (response.status === "successful") {
                mutate({
                  ...checkoutData,
                  items: cart.map((item) => ({
                    ...item,
                    price: Number(item.price),
                  })),
                  totalAmount: total,
                  paymentDetails: { ...response },
                  shippingInfo: {
                    ...checkoutData.shippingInfo,
                    postalCode: checkoutData.shippingInfo.zipCode || "",
                    country: checkoutData.shippingInfo.country || "",
                  },
                });
              } else {
                toast.error("Payment Not Completed", {
                  description:
                    "Your payment was not completed. Please try again.",
                });
              }
            }}
            onClose={() => {
              toast.info("Payment modal closed.");
            }}
          />
        )}
      </div>
    </div>
  );
}
