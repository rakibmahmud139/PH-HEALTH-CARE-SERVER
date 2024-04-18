import express from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", reviewController.getAllFromDB);

router.post("/", auth(UserRole.PATIENT), reviewController.insertIntoDB);

export const reviewRoutes = router;
