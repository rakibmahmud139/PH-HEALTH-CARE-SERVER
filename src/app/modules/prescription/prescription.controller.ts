import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { prescriptionServices } from "./prescription.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { date } from "zod";
import { prescriptionFilterableFields } from "./prescription.constant";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const result = await prescriptionServices.insertIntoDB(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Prescription created successfully",
      data: result,
    });
  }
);

const patientPrescription = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await prescriptionServices.patientPrescription(
      user,
      options
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My prescription retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, prescriptionFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await prescriptionServices.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescriptions retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const prescriptionController = {
  insertIntoDB,
  patientPrescription,
  getAllFromDB,
};
