import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
};
