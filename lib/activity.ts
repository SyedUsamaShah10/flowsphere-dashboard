// lib/activity.ts
import { connectDB } from "@/lib/db";
import { Activity, ActivityType, ActivityMeta } from "@/models/Activity";

interface LogParams {
  type: ActivityType;
  message: string;
  meta?: ActivityMeta;
}

export async function logActivity({ type, message, meta }: LogParams) {
  await connectDB();
  await Activity.create({
    type,
    message,
    meta,
  });
}