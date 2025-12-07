// models/Activity.ts
import { Schema, models, model } from "mongoose";

export type ActivityType =
  | "user_created"
  | "product_created"
  | "order_created"
  | "user_registered";

// optional, strongly-typed meta object
export type ActivityMeta =
  | { userId: string; email: string }
  | { productId: string; name: string }
  | { orderId: string; userEmail: string; amount: number }
  | Record<string, unknown>; // fallback generic (no `any`)

export interface IActivity {
  type: ActivityType;
  message: string;
  meta?: ActivityMeta;
  createdAt?: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ["user_created", "product_created", "order_created", "user_registered"],
      required: true,
    },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Activity =
  models.Activity || model<IActivity>("Activity", ActivitySchema);