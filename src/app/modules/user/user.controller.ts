import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userFilterAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Created successfully!",
    data: result,
  });
});

const getAllUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await userServices.getAllUserFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status changed successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userServices.getMyProfile(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Profile retrieved successfully!",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userServices.updateMyProfile(user as IAuthUser, req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Update my profile successfully!",
      data: result,
    });
  }
);

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUserFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
