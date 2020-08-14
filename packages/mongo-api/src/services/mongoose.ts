import mongoose, { Connection } from "mongoose";


export const connectMongoDB = async (url: string, options = {}) => {
    await mongoose.connect(url, options);
}

export const mongoInstance = async () => {
    // TODO: Use ENV
    await connectMongoDB("mongodb://site:pass@localhost:27017/site_db?authSource=site_db", {
        ssl: false
    });

    const db = mongoose.connection;
    db.on("error", () => console.error.bind(console, 'connection error:'));
    return db;
}

//  API
// Create JSON data (done)
// Connect to MongoDB instance
// Parse data from mongoDB instance into APIx