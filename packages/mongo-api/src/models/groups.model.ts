import mongoose from "mongoose";
import { Properties } from "./properties.model";

export interface Groups extends mongoose.Document {
    createdOn: Date;
    description?: string;
    modifiedOn: Date;
    name: string;
    groupId: number;
    _id: string;
}

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



export const Groups: any = mongoose.model('Groups', GroupsSchema);

// Services
export const addGroup = async (groups: Omit<Groups, "_id" | "createdOn" | "modifiedOn">[]) => {
    const currentTime = new Date().toDateString();
    const groupsToAdd = groups.map(group => ({
        ...group,
        createdOn: currentTime,
        modifiedOn: currentTime
    }));
    try {
        const result = await Groups.insertMany(groupsToAdd);
        return {
            groups: result,
            success: true
        }
    } catch (e) {
        throw e;
    }
};


export const getGroups = async (gid?: number) => {
    let result: Record<string, any> = {
        success: false,
        groups: []
    };

    if (gid) {
        result.groups = await Groups.find({
            groupId: gid
        });
        result.success = true;

        return result;
    }

    result.groups = await Groups.find();
    result.success = true;

    return result;
};

export const updateGroup = async ({ from, to }: { from: number, to: Omit<Groups, "_id" | "createdOn" | "modifiedOn"> }) => {
    try {
        const addNewGroup = await addGroup([to]);
        const updateProperties = await Properties.updateMany({
            groupId: {
                $in: [from]
            }
        }, { groupId: to.groupId });


        return {
            group: addNewGroup,
            properties: updateProperties.nModified,
            success: true
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
            deleted: {
                groups: groups.deletedCount,
                properties: properties.deletedCount
            },
            success: true
        }
    } catch (e) {
        throw e;
    }
}