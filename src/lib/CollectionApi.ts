// PASTE THIS CODE INTO: lib/api.ts

import * as z from "zod";

// --- ZOD SCHEMAS ---
// This is used by the createProduct function
const productCreationSchema = z.object({
  name: z.string(),
  description: z.string(),
  pricing: z.number(),
  category: z.string(),
  stockQuantity: z.number(),
  availabilityStatus: z.string(),
  collectionId: z.string(),
  discount: z.number().optional(),
  images: z.array(z.string()),
  features: z.array(z.string()),
  specifications: z.array(z.string()),
  materialOptions: z.array(z.any()).optional(),
  finishOptions: z.array(z.any()).optional(),
});
type ProductCreationData = z.infer<typeof productCreationSchema>;

// This is used by the createCollection function
const collectionCreationSchema = z.object({
  name: z.string(),
  description: z.string(),
  bannerImage: z.string().optional(),
  featuredImage: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
});
type CollectionCreationData = z.infer<typeof collectionCreationSchema>;

// --- API FUNCTIONS ---

/**
 * MISSING FUNCTION 1: Fetches the list of collections from your backend.
 * This is needed for the product form dropdown and the collections list page.
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

/**
 * MISSING FUNCTION 2: Uploads a single image file to Cloudinary.
 * This is a reusable utility needed by both the product and collection forms.
 */
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

/**
 * Sends the final, processed collection data to your backend.
 */
export const createCollection = async (
  collectionData: CollectionCreationData
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/collections`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collectionData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create collection.");
  }

  return response.json();
};

/**
 * Sends the final, processed product data to your backend.
 * (This function should also be in this file)
 */
export const createProduct = async (productData: ProductCreationData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create product.");
  }

  return response.json();
};
