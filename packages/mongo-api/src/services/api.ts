import bodyParser from "body-parser";
import express, { Application } from "express";
import passport from "passport";

import { config } from "./config";

export function server<T>(routes: (app: Application) => void) {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    app.use(passport.initialize());
    routes(app);
    const callback = () => console.log(`Server is Running on http://${config.url}:${config.serverPort}`);
    app.listen(config.serverPort, callback);
}