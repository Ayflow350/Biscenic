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
    <div className="space-y-8 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-semibold">Payment Method</h2>
        <p className="text-muted-foreground text-sm mt-1">
          How would you like to pay for your order?
        </p>
      </div>

      {/* Payment Options */}
      <RadioGroup
        defaultValue={checkoutData.paymentMethod}
        onValueChange={handlePaymentMethodChange}
        className="space-y-4"
      >
        {/* Flutterwave Option */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border rounded-md p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-all">
          <RadioGroupItem value="flutterwave" id="flutterwave" />
          <Label
            htmlFor="flutterwave"
            className="flex items-start sm:items-center gap-4 cursor-pointer w-full"
          >
            <CreditCard className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-base sm:text-lg">
                Pay with Flutterwave
              </p>
              <p className="text-sm text-muted-foreground leading-snug">
                Securely pay with your card, bank transfer, or USSD.
              </p>
            </div>
          </Label>
        </div>

        {/* Cash on Delivery Option */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border rounded-md p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-all">
          <RadioGroupItem value="cod" id="cod" />
          <Label
            htmlFor="cod"
            className="flex items-start sm:items-center gap-4 cursor-pointer w-full"
          >
            <Truck className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-base sm:text-lg">
                Pay on Delivery
              </p>
              <p className="text-sm text-muted-foreground leading-snug">
                Pay with cash or transfer upon arrival.
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          className="w-full sm:w-auto"
        >
          Back to Shipping
        </Button>

        <Button
          type="button"
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          Continue to Summary
        </Button>
      </div>
    </div>
  );
}
