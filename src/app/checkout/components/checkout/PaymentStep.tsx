// PASTE THIS CODE INTO: components/checkout/PaymentStep.tsx
"use client";
import { useCheckout } from "@/context/checkout-context";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Truck } from "lucide-react";

export function PaymentStep() {
  const { checkoutData, updateCheckoutData, goToNextStep, goToPreviousStep } =
    useCheckout();

  const handlePaymentMethodChange = (value: "flutterwave" | "cod") => {
    updateCheckoutData({ paymentMethod: value });
  };

  const handleContinue = () => {
    goToNextStep();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Payment Method</h2>
        <p className="text-muted-foreground text-sm mt-1">
          How would you like to pay for your order?
        </p>
      </div>

      <RadioGroup
        defaultValue={checkoutData.paymentMethod}
        onValueChange={handlePaymentMethodChange}
        className="space-y-4"
      >
        <div className="flex items-center space-x-4 border rounded-md p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-all">
          <RadioGroupItem value="flutterwave" id="flutterwave" />
          <Label
            htmlFor="flutterwave"
            className="flex items-center gap-4 cursor-pointer w-full"
          >
            <CreditCard className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-semibold">Pay with Flutterwave</p>
              <p className="text-sm text-muted-foreground">
                Securely pay with your card, bank transfer, or USSD.
              </p>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-4 border rounded-md p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-all">
          <RadioGroupItem value="cod" id="cod" />
          <Label
            htmlFor="cod"
            className="flex items-center gap-4 cursor-pointer w-full"
          >
            <Truck className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-semibold">Pay on Delivery</p>
              <p className="text-sm text-muted-foreground">
                Pay with cash or transfer upon arrival.
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Back to Shipping
        </Button>
        <Button type="button" onClick={handleContinue}>
          Continue to Summary
        </Button>
      </div>
    </div>
  );
}
