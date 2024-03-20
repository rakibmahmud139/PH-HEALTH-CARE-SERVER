import { Admin, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchAbleFields } from "./admin.constant";

const getAllAdminFromDB = async (query: any, options: any) => {
  const { searchTerm, ...filteredData } = query;
  const { page, limit, skip } = paginationHelpers.calculatePagination(options);
  const andCondition: Prisma.AdminWhereInput[] = [];

  if (query.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: filteredData[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getDataById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDataDeleted = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    const userDataDeleted = await transactionClient.user.delete({
      where: {
        email: adminDataDeleted.email,
      },
    });

    return adminDataDeleted;
  });

  return result;
};

export const adminServices = {
  getAllAdminFromDB,
  getDataById,
  updateIntoDB,
  deleteFromDB,
};
