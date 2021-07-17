import toJson from "@meanie/mongoose-to-json";
import mongoose, { Mongoose } from "mongoose";
import { ERROR_MSGS } from "../../config/messages";
import { BadRequest } from "../../utils/error";

let cachedDB: Mongoose | null = null;
mongoose.plugin(toJson);

export const startMongoConn = async () => {

    if (!!cachedDB && cachedDB.connection.readyState === 1) {
        console.log('=> using cached database instance');
        return Promise.resolve(cachedDB);
    }

    try {
        if (
            !process.env.dburl ||
            !process.env.dbreplica ||
            !process.env.dbauth ||
            !process.env.dbname 
        ) {
            throw new BadRequest(ERROR_MSGS.CREDENTIALS_FAIL);
        }

        cachedDB = await mongoose.connect(process.env.dburl, {
            authSource: process.env.dbauth,
            dbName: process.env.dbname,
            replicaSet: process.env.dbreplica,
            readPreference: "primary",
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            ssl: true,
            w: "majority",
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0 // and MongoDB driver buffering
        });

        console.log(`MongoDB Connected`);
    } catch (e) {
        console.log("Service closed");
        console.error(e);
        process.exit(1);
    }
}
