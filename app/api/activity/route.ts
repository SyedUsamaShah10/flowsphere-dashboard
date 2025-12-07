// app/api/activity/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Activity } from "@/models/Activity";

export async function GET() {
  try {
    await connectDB();
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(50);
    return NextResponse.json(activities);
  } catch (error) {
    console.error("GET /api/activity error", error);
    return NextResponse.json(
      { message: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}