import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";

const createAdmin = async (req: any) => {
  const file: IFile = req.file;

  if (file) {
    const uploadedToCloudinary = await uploadToCloudinary(file);

    req.body.admin.profilePhoto = uploadedToCloudinary?.secure_url;
  }

  const data = req.body;

  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: data.admin,
    });

    return createdAdminData;
  });

  return result;
};

export const userServices = {
  createAdmin,
};
