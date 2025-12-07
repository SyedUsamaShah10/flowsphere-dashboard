// models/User.ts
import { Schema, models, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  role: "admin" | "user";
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model<IUser>("User", UserSchema);