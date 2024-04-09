import express from "express";
import { doctorScheduleControllers } from "./doctorSchedule.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  doctorScheduleControllers.getAllFromDB
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.getMyScheduleFromDB
);

router.post("/", auth(UserRole.DOCTOR), doctorScheduleControllers.insertIntoDB);

router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.deleteMySchedule
);

export const doctorScheduleRoutes = router;
