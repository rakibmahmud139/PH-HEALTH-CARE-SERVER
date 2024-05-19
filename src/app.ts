import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import router from "./app/routes";
import { appointmentServices } from "./app/modules/appointment/appoinment.service";
import cron from "node-cron";

const app: Application = express();

//middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("* * * * *", () => {
  try {
    appointmentServices.cancelUnpaidAppointments();
  } catch (err) {
    console.log(err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server...",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
