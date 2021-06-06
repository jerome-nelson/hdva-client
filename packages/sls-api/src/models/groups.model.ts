import mongoose, { Model } from "mongoose";
import { Properties } from "./properties.model";

export interface GroupsModel {
    createdOn: Date;
    description?: string;
    modifiedOn: Date;
    name: string;
    groupId: number;
    _id: string;
}

type MongoGroupsDocument = mongoose.Document & GroupsModel;
const GroupsSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        required: true,
        trim: true,
    },
    groupId: {
        type: Number,
        unique: true,
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
    description: {
        default: "",
        type: String,
        trim: true,
    },

});



export const Groups: Model<MongoGroupsDocument> = mongoose.model<MongoGroupsDocument, Model<MongoGroupsDocument>>('Groups', GroupsSchema);
export const addGroup = async (groups: Omit<GroupsModel, "_id" | "createdOn" | "modifiedOn">[]) => {
    const currentTime = new Date().toDateString();
    const groupsToAdd = groups.map(group => ({
        ...group,
        createdOn: currentTime,
        modifiedOn: currentTime
    }));
    try {
        const result = await Groups.insertMany(groupsToAdd);
        return result;
    } catch (e) {
        throw e;
    }
};


export const getGroups = async ({gid, offset, limit }: { filter?: string, gid?: number, offset?: number, limit?: number }) => {
    // TODO: Add Admin Check
    const sort = offset && limit ? {
        lean: true,
        skip: offset,
        limit,
    } : {};

    if (Number(gid)) {
        return await Groups.find({
            groupId: gid
        }, sort);
    }

    return await Groups.find({}, sort);
};

export const getGroupCount = async () => {
    return await Groups.countDocuments();
}

export const updateGroup = async ({ from, to }: { from: number, to: Omit<GroupsModel, "_id" | "createdOn" | "modifiedOn"> }) => {
    try {
        const addNewGroup = await addGroup([to]);
        const updateProperties = await Properties.updateMany({
            groupId: {
                $in: [from]
            }
        }, { groupId: to.groupId });


        return {
            group: addNewGroup,
            properties: updateProperties.nModified
        }
    } catch (e) {
        throw e;
    }
}

export const deleteGroups = async ({ gids }: { gids: number[] }) => {
    try {
        const properties = await Properties.deleteMany({
            groupId: {
                $in: gids
            }
        });

        const groups = await Groups.deleteMany({
            groupId: {
                $in: gids
            }
        });
        return {
            groups: groups.deletedCount,
            properties: properties.deletedCount
        };
    } catch (e) {
        throw e;
    }
}