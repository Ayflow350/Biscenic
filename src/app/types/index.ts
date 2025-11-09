// types/index.ts

// ‼️ Single Variant Representation (for UI control + mapping)
export interface Variant {
  displayName: string; // Variant name (e.g., “Eclipsera”)
  imageId: string; // Corresponds to ProductImage._id
  sku?: string; // Optional SKU per variant
  priceDiff?: number; // Price difference (optional: + or -)
  description?: string; // Optional variant description text
}

// ✅ Image associated with a product or variant
export interface ProductImage {
  _id: string; // Unique image reference
  url: string;
  isMain: boolean;
  styleName?: string; // Matches variant.displayName when applicable
  alt?: string; // Optional accessibility alt

  // >>> ADDED: Allows an image to directly override the product's main display name
  displayNameOverride?: string;
}

// ✅ Category
export interface ProductCategory {
  name: string;
  description?: string;
}

// ✅ Main product interface
export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: ProductCategory;
  images: ProductImage[];
  availability?: AvailabilityStatus;

  // Optional: link back to variant group
  variants?: Variant[];
  description?: string;
  sku?: string; // Base SKU
  tags?: string[];
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
}

// ✅ Enum remains valid
export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
}
