// lib/data.ts

import {
  User,
  Product,
  AvailabilityStatus,
  IOrder,
  OrderStatus,
  PaymentStatus,
  IPayment,
} from "./definitions";

//
// USERS
//
export async function fetchUsers(): Promise<User[]> {
  return [
    {
      id: "USR001",
      name: "John Doe",
      email: "john.d@example.com",
      status: "active",
      registeredAt: "2025-10-15",
    },
    {
      id: "USR002",
      name: "Jane Smith",
      email: "jane.s@example.com",
      status: "inactive",
      registeredAt: "2025-09-20",
    },
    {
      id: "USR003",
      name: "Alice Johnson",
      email: "alice.j@example.com",
      status: "active",
      registeredAt: "2025-11-01",
    },
  ];
}

//
// PRODUCTS
//
export async function fetchProducts(): Promise<Product[]> {
  return [
    {
      id: "PROD001",
      name: "Aurora Dining Table",
      category: "Tables",
      pricing: 1299.99,
      stockQuantity: 15,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    },
    {
      id: "PROD002",
      name: "Nebula Sofa",
      category: "Seating",
      pricing: 2499.0,
      stockQuantity: 8,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    },
  ];
}

//
// ORDERS
//
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
];

export async function fetchOrders(): Promise<IOrder[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders;
}

export async function fetchOrderById(orderId: string): Promise<IOrder | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const order = mockOrders.find((order) => order._id === orderId);
  return order ?? null;
}

//
// PAYMENTS
//
const mockPayments: IPayment[] = [
  {
    _id: "txn_101abc",
    orderId: "ORD1001",
    customerName: "John Doe",
    customerEmail: "john.d@example.com",
    amount: 1697.99,
    currency: "USD",
    status: PaymentStatus.PAID,
    paymentMethod: "Credit Card",
    paymentDate: new Date("2025-10-28T10:30:15Z"),
  },
  {
    _id: "txn_102def",
    orderId: "ORD1002",
    customerName: "Jane Smith",
    customerEmail: "jane.s@example.com",
    amount: 2499.0,
    currency: "USD",
    status: PaymentStatus.PAID,
    paymentMethod: "PayPal",
    paymentDate: new Date("2025-10-25T14:00:30Z"),
  },
];

export async function fetchPayments(): Promise<IPayment[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockPayments;
}
