import { connectToDatabase } from "../../../helpers/db";
import { methodNotSupportedResponse } from "../../../helpers/defaultResponses";

export default async function handler(req, res) {
  const db = await connectToDatabase();
  const collection = db.collection("products");
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      const requestedProduct = await products.findOne({ _id: id });
      if (!requestedProduct) {
        res.status(404).send(`Product with id ${id} was not found`);
        return;
      }
      res.status(200).json(requestedProduct);
      break;
    case "PUT":
      const result = await products.updateOne({ _id: id }, { $set: req.body });

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: `Product with id ${id} was updated`,
        updateResult: result,
      });
      break;
    case "DELETE":
      const result = await products.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).send(`Product with id ${id} was deleted`);
      break;

    default:
      methodNotSupportedResponse(res);
      break;
  }
}
