import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await adminServices.getAllAdminFromDB(filters, options);

    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

const getDataById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await adminServices.getDataById(id);

    res.status(200).json({
      success: true,
      message: "Admin data fetched by id successfully!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

const updateIntoDB = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await adminServices.updateIntoDB(id, req.body);

    res.status(200).json({
      success: true,
      message: "Admin updated!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

const deleteFromDB = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await adminServices.deleteFromDB(id);

    res.status(200).json({
      success: true,
      message: "Admin data deleted!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "Something went wrong",
      error: err,
    });
  }
};

export const adminControllers = {
  getAllAdmin,
  getDataById,
  updateIntoDB,
  deleteFromDB,
};
