import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { reviewServices } from "./review.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { reviewFilterableFields } from "./review.constant";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user as IAuthUser;

    const result = await reviewServices.insertIntoDB(user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, reviewFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await reviewServices.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const reviewController = {
  insertIntoDB,
  getAllFromDB,
};
