import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminControllers } from "./admin.controller";
import { adminValidationSchemas } from "./admin.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getAllAdmin
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.getDataById
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),

  validateRequest(adminValidationSchemas.adminUpdate),
  adminControllers.updateIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.deleteFromDB
);

router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminControllers.softDeleteFromDB
);

export const adminRoutes = router;
