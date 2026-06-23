import mongoose from "mongoose";

interface MongooseCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached = globalForMongoose.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalForMongoose.mongooseCache = cached;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing required environment variable: MONGODB_URI");
  }

  return uri;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.connection) {
    return cached.connection;
  }

  cached.promise ??= mongoose.connect(getMongoUri());
  cached.connection = await cached.promise;

  return cached.connection;
}
