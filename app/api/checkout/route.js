import { requireAuth } from "@/lib/authMiddleware";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

export async function POST(req) {
  const session = await requireAuth(req);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const cart = await Cart.findOne({ userId: session.user.id }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Simulate payment success
  const order = await Order.create({
    userId: session.user.id,
    items: cart.items,
    totalAmount: cart.items.reduce((acc, item) => acc + item.productId.price * item.quantity, 0),
    status: "Processing",
  });

  await Cart.deleteOne({ userId: session.user.id });

  return Response.json({ success: true, order });
}
