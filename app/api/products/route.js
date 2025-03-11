import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await dbConnect();
    const products = await Product.find();
    return Response.json(products, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, description, price, image, stock, category } = await req.json();
    if (!name || !description || !price || !image || !category) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();
    const newProduct = await Product.create({ name, description, price, image, stock, category });

    return Response.json(newProduct, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
