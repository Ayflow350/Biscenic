// lib/api.ts

import * as z from "zod";

// --- Keep your existing postSignUp function and its types ---

// --- NEW: Define types and API function for Sign In ---
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"), // Simple check for presence
});

type SignInFormData = z.infer<typeof signInSchema>;

/**
 * Sends a POST request to your Node.js backend's login endpoint.
 * @param data The validated form data (email, password).
 * @returns The JSON response from the server, typically containing a user and a token.
 * @throws An error with the specific message from the backend if login fails.
 */
export const postSignIn = async (data: SignInFormData) => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`; // Adjust '/auth/login' to your actual route

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Your backend likely throws an error like "Invalid credentials..."
    throw new Error(errorData.message || "Failed to sign in.");
  }

  return response.json();
};
