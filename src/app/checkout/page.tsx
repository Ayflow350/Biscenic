"use client";

import { CheckoutProvider, useCheckout } from "@/context/checkout-context";
import { StepIndicator } from "./components/checkout/StepIndicator";
import { CartStep } from "./components/checkout/CartStep";
import { CustomerInfoStep } from "./components/checkout/CustomerInfoStep";
import { ShippingStep } from "./components/checkout/ShippingStep";
import { PaymentStep } from "./components/checkout/PaymentStep"; // 1. Import the new component
import { SummaryStep } from "./components/checkout/SummaryStep";

function CheckoutFlow() {
  const { currentStep } = useCheckout();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <StepIndicator />
      <div className="border rounded-xl p-6 md:p-8">
        {currentStep === "Cart" && <CartStep />}
        {currentStep === "Customer Info" && <CustomerInfoStep />}
        {currentStep === "Shipping" && <ShippingStep />}
        {currentStep === "Payment" && <PaymentStep />}
        {/* 2. Render the new component */}
        {currentStep === "Summary" && <SummaryStep />}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutFlow />
    </CheckoutProvider>
  );
}
