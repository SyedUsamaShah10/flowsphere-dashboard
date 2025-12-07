// app/api/seed-admin/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 200 }
      );
    }

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // demo only
      role: "admin",
    });

    return NextResponse.json(
      { message: "Admin created", adminId: admin._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed admin error", error);
    return NextResponse.json(
      { message: "Error creating admin" },
      { status: 500 }
    );
  }
}