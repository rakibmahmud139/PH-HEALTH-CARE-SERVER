import express from "express";
import { appointmentController } from "./appoinment.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  appointmentController.createAppoinment
);

export const appointmentRoutes = router;