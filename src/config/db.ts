import * as dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  console.log("load env db.ts");
  dotenv.config();
}

import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_URI;
// console.log("🚀 ~ uri:", process.env);

if (!uri) {
  throw new Error("MONGODB_URI env variable is required");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbName = "celestial-ticket";
if (process.env.NODE_ENV === "test") {
  dbName = "celestial-ticket-test";
}
console.log("🚀 ~ dbName:", dbName);
export const db = client.db(dbName);
