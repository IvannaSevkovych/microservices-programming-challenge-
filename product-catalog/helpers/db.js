import { MongoClient } from "mongodb";

const uri = process.env.DB_HOST;
let client;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  return client.db(); // Return the database instance
}
