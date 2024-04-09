import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import { Request, Response } from "express";
import { doctorScheduleService } from "./doctorSchedule.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { scheduleFilterableFields } from "./doctorSchedule.constant";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req?.user;
    const result = await doctorScheduleService.insertIntoDB(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor schedule created successfully!",
      data: result,
    });
  }
);

const getMyScheduleFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await doctorScheduleService.getMySchedule(
      user,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule retrieved successfully!",
      data: result,
    });
  }
);

const deleteMySchedule = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const { id } = req.params;

    const result = await doctorScheduleService.deleteMySchedule(user, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Delete my schedule successfully!",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await doctorScheduleService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const doctorScheduleControllers = {
  insertIntoDB,
  getMyScheduleFromDB,
  deleteMySchedule,
  getAllFromDB,
};
