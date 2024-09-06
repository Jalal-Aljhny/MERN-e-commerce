import express from "express";
import mongoose from "mongoose";
import userRoute from "./routers/userRouter";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

mongoose
  .connect(`${process.env.DB_URL}/ecommerce`)
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log("Failed mongoose Connected!", err));

app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`server running at : http://localhost:${port}`);
});
