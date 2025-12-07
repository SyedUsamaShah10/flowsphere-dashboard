// app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, price, status } = await request.json();

    if (!name || price == null) {
      return NextResponse.json(
        { message: "Name and price are required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      price,
      status: status || "active",
    });

    await logActivity({
  type: "product_created",
  message: `Product created: ${product.name}`,
  meta: { productId: product._id.toString(), name: product.name },
});

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}