"use client";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// 1. Define Props with an onClose function
interface CartDrawerContentProps {
  onClose: () => void;
}

// 2. Accept the onClose prop
export function CartDrawerContent({ onClose }: CartDrawerContentProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  if (!cart || cart.length === 0)
    return <p className="text-muted-foreground">Your cart is empty.</p>;

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // 3. Update handleCheckout to close the drawer BEFORE routing
  const handleCheckout = () => {
    onClose(); // Close the drawer first
    router.push("/checkout"); // Then navigate
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      {/* CART ITEMS */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[65vh] pr-2">
        {cart.map((item) => (
          <div key={item.id} className="border-b pb-4 flex gap-3">
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            )}

            <div className="flex flex-col flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm">₦ {Number(item.price).toLocaleString()}</p>

              <div className="flex gap-3 items-center mt-2">
                <button
                  className="border p-1 px-3 rounded"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className="border p-1 px-3 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="text-red-500 text-sm mt-2 text-left"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBTOTAL + CHECKOUT */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>₦ {subtotal.toLocaleString()}</span>
        </div>

        <Button onClick={handleCheckout} className="w-full">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
