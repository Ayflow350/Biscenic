// src/context/checkout-context.tsx (CORRECTED)

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
// Assuming you have toast
// import { toast } from "sonner";

// Define the steps of our checkout process (Remains the same)
export const STEPS = [
  "Cart",
  "Customer Info",
  "Shipping",
  "Payment",
  "Summary",
] as const;

export type Step = (typeof STEPS)[number];

// Define the shape of the data we'll collect (Remains the same)
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

// Define the shape of our context (Remains the same)
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

// Define the Session Storage Key
const CHECKOUT_STORAGE_KEY = "latest_checkout_data";

// Define the initial state (Used if no data is in storage)
const initialCheckoutData: CheckoutData = {
  customerInfo: { name: "", email: "", phone: "" },
  shippingInfo: { address: "", city: "", state: "" },
  paymentMethod: "flutterwave",
};

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  // 🚨 1. Initialization logic that retrieves data from session storage
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Return saved data, merging it with defaults in case of missing fields
          return { ...initialCheckoutData, ...parsed };
        }
      } catch (error) {
        console.error(
          "Could not load checkout data from session storage:",
          error
        );
      }
    }
    return initialCheckoutData;
  });

  const [currentStep, setCurrentStep] = useState<Step>("Cart");

  // 🚨 2. Effect to SAVE data to session storage whenever checkoutData changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          CHECKOUT_STORAGE_KEY,
          JSON.stringify(checkoutData)
        );
      } catch (error) {
        console.error(
          "Could not save checkout data to session storage:",
          error
        );
      }
    }
  }, [checkoutData]);

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

// Custom hook to easily access the context (Remains the same)
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
