import express, { NextFunction, Request, Response } from "express";
import { specialtiesControllers } from "./specialties.controller";
import { upload } from "../../../helpers/fileUploader";
import { specialtiesValidation } from "./specialties.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtiesValidation.create.parse(JSON.parse(req.body.data));
    return specialtiesControllers.insertIntoDB(req, res, next);
  }
);

router.get("/", specialtiesControllers.getAllFromDB);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  specialtiesControllers.deleteFromDB
);

export const specialtiesRoutes = router;
