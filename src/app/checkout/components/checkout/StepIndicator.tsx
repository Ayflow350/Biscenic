"use client";
import { useCheckout, STEPS } from "@/context/checkout-context";
import { Check } from "lucide-react";

export function StepIndicator() {
  const { currentStep } = useCheckout();
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <nav className="flex items-center justify-center space-x-4">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${isCompleted ? "bg-primary text-primary-foreground" : ""}
              ${
                isActive
                  ? "bg-primary/20 text-primary border-2 border-primary"
                  : ""
              }
              ${
                !isCompleted && !isActive
                  ? "bg-muted text-muted-foreground"
                  : ""
              }
              `}
            >
              {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <span
              className={`hidden md:block text-sm ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
