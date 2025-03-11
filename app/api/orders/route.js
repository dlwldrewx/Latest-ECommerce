import { requireAuth } from "@/lib/authMiddleware";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req) {
  const session = await requireAuth(req);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const orders = await Order.find({ userId: session.user.id });

  return Response.json({ success: true, orders });
}
