import express, { NextFunction, Request, Response } from "express";
import { specialtiesControllers } from "./specialties.controller";
import { upload } from "../../../helpers/fileUploader";
import { specialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtiesValidation.create.parse(JSON.parse(req.body.data));
    return specialtiesControllers.insertIntoDB(req, res, next);
  }
);

export const specialtiesRoutes = router;
