import mongoose from "mongoose";

export interface Properties extends mongoose.Document {
    createdOn: Date;
    modifiedOn: Date;
    name: number;
    propertyId: number;
    groupId: number;
    _id: string;
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

export const Properties: any = mongoose.model('Properties', PropertiesSchema);

// Services
export const addProperties = async (properties: Omit<Properties, "_id" | "createdOn" | "modifiedOn">[]) => {
    const currentTime = new Date().toDateString();
    const propertiesToAdd = properties.map(property => ({
        ...property,
        createdOn: currentTime,
        modifiedOn: currentTime
    }));

    try {
        const result = await Properties.insertMany(propertiesToAdd);
        return {
            properties: result,
            success: true
        }
    } catch (e) {
        throw e;
    }
};


export const getProperties = async ({ pids, gid }: { pids?: number[], gid?: number }) => {
    let result: Record<string, any> = {
        success: false,
        properties: []
    };

    if (!gid && !pids) {
        return {
            statusCode: 200,
            body: JSON.stringify(result, null, 2),
        };
    }

    if (gid) {
        result.properties = await Properties.find({
            groupId: gid
        });
        result.success = true;

        return {
            statusCode: 200,
            body: JSON.stringify(result, null, 2),
        }
    }

    const check = await Properties.doPropertiesExist(pids);
    const hasProperties = pids && pids.reduce((result, property) => result = result ? result : check[property], false);

    if (!hasProperties) {
        return {
            statusCode: 200,
            body: JSON.stringify(result, null, 2),
        }
    }

    result.properties = await Properties.find({
        propertyId: {
            $in: pids
        }
    });
    result.success = true;

    return {
        statusCode: 200,
        body: JSON.stringify(result, null, 2),
    }
};

export const deleteProperties = async ({ pids }: { pids: number[] }) => {
    try {
        const result = await Properties.deleteMany({
            propertyId: {
                $in: pids
            }
        });
        return {
            deleted: result.deletedCount,
            success: true
        }
    } catch (e) {
        throw e;
    }
}