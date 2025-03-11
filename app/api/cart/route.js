import { dbConnect } from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

// ✅ GET: Retrieve cart
export async function GET(req) {
  try {
    await dbConnect();
    const userId = req.nextUrl.searchParams.get("userId"); // Get userId from query params

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    return NextResponse.json({ success: true, cart: cart || { userId, items: [] } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// ✅ POST: Add an item to cart
export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.equals(productId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

// ✅ DELETE: Remove an item from cart
export async function DELETE(req) {
  try {
    await dbConnect();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    await cart.save();

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}

// ✅ PUT: Clear cart
export async function PUT(req) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    cart.items = [];
    await cart.save();

    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
