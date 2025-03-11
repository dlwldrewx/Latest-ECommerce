"use client"; // Ensure this is at the top

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const session = useSession(); // Don't destructure yet
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define fetchCart using useCallback to prevent unnecessary re-renders
  const fetchCart = useCallback(async () => {
    if (!session.data?.user?.id) return;

    try {
      const res = await axios.get(`/api/cart?userId=${session.data.user.id}`);
      setCart(res.data.cart);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [session.data?.user?.id]); // Depend only on session.data.user.id

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchCart();
    }
  }, [session.status, fetchCart]); // Include fetchCart as a dependency

  const removeFromCart = async (productId) => {
    try {
      await axios.delete("/api/cart", { data: { userId: session.data.user.id, productId } });
      fetchCart();
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await axios.put("/api/cart", { userId: session.data.user.id });
      fetchCart();
    } catch (err) {
      setError("Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post("/api/checkout", { userId: session.data.user.id });
      if (res.status === 200) {
        router.push("/orders");
      }
    } catch (err) {
      setError("Checkout failed");
    }
  };

  if (session.status === "loading") return <p>Loading...</p>;
  if (session.status === "unauthenticated") return <p className="text-red-500">Please log in to view your cart.</p>;
  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cart?.items.length > 0 ? (
        <>
          {cart.items.map((item) => (
            <div key={item.productId._id} className="flex justify-between border-b p-2">
              <p>{item.productId.name} (x{item.quantity})</p>
              <button onClick={() => removeFromCart(item.productId._id)} className="text-red-500">
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button onClick={clearCart} className="bg-gray-300 px-4 py-2 rounded">Clear Cart</button>
            <button onClick={handleCheckout} className="bg-black text-white px-4 py-2 rounded">Checkout</button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
