// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

// DELETE /api/orders/[id]
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Order deleted" });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error", error);
    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}