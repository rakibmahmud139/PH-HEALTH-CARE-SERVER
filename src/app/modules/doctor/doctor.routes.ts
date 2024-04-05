import express from "express";
import { doctorControllers } from "./doctor.controller";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get("/", doctorControllers.getAllFromDB);

router.get("/:id", doctorControllers.getByIdFromDB);

router.patch("/:id", doctorControllers.updateIntoDB);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  doctorControllers.deleteFromDB
);

router.delete(
  "/soft/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  doctorControllers.softDelete
);

export const doctorRoutes = router;
