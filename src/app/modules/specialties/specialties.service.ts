import { Request } from "express";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { Specialties } from "@prisma/client";

const insertIntoDB = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadCloudinary = await uploadToCloudinary(file);
    req.body.icon = uploadCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllFromDB = async () => {
  return await prisma.specialties.findMany();
};

const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialtiesServices = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};
