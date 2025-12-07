// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { userEmail, amount, status } = await request.json();

    if (!userEmail || amount == null) {
      return NextResponse.json(
        { message: "User email and amount are required" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userEmail,
      amount,
      status: status || "pending",
    });

    await logActivity({
      type: "order_created",
      message: `Order created: ${order.userEmail} - $${order.amount}`,
      meta: {
        orderId: order._id.toString(),
        userEmail: order.userEmail,
        amount: order.amount,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
