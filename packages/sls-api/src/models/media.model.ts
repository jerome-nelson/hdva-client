import mongoose, { Model } from "mongoose";

export interface MediaModel {
    createdOn: Date;
    type?: string;
    modifiedOn: Date;
    resource: string;
    propertyId: number;
    _id: string;
}

export type MongoMediaDocument = mongoose.Document & MediaModel;
const MediaSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    propertyId: {
        type: Number,
        required: true,
        trim: true,
    },
    modifiedOn: {
        type: Date,
        required: false,
        trim: true,
    },
    resource: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    }
});



export const Media: Model<MongoMediaDocument> = mongoose.model<MongoMediaDocument, Model<MongoMediaDocument>>('Media', MediaSchema);
export const addMedia = async (media: Omit<MediaModel, "_id" | "createdOn" | "modifiedOn">) => {
    const currentTime = new Date().toDateString();

    try {
        // TODO: Accept Arrays
        const result = await Media.insertMany([{
            ...media,
            propertyId: Number(media.propertyId),
            createdOn: currentTime,
            modifiedOn: currentTime
        }]);
        return result;
    } catch (e) {
        throw e;
    }
};

export const removeMedia = async (media: Omit<MediaModel, "_id" | "createdOn" | "modifiedOn">) => {
    try {
        const proposedDelete = await Media.findOneAndDelete({ resource: media.resource, propertyId: media.propertyId, type: media.type });
        if (!proposedDelete) {
            throw Error("Delete not successful");
        }

        return proposedDelete;

    } catch (e) {
        throw e;
    }
};

export const getMedia = async (pids: number[]) => await Media.find({
    propertyId: {
        $in: pids
    }
});