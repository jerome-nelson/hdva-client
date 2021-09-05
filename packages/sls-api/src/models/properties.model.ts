import mongoose, { Model } from "mongoose";
import { removeMedia } from "./media.model";
interface PropertiesModel {
    createdOn: Date;
    modifiedOn: Date;
    name: string;
    propertyId: number;
    groupId: number;
    folder: string;
    _id: string;
}

export type MongoPropertiesDocument = mongoose.Document & PropertiesModel;
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
export const addProperties = async (properties: Omit<PropertiesModel, "_id" | "createdOn" | "modifiedOn" | "propertyId">) => {
    const currentTime = new Date().toDateString();
    const lastId = (await Properties.find({}).sort({_id: -1}).limit(1))[0].propertyId;
    // TODO: Add arrays
    const propertiesToAdd = [{
                ...properties,
                groupId: Number(properties.groupId),
                propertyId: lastId + 1,
                createdOn: currentTime,
                modifiedOn: currentTime
    }];
    try {
        const result = await Properties.insertMany(propertiesToAdd);
        return result;
    } catch (e) {
        throw e;
    }
};

export const updateProperty = async (property: Omit<PropertiesModel, "_id" | "createdOn" | "modifiedOn">) => {
    const currentTime = new Date().toDateString();
    // TODO: Add arrays
    const updateValues = {
        groupId: Number(property.groupId),
        modifiedOn: currentTime as unknown as Date
    };

    try {
        const result = await Properties.updateOne({ propertyId: Number(property.propertyId) }, updateValues);
        if (result.n !== 1) {
            throw new Error(`Result number doesn't match: ${result.n}`);
        }
        return { data: "Property Updated" };
    } catch (e) {
        throw e;
    }
};

export const getPropertyCount = async ({ filter, gid }: { filter?: string, gid?: number }) => {
    return await Properties.countDocuments({
        ...(gid ? { groupId: gid } : {}),
        ...(
            !!filter && String(filter) ? {
            name: {
            $regex: filter,
            $options: "i"
        } 
    } : {})
    });
}

export const getProperties = async ({ filter, pids, gid, offset, limit }: { filter?: string, pids?: number[], gid?: number, offset?: number, limit?: number }) => {
    // TODO: Add Admin Check
    const options = {
        sort: { _id: -1 },
        lean: true,
        skip: offset,
        limit,
    }

    // TODO: remove createdOn and use _id
    // TODO: Type correctly
    const textSearch: any = !!filter && String(filter) ? {
        name: {
            $regex: filter,
            $options: "i"
        }
    } : {};

    if (!gid && !pids) {
        return await Properties.find({
            ...textSearch
        }, null, options);
    }

    if (gid) {
        return await Properties.find({
            groupId: gid,
            ...textSearch
        }, null, options);
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
        },
        ...textSearch
    }, null, options);
};

export const deleteProperties = async ({ pids }: { pids: number[] }) => {
    try {
        
       await removeMedia({ propertyIds: pids });
       await Properties.deleteMany({
            propertyId: {
                $in: pids
            }
        });
        return { deleted: true }
    } catch (e) {
        throw e;
    }
}