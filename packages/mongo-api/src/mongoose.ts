import mongoose from "mongoose";

export const start = async (url: string, options = {}) => {
    await mongoose.connect(url, options);
}

//  API

// Create JSON data
// Connect to MongoDB instance
// Parse data from mongoDB instance into API