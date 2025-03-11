import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect(); // Connect to MongoDB

    const users = await User.find(); // Fetch users
    return Response.json({ success: true, users }, { status: 200 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
