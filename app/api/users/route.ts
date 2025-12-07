// app/api/users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, role } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      role: role || "user",
      password: "password123", // demo default
    });

    await logActivity({
      type: "user_created",
      message: `User created: ${user.email}`,
      meta: { userId: user._id.toString(), email: user.email },
    });

    const plainUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return NextResponse.json(plainUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error", error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
