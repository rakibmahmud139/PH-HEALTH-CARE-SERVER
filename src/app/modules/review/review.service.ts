import { Prisma, Review } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";

const insertIntoDB = async (user: IAuthUser, payload: Partial<Review>) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appoinmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (!(patientData.id === appoinmentData.patientId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment!");
  }

  return await prisma.$transaction(async (tx) => {
    const result = await tx.review.create({
      data: {
        appointmentId: appoinmentData.id,
        doctorId: appoinmentData.doctorId,
        patientId: appoinmentData.patientId,
        rating: payload.rating as number,
        comment: payload.comment as string,
      },
    });

    const avgRating = await tx.review.aggregate({
      _avg: { rating: true },
    });

    await tx.doctor.update({
      where: {
        id: result.doctorId,
      },
      data: {
        averageRating: avgRating._avg.rating as number,
      },
    });

    return result;
  });
};

const getAllFromDB = async (filters: any, options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { patientEmail, doctorEmail } = filters;
  const andConditions = [];

  if (patientEmail) {
    andConditions.push({
      patient: {
        email: patientEmail,
      },
    });
  }

  if (doctorEmail) {
    andConditions.push({
      doctor: {
        email: doctorEmail,
      },
    });
  }

  const whereConditions: Prisma.ReviewWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.review.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: true,
      //appointment: true,
    },
  });
  const total = await prisma.review.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const reviewServices = {
  insertIntoDB,
  getAllFromDB,
};
