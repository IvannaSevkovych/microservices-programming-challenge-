import { MongoClient } from "mongodb";

const uri = "mongodb://mongo-db:27017";
let client;

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  return client.db(); // Return the database instance
}
