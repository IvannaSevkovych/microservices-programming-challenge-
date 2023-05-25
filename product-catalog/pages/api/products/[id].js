import { products } from "../../../data/products";

export default function handler(req, res) {
  const { id } = req.query;

  const requestedProductIndex = products.findIndex(
    (product) => product.id == id
  );
  if (requestedProductIndex === -1) {
    res.status(404).send(`Product with id ${id} was not found`);
    return;
  }

  switch (req.method) {
    case "GET":
      res.status(200).json(products[requestedProductIndex]);
      break;
    case "PUT":
      products[requestedProductIndex] = req.body;
      res.status(200).json({
        message: `Product with id ${id} was updated`,
        updatedProduct: products[requestedProductIndex],
      });
      break;
    case "DELETE":
      products.splice(requestedProductIndex, 1);
      res.status(200).send(`Product with id ${id} was deleted`);
      break;

    default:
      res.status(400).send(`This request method is not supported`);
      break;
  }
}
