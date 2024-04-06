import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoute } from "../modules/auth/auth.routes";
import { specialtiesRoutes } from "../modules/specialties/specialties.routes";
import { doctorRoutes } from "../modules/doctor/doctor.routes";
import { patientRoutes } from "../modules/patient/patient.routes";
import { scheduleRoutes } from "../modules/schedule/schedule.routes";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes";

const router = express.Router();

const modulesRoute = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/specialties",
    route: specialtiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoutes,
  },
];

modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
