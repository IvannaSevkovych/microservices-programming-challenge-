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
      const result = await products.insertOne(req.body);
      res.status(201).json(result.ops[0]);
      break;

    default:
      methodNotSupportedResponse(res);
      break;
  }
}
