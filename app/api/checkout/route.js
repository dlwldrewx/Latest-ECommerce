import { dbConnect } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.productId.price,
      0
    );

    const order = await Order.create({ userId, items: cart.items, totalAmount, status: "pending" });

    cart.items = [];
    await cart.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
