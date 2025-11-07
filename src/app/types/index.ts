// types/index.ts

export interface ProductImage {
  _id: string;
  url: string;
  isMain: boolean;
  styleName?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
  images: ProductImage[];
}
export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED",
}
