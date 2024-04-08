import express from "express";
import { scheduleControllers } from "./schedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.DOCTOR), scheduleControllers.getAllFromDB);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleControllers.insertIntoDB
);

export const scheduleRoutes = router;
