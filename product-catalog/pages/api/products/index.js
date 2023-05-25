import { products } from "../../../data/products";

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      if (!products) {
        res.status(404);
      } else {
        res.status(200).json(products);
      }
      break;
    case "POST":
      if (!products) {
        res.status(400);
      } else {
        products.push(req.body);
        res.status(201).json(products);
      }
      break;

    default:
      res.status(400).send(`This request method is not supported`);
      break;
  }
}
