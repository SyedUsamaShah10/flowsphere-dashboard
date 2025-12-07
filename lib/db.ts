// lib/db.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the DATABASE_URL environment variable in .env");
}

interface MongooseGlobal {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const globalForMongoose = globalThis as unknown as {
  mongooseGlobal?: MongooseGlobal;
};

if (!globalForMongoose.mongooseGlobal) {
  globalForMongoose.mongooseGlobal = {
    conn: null,
    promise: null,
  };
}

const cached = globalForMongoose.mongooseGlobal;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      dbName: "saasify-admin",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}