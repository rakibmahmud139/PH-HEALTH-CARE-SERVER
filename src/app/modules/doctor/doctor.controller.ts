import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { doctorServices } from "./doctor.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await doctorServices.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

export const doctorControllers = {
  updateIntoDB,
};
