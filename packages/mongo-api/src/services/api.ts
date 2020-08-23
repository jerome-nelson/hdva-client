import express, { Application } from "express";
import config from "./config";

export function server<T>(routes: (app: Application) => void) {
    const app = express();
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
    routes(app);
    const callback = () => console.log(`Server is Running on http://${config.url}:${config.serverPort}`);
      
    app.listen(config.serverPort, callback);
}