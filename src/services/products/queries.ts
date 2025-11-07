// services/products/queries.ts

import { mockProductData } from "@/lib/product-mock-data";
import type { Product } from "@/app/types";

// This is our fake "useProduct" hook.
// It finds the product in our mock data based on the slug.
export const useProduct = (
  slug: string
): { data: Product | undefined; isLoading: boolean; error: Error | null } => {
  const product = mockProductData[slug];

  // Simulate a loading state (optional, but good practice)
  if (!product) {
    // You can return a loading state or an error if the product isn't found
    return {
      data: undefined,
      isLoading: false,
      error: new Error("Product not found"),
    };
  }

  // Return the data in the same shape as a real data-fetching hook would
  return {
    data: product,
    isLoading: false,
    error: null,
  };
};
