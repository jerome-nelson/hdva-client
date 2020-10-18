import mongoose from "mongoose";
import toJson  from "@meanie/mongoose-to-json";

import { config } from "../config/config";

export const startMongoConn = async () => {
    mongoose.plugin(toJson);
    await mongoose.connect(config.mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        ssl: false
    });
    console.log(`MongoDB Connected`);
    const db = mongoose.connection;
    db.on("error", () => console.error.bind(console, 'connection error:'));
    return db;
}