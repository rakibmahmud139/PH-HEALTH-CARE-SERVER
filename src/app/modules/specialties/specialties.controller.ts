import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { specialtiesServices } from "./specialties.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.insertIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create specialties successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.getAllFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

export const specialtiesControllers = {
  insertIntoDB,
  getAllFromDB,
};
