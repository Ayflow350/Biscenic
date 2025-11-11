// lib/api.ts

// ... (your existing API functions)

// Define the shape of the data to be sent when creating an order
// Define a specific type for customer information
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  // Add other relevant fields as needed
}

// Define a specific CartItem type (replace fields with your actual cart item structure)
interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  // Add other relevant fields as needed
}

interface ShippingInfo {
  city: string;
  postalCode: string;
  country: string;
  // Add other relevant fields as needed
}

interface OrderCreationPayload {
  items: CartItem[]; // Use the specific CartItem type from your cart context
  totalAmount: number;
  paymentDetails?: Record<string, unknown>; // Optional: To store transaction details from Flutterwave
  shippingInfo: ShippingInfo; // Use the specific shipping info type
  paymentMethod: "flutterwave" | "cod";
}

/**
 * Creates a new order in your database.
 */
export const createOrder = async (orderData: OrderCreationPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create order.");
  }

  return response.json();
};
