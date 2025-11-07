// PASTE THIS CODE INTO: lib/api.ts

import * as z from "zod";

// --- FIX 1: DEFINE PRECISE TYPES FOR NESTED OBJECTS TO AVOID 'any' ---
export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
}

export interface IMaterialOptionPayload {
  name: string;
  price: number;
  status: AvailabilityStatus;
}

export interface IFinishOptionPayload {
  colorName: string;
  hexCode?: string;
  texture?: string;
  status: AvailabilityStatus;
}

// This is the Zod schema for the final data SENT to your backend
const productCreationSchema = z.object({
  name: z.string(),
  description: z.string(),
  pricing: z.number(),
  category: z.string(),
  stockQuantity: z.number(),
  availabilityStatus: z.string(),
  collectionId: z.string(),
  discount: z.number().optional(),
  images: z.array(z.string()), // Images must be an array of URLs (strings)
  features: z.array(z.string()),
  specifications: z.array(z.string()),
  // Use the specific types
  materialOptions: z.array(z.custom<IMaterialOptionPayload>()).optional(),
  finishOptions: z.array(z.custom<IFinishOptionPayload>()).optional(),
});

type ProductCreationData = z.infer<typeof productCreationSchema>;

/**
 * 1. Fetches the list of collections from your backend.
 */
export const fetchCollections = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/collections`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch collections.");
  }
  return response.json();
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env
      .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Image upload to Cloudinary failed.");
  }

  const data = await response.json();
  return data.secure_url;
};

export const createProduct = async (productData: ProductCreationData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create product.");
  }

  return response.json();
};

export const fetchProducts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }
  return response.json();
};
