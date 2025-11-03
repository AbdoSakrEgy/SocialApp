import express, { NextFunction, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
const app = express();
dotenv.config({
  path: path.resolve("./src/.env"),
});
import router from "./routes";
import { connectDB } from "./DB/db.connection";
import { ApplicationExpection, IError } from "./utils/Errors";
import cors from "cors";
import { socketIOServer } from "./utils/socketio/socketio.server";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./GraphQl/schema";

var whitelist = [
  "http://example1.com",
  "http://example2.com",
  "http://127.0.0.1:5501",
  undefined,
];
var corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new ApplicationExpection("Not allowed by CORS", 401));
    }
  },
};

const bootstrap = async () => {
  await connectDB();

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/api/v1", router);
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      errMsg: err.message,
      status: err.statusCode || 500,
      stack: err.stack,
    });
  });
  //TODO: GrphQL
  app.all(
    "/graphql",
    createHandler({
      schema,
      context: (req, params) => ({
        token: req.raw.headers.authorization,
      }),
    })
  );
  //TODO: GrphQL

  const httpServer = app.listen(process.env.PORT, () => {
    console.log("Backend server is running on port", process.env.PORT);
    console.log("=========================================");
  });
  //TODO: SocketIO
  socketIOServer(httpServer);
  //TODO: SocketIO
};

export default bootstrap;
