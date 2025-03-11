"use client"; // Ensure this is at the top

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
  const session = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Define fetchOrders using useCallback
  const fetchOrders = useCallback(async () => {
    if (!session.data?.user?.id) return;

    try {
      const res = await axios.get(`/api/orders?userId=${session.data.user.id}`);
      setOrders(res.data.orders);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [session.data?.user?.id]); // Depend only on session.data.user.id

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchOrders();
    }
  }, [session.status, fetchOrders]); // Include fetchOrders as a dependency

  if (session.status === "loading") return <p>Loading...</p>;
  if (session.status === "unauthenticated") return <p className="text-red-500">Please log in to view your orders.</p>;
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="border-b p-2">
              <p>Order ID: {order._id}</p>
              <p>Total Items: {order.items.length}</p>
              <p>Status: {order.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders yet.</p>
      )}
    </div>
  );
}
