// lib/api.ts
import * as z from "zod";

// Define a Zod schema that matches the data your form will send.
const signUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Create a TypeScript type from the schema.
type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Sends a POST request to your Node.js backend's registration endpoint.
 * This function is designed to be used with TanStack Query's useMutation.
 * @param data The validated form data (name, email, password).
 * @returns The JSON response from the server.
 * @throws An error with the specific message from the backend if the request fails.
 */
export const postSignUp = async (data: SignUpFormData) => {
  // Construct the full API URL from your environment variables.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`; // Adjust if your route is different

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Send the data as a JSON string
  });

  // Handle non-successful responses (like 409 Conflict when user exists).
  if (!response.ok) {
    const errorData = await response.json();
    // This throws an error that `onError` in useMutation will catch.
    throw new Error(errorData.message || "An unknown error occurred.");
  }

  // If successful, return the JSON payload.
  return response.json();
};
