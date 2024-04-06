import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { catchAsync } from "../../../shared/catchAsync";
import { Request, Response } from "express";
import { doctorScheduleService } from "./doctorSchedule.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const result = await doctorScheduleService.insertIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedule created successfully!",
    data: result,
  });
});

export const doctorScheduleControllers = {
  insertIntoDB,
};
