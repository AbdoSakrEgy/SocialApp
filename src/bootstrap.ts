import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
const app = express();
dotenv.config({
  path: path.resolve("./src/.env"),
});
import router from "./routes";
import { connectDB } from "./DB/db.connection";
import { IError } from "./utils/Errors";

const bootstrap = async () => {
  await connectDB();

  app.use(express.json());
  app.use("/api/v1", router);
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      errMsg: err.message,
      status: err.statusCode || 500,
      stack: err.stack,
    });
  });

  app.listen(process.env.PORT, () => {
    console.log("Backend server is running on port", process.env.PORT);
    console.log("=========================================");
  });
};

export default bootstrap;
