import express from "express";
import { getAllProducts } from "../services/productServices";

const productRoute = express.Router();

productRoute.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(products.statusCode).send(products.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default productRoute;
