import mongoose from "mongoose";

import { config } from "./config";

export const connectMongoDB = async (url: string, options = {}) => {
    await mongoose.connect(url, options);
}

export const mongoInstance = async () => {
    await connectMongoDB(config.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: false
    });
    console.log(`MongoDB Connected`);
    const db = mongoose.connection;
    db.on("error", () => console.error.bind(console, 'connection error:'));
    return db;
}