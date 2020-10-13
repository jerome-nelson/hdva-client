import bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";
import passport from "passport";

import { config } from "./config";

const errorMiddleware = (error: Error, req: Request, res: Response, next: (err: Error) => void) => {
  res.status(500).json({
    error,
    message: `Error Occurred: ${error.message}`,
    success: false
  })
}

export function server<T>(routes: (app: Application) => void) {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
    });
    routes(app);
    app.use(passport.initialize());
    app.use(errorMiddleware);
    const callback = () => console.log(`Server is Running on ${config.url}:${config.serverPort}`);
    app.listen(config.serverPort, callback);
}