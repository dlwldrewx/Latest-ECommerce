import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
