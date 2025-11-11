"use client";
import { useCart } from "@/context/cart-context";
import { useCheckout } from "@/context/checkout-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Import Link for the "Continue Shopping" button

export function CartStep() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { goToNextStep } = useCheckout();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // If the cart is empty, show a helpful message and a link to the shop
  if (cart.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
        <p className="text-muted-foreground max-w-sm">
          It looks like you haven&apost added any items to your cart yet. Browse
          our collection to find something you&aposll love.
        </p>
        <Button asChild className="mt-4">
          <Link href="/collections">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  // If the cart has items, render the list
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Review Your Cart ({cart.length} items)
      </h2>
      <div className="space-y-6">
        {/* --- THIS IS THE FILLED-IN PART --- */}
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border-b pb-4 last:border-b-0 last:pb-0"
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="rounded-lg object-cover aspect-square"
              />
            )}

            <div className="flex-1">
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-md text-muted-foreground">
                ₦{Number(item.price).toLocaleString()}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 self-stretch">
              <p className="font-semibold text-lg">
                ₦{(Number(item.price) * item.quantity).toLocaleString()}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        {/* --- END OF FILLED-IN PART --- */}
      </div>
      <div className="border-t pt-6 flex justify-between items-center">
        <span className="text-xl font-bold">Subtotal</span>
        <span className="text-xl font-bold">₦{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={goToNextStep}>
          Continue to Customer Info
        </Button>
      </div>
    </div>
  );
}
