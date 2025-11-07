// lib/data.ts

import { IOrder, OrderStatus, PaymentStatus } from "./definitions";

// (Keep your fetchUsers and fetchProducts functions)

const mockOrders: IOrder[] = [
  {
    _id: "ORD1001",
    customerName: "John Doe",
    customerEmail: "john.d@example.com",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    items: [
      {
        productId: "PROD001",
        name: "Aurora Dining Table",
        price: 1299.99,
        quantity: 1,
      },
      {
        productId: "PROD004",
        name: "Starlight Lamp",
        price: 199.0,
        quantity: 2,
      },
    ],
    totalAmount: 1697.99,
    status: OrderStatus.PROCESSING,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: "Credit Card",
    orderDate: new Date("2025-10-28T10:30:00Z"),
  },
  {
    _id: "ORD1002",
    customerName: "Jane Smith",
    customerEmail: "jane.s@example.com",
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Someville",
      state: "NY",
      zipCode: "67890",
      country: "USA",
    },
    items: [
      { productId: "PROD002", name: "Nebula Sofa", price: 2499.0, quantity: 1 },
    ],
    totalAmount: 2499.0,
    status: OrderStatus.SHIPPED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: "PayPal",
    orderDate: new Date("2025-10-25T14:00:00Z"),
  },
  {
    _id: "ORD1003",
    customerName: "Alice Johnson",
    customerEmail: "alice.j@example.com",
    shippingAddress: {
      street: "789 Pine Ln",
      city: "Metropolis",
      state: "TX",
      zipCode: "10112",
      country: "USA",
    },
    items: [
      {
        productId: "PROD007",
        name: "Eclipse Coffee Table",
        price: 499.0,
        quantity: 1,
      },
    ],
    totalAmount: 499.0,
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: "Credit Card",
    orderDate: new Date("2025-10-15T09:15:00Z"),
  },
  {
    _id: "ORD1004",
    customerName: "Robert Brown",
    customerEmail: "robert.b@example.com",
    shippingAddress: {
      street: "321 Birch Rd",
      city: "Gotham",
      state: "IL",
      zipCode: "13141",
      country: "USA",
    },
    items: [
      {
        productId: "PROD005",
        name: "Cosmic Armchair",
        price: 899.0,
        quantity: 2,
      },
    ],
    totalAmount: 1798.0,
    status: OrderStatus.CANCELED,
    paymentStatus: PaymentStatus.FAILED,
    paymentMethod: "Credit Card",
    orderDate: new Date("2025-10-29T11:00:00Z"),
  },
];

export async function fetchOrders(): Promise<IOrder[]> {
  // Simulate a database delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders;
}

export async function fetchOrderById(orderId: string): Promise<IOrder | null> {
  // Simulate a database delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const order = mockOrders.find((order) => order._id === orderId);
  return order ?? null; // ✅ ensures null, never undefined
}
