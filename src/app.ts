import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import httpStatus from "http-status";
import { notFound } from "./app/middlewares/notFound";

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

app.use(globalErrorHandler);

app.use(notFound);
export default app;
