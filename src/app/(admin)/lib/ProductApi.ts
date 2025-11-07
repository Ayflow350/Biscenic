// lib/ProductApi.ts

// --- FIX 1: DEFINE PRECISE TYPES FOR NESTED OBJECTS ---
// These interfaces and enums should mirror the structure in your Mongoose schema.

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
  texture?: string; // Added texture to match your schema
  status: AvailabilityStatus;
}

// This is the final, processed data type that will be sent to your backend.
interface ProductCreationPayload {
  name: string;
  description: string;
  pricing: number;
  category: string;
  stockQuantity: number;
  availabilityStatus: string;
  collectionId: string;
  discount?: number;
  images: string[]; // Array of URLs
  features: string[];
  specifications: string[];

  // --- FIX 2: USE THE NEW, SPECIFIC TYPES INSTEAD OF 'any[]' ---
  materialOptions?: IMaterialOptionPayload[];
  finishOptions?: IFinishOptionPayload[];
}

/**
 * -------------------------------------------
 * FUNCTIONS USED BY YOUR PRODUCT FORM
 * -------------------------------------------
 */

/**
 * Fetches the list of collections to populate the dropdown.
 */
export const fetchCollections = async (): Promise<
  { _id: string; name: string }[]
> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/collections`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch collections.");
  }
  return response.json();
};

/**
 * Uploads a single image file directly to your Cloudinary account.
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
    console.error("Cloudinary upload failed:", await response.json());
    throw new Error("Image upload failed. Please try again.");
  }

  const data = await response.json();
  return data.secure_url;
};

/**
 * Sends the final, complete product data to your backend to be saved in MongoDB.
 */
export const createProduct = async (productData: ProductCreationPayload) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${your_auth_token}`
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to create the product on the server."
    );
  }

  return response.json();
};

/**
 * -------------------------------------------
 * OTHER CRUD FUNCTIONS
 * -------------------------------------------
 */

/**
 * Fetches all products from your backend.
 */
export const fetchProducts = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }
  return response.json();
};

/**
 * Updates an existing product using the PATCH method.
 */
export const updateProduct = async ({
  productId,
  updateData,
}: {
  productId: string;
  updateData: Partial<ProductCreationPayload>;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${your_auth_token}`
      },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update product.");
  }

  return response.json();
};

/**
 * Deletes a product from your backend.
 */
export const deleteProduct = async (productId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        // 'Authorization': `Bearer ${your_auth_token}`
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete product.");
  }

  return { success: true, message: "Product deleted successfully." };
};
