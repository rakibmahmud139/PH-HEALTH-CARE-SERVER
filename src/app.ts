import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/user/user.routes";
import { adminRoutes } from "./app/modules/admin/admin.routes";
import router from "./app/routes";

const app: Application = express();

//middleware
app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server...",
  });
});

app.use("/api/v1", router);

export default app;
