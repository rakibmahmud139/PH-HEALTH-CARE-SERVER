import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { metaServices } from "./meta.service";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    // const filters = pick(req.query, prescriptionFilterableFields);
    // const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user as IAuthUser;

    const result = await metaServices.fetchDashboardMetaData(user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta data retrieval successfully",
      data: result,
    });
  }
);

export const metaControllers = {
  fetchDashboardMetaData,
};
