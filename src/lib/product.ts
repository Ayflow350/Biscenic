import type { Product, ProductImage } from "@/app/types";

// A temporary cart product type for the frontend
interface CartProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export const formatPrice = (price: number): string => {
  return `₦${price.toLocaleString()}`;
};

export const getMainImage = (images: ProductImage[]): string => {
  if (!images || images.length === 0) {
    return "/placeholder.jpg";
  }
  const mainImage = images.find((img) => img.isMain);
  return mainImage?.url || images[0]?.url || "/placeholder.jpg";
};

export const convertToCartProduct = (product: Product): CartProduct => ({
  id: product._id,
  name: product.name,
  price: formatPrice(product.price),
  image: getMainImage(product.images),
  quantity: 1,
});

export const isOutOfStock = (product: Product): boolean => {
  return product.stock <= 0;
};
