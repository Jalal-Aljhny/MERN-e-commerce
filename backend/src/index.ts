import express from "express";
import mongoose from "mongoose";
import userRoute from "./routers/userRoute";
import dotenv from "dotenv";
import productRoute from "./routers/productRoute";
import { seedInitialProducts } from "./services/productServices";
import cartRouter from "./routers/cartRoute";
dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

mongoose
  .connect(`${process.env.DB_URL}/ecommerce`)
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log("Failed mongoose Connected!", err));

seedInitialProducts();

app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRouter);

app.listen(port, () => {
  console.log(`server running at : http://localhost:${port}`);
});
