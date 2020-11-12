import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import express, { Application, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import passport from "passport";

import { config } from "../config/config";
import { errorsHandler, noPostBody } from "./error";
import routes from "../config/routes";
import { jwtStrategy } from "../config/auth";

export async function server() {

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compression());
  app.use(cors());
  app.options('*', cors());
  app.use(mongoSanitize());
  app.use(helmet());

  app.use(passport.initialize());
  passport.use('jwt', jwtStrategy);

  app.use("/v1/", routes);
  app.use("*", (req, res) => {
    res.status(404).json({
      message: "Nothing here"
    })
  });

  // Must be placed last
  app.use(noPostBody());
  app.use(errorsHandler());
  return app.listen(config.serverPort, () => console.log(`Server is Running on ${config.url}:${config.serverPort}`));
}