import express from "express";
import mongoose from "mongoose";
import userRoute from "./routers/userRouter";

const app = express();
const port = 5000;

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log("Failed mongoose Connected!", err));

app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`server running at : http://localhost:${port}`);
});
