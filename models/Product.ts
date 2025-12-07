import { Schema, models, model } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

export const Product =
  models.Product || model<IProduct>("Product", ProductSchema);