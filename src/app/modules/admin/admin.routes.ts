import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminControllers } from "./admin.controller";
import { adminValidationSchemas } from "./admin.validation";

const router = express.Router();

router.get("/", adminControllers.getAllAdmin);

router.get("/:id", adminControllers.getDataById);

router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.adminUpdate),
  adminControllers.updateIntoDB
);

router.delete("/:id", adminControllers.deleteFromDB);

router.delete("/soft/:id", adminControllers.softDeleteFromDB);

export const adminRoutes = router;
