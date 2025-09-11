import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
const app = express();
dotenv.config({
  path: path.resolve("./src/.env"),
});
import router_v1 from "./routes";
interface IError extends Error {
  statusCode: number;
}

const bootstrap = () => {
  app.use(express.json());
  app.use("/api/v1", router_v1);
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode as number).json({
      errMsg: err.message,
      status: err.statusCode,
      stack: err.stack,
    });
  });

  app.listen(process.env.PORT, () => {
    console.log("Backend server is running on port", process.env.PORT);
    console.log("=========================================");
  });
};

export default bootstrap;
