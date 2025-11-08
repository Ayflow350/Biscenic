import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
// ✅ CHANGE 1: Import toast directly from sonner
import { toast } from "sonner";

// The API URL is now hardcoded for testing purposes.
const API_URL = "http://localhost:5050/api/payments";

interface InitializePaymentData {
  email: string;
  amount: number;
  currency: "NGN";
  name: string;
  phonenumber: string;
  gateway: "flutterwave";
}

// Function to call your backend's INITIALIZE endpoint
const initializePayment = async (data: InitializePaymentData) => {
  const fullUrl = `${API_URL}/initialize`;

  // LOGGING THE EXACT POINT THE API CALL IS MADE
  console.log("FLUTTERWAVE: Making API call to:", fullUrl, "with data:", data);

  const response = await axios.post(fullUrl, data);
  return response.data;
};

// Function to call your backend's VERIFY endpoint
const verifyPayment = async (reference: string) => {
  const fullUrl = `${API_URL}/verify?reference=${reference}&gateway=flutterwave`;
  console.log("FLUTTERWAVE: Verifying payment at:", fullUrl);
  const response = await axios.get(fullUrl);
  return response.data;
};

/**
 * HOOK: useInitializePayment
 */
export const useInitializePayment = () => {
  // ✅ CHANGE 2: The useToast() hook is no longer needed.

  return useMutation({
    mutationFn: initializePayment,
    onSuccess: (response) => {
      if (response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        // This will trigger the onError callback below.
        throw new Error("Failed to retrieve Flutterwave payment link.");
      }
    },
    onError: (error) => {
      console.error("Flutterwave initialization error:", error);

      // ✅ CHANGE 3: Use sonner's direct API for error toasts.
      toast.error("Payment Error", {
        description:
          "Could not connect to the payment gateway. Please try again.",
      });
    },
  });
};

/**
 * HOOK: useVerifyPayment
 * (No changes were needed here as it does not use the toast hook)
 */
export const useVerifyPayment = (reference: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["verifyFlutterwavePayment", reference],
    queryFn: () => verifyPayment(reference),
    // This query will only run if 'enabled' is true and a 'reference' exists.
    enabled: enabled && !!reference,
    // We don't want to retry verification automatically.
    retry: false,
  });
};
