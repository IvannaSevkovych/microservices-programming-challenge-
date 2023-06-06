import { methodNotSupportedResponse } from "../../../helpers/defaultResponses";
import { connectToDatabase } from "../../../helpers/db";

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const collection = db.collection("products");

  switch (req.method) {
    case "GET":
      const products = await collection.find().toArray();
      if (!products) {
        res.status(404);
      } else {
        res.status(200).json(products);
      }
      break;
    case "POST":
      const product = req.body;
      const result = await collection.insertOne(product);
      if (result.acknowledged) {
        const insertedProductId = result.insertedId;
        res.status(201).json({
          message: "Product inserted.",
          insertedProductId: insertedProductId,
        });
      } else {
        res.status(500).json({ message: "Failed to insert product." });
      }
      break;

    default:
      methodNotSupportedResponse(res);
      break;
  }
}
