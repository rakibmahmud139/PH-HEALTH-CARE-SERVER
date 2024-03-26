import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrect");
  }

  const accessToken = generateToken(
    { email: userData.email, role: userData.role },
    "abcdef",
    "5m"
  );

  const refreshToken = generateToken(
    { email: userData.email, role: userData.role },
    "abcdefghijklmnopqrstuvwxyz",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedToken;

  try {
    decodedToken = verifyToken(token, "abcdefghijklmnopqrstuvwxyz");
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedToken?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = generateToken(
    { email: userData.email, role: userData.role },
    "abcdef",
    "5m"
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authServices = {
  loginUser,
  refreshToken,
};
