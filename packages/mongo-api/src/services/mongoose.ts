import mongoose from "mongoose";
import config from "./config";

export const connectMongoDB = async (url: string, options = {}) => {
    await mongoose.connect(url, options);
}

export const mongoInstance = async () => {
    console.log(config.mongoUrl);
    await connectMongoDB(config.mongoUrl, {
        ssl: false
    });

    const db = mongoose.connection;
    db.on("error", () => console.error.bind(console, 'connection error:'));
    return db;
}