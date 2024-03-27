import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import { emailSender } from "./emailSender";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";

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
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
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
    decodedToken = verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
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
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("password is incorrect");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgetPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_password_secret as Secret,
    config.jwt.reset_password_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
    <div>
      <p>Dear User,</p>
      <p>Your reset password link 
          <a href=${resetPassLink}>
            <button>
             reset password
            </button>
          </a>
      </p>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const verifiedToken = verifyToken(
    token,
    config.jwt.reset_password_secret as Secret
  );

  if (!verifiedToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "forbidden");
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
