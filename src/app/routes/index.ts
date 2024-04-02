import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoute } from "../modules/auth/auth.routes";
import { specialtiesRoutes } from "../modules/specialties/specialties.routes";

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
];

modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;
