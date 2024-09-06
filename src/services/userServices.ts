import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface LoginDto {
  email: string;
  password: string;
}
dotenv.config();
const generateJWT = (data: any) => {
  return jwt.sign(data, `${process.env.SECRET_KEY}`);
};
export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterDto) => {
  const findUser = await userModel.findOne({ email: email });
  if (findUser) {
    return {
      data: { error: { message: "User Already exists" } },
      statusCode: 400,
    };
  }
  const hasedPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hasedPassword,
  });
  await newUser.save();

  return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
};
export const login = async ({ email, password }: LoginDto) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: { error: { message: "email Not Found" } }, statusCode: 404 };
  }

  //    password == findUser.password;
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    return {
      data: { error: { message: "Password incorrect " } },
      statusCode: 400,
    };
  }

  if (passwordMatch) {
    return {
      data: generateJWT({
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        email,
      }),
      statusCode: 200,
    };
  }

  return {
    data: { error: { message: "Incorrect email or password" } },
    statusCode: 400,
  };
};
