"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the steps of our checkout process
export const STEPS = [
  "Cart",
  "Customer Info",
  "Shipping",
  "Payment",
  "Summary",
] as const;

export type Step = (typeof STEPS)[number];

// Define the shape of the data we'll collect
interface CheckoutData {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    country?: string;
    apartment?: string;
    zipCode?: string;
  };
  paymentMethod: "flutterwave" | "cod";
}

// Define the shape of our context
interface CheckoutContextType {
  currentStep: Step;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: Step) => void;
  checkoutData: CheckoutData;
  updateCheckoutData: (data: Partial<CheckoutData>) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<Step>("Cart");
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customerInfo: { name: "", email: "", phone: "" },
    shippingInfo: { address: "", city: "", state: "" },
    paymentMethod: "flutterwave",
  });

  const goToNextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  const goToStep = (step: Step) => {
    if (STEPS.includes(step)) {
      setCurrentStep(step);
    }
  };

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  return (
    <CheckoutContext.Provider
      value={{
        currentStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        checkoutData,
        updateCheckoutData,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom hook to easily access the context
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
