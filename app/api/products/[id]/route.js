import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const updatedProduct = await Product.findByIdAndUpdate(params.id, await req.json(), { new: true });

    if (!updatedProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(updatedProduct, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
