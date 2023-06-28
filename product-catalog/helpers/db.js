import { MongoClient } from "mongodb";

const uri = process.env.DB_HOST;
const dbName = "test";
let client;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  return client.db(dbName); // Return the database instance
}
