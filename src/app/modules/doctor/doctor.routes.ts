import express from "express";
import { doctorControllers } from "./doctor.controller";

const router = express.Router();

router.patch("/:id", doctorControllers.updateIntoDB);

export const doctorRoutes = router;
