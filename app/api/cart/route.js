import { requireAuth } from "@/lib/authMiddleware";
import { dbConnect } from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function POST(req) {
  const session = await requireAuth(req);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  await dbConnect();

  let cart = await Cart.findOne({ userId: session.user.id });
  if (!cart) {
    cart = await Cart.create({ userId: session.user.id, items: [] });
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  return Response.json({ success: true, cart });
}
