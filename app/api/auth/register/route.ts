// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { setAuthCookie } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 400 }
      );
    }

    // NOTE: demo ke liye plain password rakh rahe hain.
    // Real project me yahan bcrypt se hash karna hoga.
    const user = await User.create({
      name,
      email,
      password,
      role: "user",
    });

    await logActivity({
      type: "user_registered",
      message: `New user registered: ${user.email}`,
      meta: { userId: user._id.toString(), email: user.email },
    });

    // Auto-login after register
    await setAuthCookie({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json(
      {
        message: "Registered successfully",
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
