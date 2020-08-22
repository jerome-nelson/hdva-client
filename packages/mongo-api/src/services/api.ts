import express, { Application } from "express";

export function server<T>(options: any = {
    port: 3000
}, routes: (app: Application) => void) {
    const app = express();
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
    routes(app);
    const callback = () => console.log(`Server is Running on http://localhost:${options.port}`);
      
    app.listen(options.port, callback);
}