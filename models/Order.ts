// models/Order.ts
import { Schema, models, model } from "mongoose";

export interface IOrder {
  userEmail: string;
  amount: number;
  status: "pending" | "paid" | "refunded";
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Order =
  models.Order || model<IOrder>("Order", OrderSchema);