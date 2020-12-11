import mongoose, { Model } from "mongoose";

export interface Roles {
    createdOn: Date;
    modifiedOn: Date;
    rolename: number;
    id: number;
    _id: string;
}

type MongoRolesDocument = Roles & mongoose.Document;

export interface MongoRolesModel extends Model<MongoRolesDocument> {
    rolesExists(roleId: string): Promise<boolean>;
}

const RoleSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        required: true,
        trim: true,
    },
    id: {
        type: Number,
        unique: true,
        required: true,
        trim: true,
    },
    modifiedOn:  {
        type: Date,
        required: false,
        trim: true,
    },
    rolename: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
});


RoleSchema.statics.rolesExists = async function (roleId: number) {
    const hasRole = await this.findOne({ id: roleId });
    return !!hasRole;
} 

export const Roles: MongoRolesModel = mongoose.model<MongoRolesDocument, MongoRolesModel>('Roles', RoleSchema);