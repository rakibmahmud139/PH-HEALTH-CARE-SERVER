import express from "express";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", adminControllers.getAllAdmin);

router.get("/:id", adminControllers.getDataById);

router.patch("/:id", adminControllers.updateIntoDB);

router.delete("/:id", adminControllers.deleteFromDB);

router.delete("/soft/:id", adminControllers.softDeleteFromDB);

export const adminRoutes = router;
