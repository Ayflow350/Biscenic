// lib/definitions.ts
// This file serves as a single source of truth for all data types used across the frontend.

// --- SHARED ENUMS ---

/** Defines the availability of a product or its options. */
export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
}

/** Defines the processing status of a customer's order. */
export enum OrderStatus {
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELED = "Canceled",
}

/** Defines the payment status of an order or transaction. */
export enum PaymentStatus {
  PAID = "Paid",
  PENDING = "Pending",
  FAILED = "Failed",
}

// --- USER ---

/** Represents a user account in the system. */
export type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  registeredAt: string; // Should be a date string
};

// --- PRODUCTS & COLLECTIONS ---

/** Represents a customizable material option for a product. */
export interface IMaterialOption {
  name: string;
  price: number;
  status: AvailabilityStatus;
}

/** Represents a customizable finish/color option for a product. */
export interface IFinishOption {
  colorName: string;
  hexCode?: string;
  texture?: string;
  status: AvailabilityStatus;
}

/**
 * NEW: Represents a product collection.
 * This matches the data structure from your Mongoose model.
 */
export interface ICollection {
  _id: string; // The MongoDB document ID
  name: string;
  slug: string;
  description: string;
  bannerImage?: string;
  featuredImage?: string;
  highlights?: string[];
  tags?: string[];
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** A simplified Product type, ideal for displaying in data tables. */
export type Product = {
  id: string;
  name: string;
  category: string;
  pricing: number;
  stockQuantity: number;
  availabilityStatus: AvailabilityStatus;
};

// --- ORDERS ---

/** Represents a single item within an order. */
export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/** Represents a complete customer order. */
export interface IOrder {
  _id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  orderDate: Date;
}

// --- PAYMENTS ---

/** Represents a single payment transaction. */
export interface IPayment {
  _id: string; // Transaction ID from the payment processor
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;

  paymentDate: Date;
}
