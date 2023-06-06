import { connectToDatabase } from "../../../helpers/db";
import { methodNotSupportedResponse } from "../../../helpers/defaultResponses";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const collection = db.collection("products");
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      const requestedProduct = await collection.findOne({
        _id: new ObjectId(id),
      });
      if (!requestedProduct) {
        res.status(404).send(`Product with id ${id} was not found`);
        return;
      }
      res.status(200).json(requestedProduct);
      break;
    case "PUT":
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: req.body }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: `Product with id ${id} was updated`,
        updateResult: result,
      });
      break;
    case "DELETE":
      const deleteResult = await collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).send(`Product with id ${id} was deleted`);
      break;

    default:
      methodNotSupportedResponse(res);
      break;
  }
}
