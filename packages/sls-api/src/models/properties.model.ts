import mongoose, { Model } from "mongoose";

interface PropertiesModel {
    createdOn: Date;
    modifiedOn: Date;
    name: number;
    propertyId: number;
    groupId: number;
    _id: string;
}

type MongoPropertiesDocument = mongoose.Document & PropertiesModel;
interface MongoPropertiesModel extends Model<MongoPropertiesDocument> {
    doPropertiesExist(ids: number[]): Promise<Record<number, boolean>>;
}

const PropertiesSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        required: true,
        trim: true,
    },
    propertyId: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
    },
    groupId: {
        type: Number,
        required: true,
        trim: true,
    },
    modifiedOn: {
        type: Date,
        required: false,
        trim: true,
    },
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
});


PropertiesSchema.statics.doPropertiesExist = async function (ids: number[]): Promise<Record<number, boolean>> {
    const propertyList: Record<number, boolean> = ids.reduce((list, id) => ({
        ...list,
        [id]: false
    }), {});
    for (let id of ids) {
        const exists = await this.findOne({ propertyId: id });
        propertyList[id] = !!exists;
    }

    return propertyList;
}

export const Properties: MongoPropertiesModel = mongoose.model<MongoPropertiesDocument, MongoPropertiesModel>('Properties', PropertiesSchema);
export const addProperties = async (properties: Omit<PropertiesModel, "_id" | "createdOn" | "modifiedOn">[]) => {
    const currentTime = new Date().toDateString();
    const propertiesToAdd = properties.map(property => ({
        ...property,
        createdOn: currentTime,
        modifiedOn: currentTime
    }));

    try {
        const result = await Properties.insertMany(propertiesToAdd);
        return result;
    } catch (e) {
        throw e;
    }
};


export const getProperties = async ({ pids, gid }: { pids?: number[], gid?: number }) => {
    // TODO: Add Admin Check
    if (!gid && !pids) {
        return await Properties.find();
    }

    if (gid) {
        return await Properties.find({
            groupId: gid
        });
    }

    if (!pids) {
        return [];
    }

    const check = await Properties.doPropertiesExist(pids);
    const hasProperties = pids && pids
        .reduce((result, property) => result = result ? result : check[property], false);

    if (!hasProperties) {
        return [];
    }

    return await Properties.find({
        propertyId: {
            $in: pids
        }
    });
};

export const deleteProperties = async ({ pids }: { pids: number[] }) => {
    try {
        const result = await Properties.deleteMany({
            propertyId: {
                $in: pids
            }
        });
        return { deleted: result }
    } catch (e) {
        throw e;
    }
}