import {
  AppoinmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";

const createAppoinment = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId: string = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appoinmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appoinmentId: appoinmentData.id,
      },
    });

    const today = new Date();
    const transactionId =
      "PH-Health-Care-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getDay() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes();

    console.log(transactionId);

    await tx.payment.create({
      data: {
        appointmentId: appoinmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appoinmentData;
  });

  return result;
};

const getMyAppointment = async (
  user: IAuthUser,
  filters: any,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include:
      user?.role === UserRole.PATIENT
        ? {
            doctor: true,
            schedule: true,
          }
        : {
            patient: {
              include: {
                patientHealthData: true,
                medicalReport: true,
              },
            },
            schedule: true,
          },
  });

  const total = await prisma.appointment.count({
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

const changeAppointmentStatus = async (
  id: string,
  appointmentStatus: AppoinmentStatus,
  user: IAuthUser
) => {
  const appoinmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR) {
    if (!(user.email === appoinmentData.doctor.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This is not your appoinment!"
      );
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      status: appointmentStatus,
    },
  });

  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 30 * 1000);

  const unpaidAppoints = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinutesAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });

  const appointmentIdsToCancel = unpaidAppoints.map(
    (appointment) => appointment.id
  );

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsToCancel,
        },
      },
    });

    for (const unpaidAppoint of unpaidAppoints) {
      await tx.doctorSchedules.updateMany({
        where: {
          doctorId: unpaidAppoint.doctorId,
          scheduleId: unpaidAppoint.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const appointmentServices = {
  createAppoinment,
  getMyAppointment,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
