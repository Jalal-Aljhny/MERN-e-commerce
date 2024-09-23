import express from "express";
import { login, register } from "../services/userServices";
import { body, check, validationResult } from "express-validator";

const userRoute = express.Router();

userRoute.post(
  "/register",

  body("firstName").custom((value) => {
    if (!value) {
      throw new Error("First name is required ");
    } else if (typeof value !== "string") {
      throw new Error("First name  must be a string");
    }
    return true;
  }),
  body("lastName").custom((value) => {
    if (!value) {
      throw new Error("Last name is required ");
    } else if (typeof value !== "string") {
      throw new Error("Last name  must be a string");
    }
    return true;
  }),
  body("email").custom((value) => {
    if (!value) {
      throw new Error("Email is required");
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(value)) {
      throw new Error("Email is not valid");
    }
    return true;
  }),
  body("password").custom((value) => {
    if (!value || value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    const passwordRegex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

    if (!passwordRegex.test(value)) {
      throw new Error(
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      );
    }

    return true;
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsDetaile = errors.array().map((err) => err.msg);
      return res.status(400).send({
        error: {
          message: `${errorsDetaile}`,
        },
      });
    }
    const { firstName, lastName, email, password } = req.body;
    const result = await register({ firstName, lastName, email, password });
    res.status(result.statusCode).send(result.data);
  }
);

userRoute.post(
  "/login",
  body("email").custom((value) => {
    if (!value) {
      throw new Error("Email is required");
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(value)) {
      throw new Error("Email is not valid");
    }
    return true;
  }),
  body("password").custom((value) => {
    if (!value || value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    return true;
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsDetaile = errors.array().map((err) => err.msg);
      return res.status(400).send({
        error: {
          message: `${errorsDetaile}`,
        },
      });
    }
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.status(result.statusCode).send(result.data);
  }
);

export default userRoute;
