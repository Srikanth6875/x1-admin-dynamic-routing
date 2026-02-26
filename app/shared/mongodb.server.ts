import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://x1dbuser:x1db123987@10.0.2.15:27017/x1_db";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your .env file");
}

if (process.env.NODE_ENV === "development") {
  if (!((global as any)._mongoClientPromise)) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export { clientPromise };

export async function getMongoDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db();
}