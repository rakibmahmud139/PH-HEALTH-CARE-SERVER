import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { doctorScheduleService } from "../doctorSchedule/doctorSchedule.service";
import { appointmentServices } from "./appoinment.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

const createAppoinment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user as IAuthUser;
    const result = await appointmentServices.createAppoinment(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment booked successfully!",
      data: result,
    });
  }
);

const getMyAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user as IAuthUser;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await appointmentServices.getMyAppointment(
      user,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My appointment retrieved successfully!",
      data: result,
    });
  }
);

const changeAppointmentStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user as IAuthUser;

    const result = await appointmentServices.changeAppointmentStatus(
      id,
      status,
      user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Change appointment status successfully!",
      data: result,
    });
  }
);

export const appointmentController = {
  createAppoinment,
  getMyAppointment,
  changeAppointmentStatus,
};
