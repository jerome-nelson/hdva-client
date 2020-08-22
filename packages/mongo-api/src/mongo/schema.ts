import mongoose, { Connection } from "mongoose";

const RoleSchema = new mongoose.Schema({
    createdOn: Date,
    id: Number,
    modifiedOn: Date,
    rolename: String,
});

const UserSchema = new mongoose.Schema({
    createdOn: Date,
    email: String,
    group: Number,
    modifiedOn: Date,
    name: String,
    role: Number,
    userId: Number,
});

const PropertiesSchema = new mongoose.Schema({
    createdOn: Date,
    modifiedOn: Date,
    name: String,
    propertyId: Number,
    groupId: Number
});

const GroupSchema = new mongoose.Schema({
    createdOn: Date,
    modifiedOn: Date,
    name: String,
    propertyId: Number,
    groupId: Number
});

const UploadSchema = new mongoose.Schema({
    createdOn: Date,
    id: Number,
    imagename: String,
    name: String,
    url: String,
    propertyId: Number,
    type: String
});


export const models = (activeCon: Connection) => ({
    roles: activeCon.model("Roles", RoleSchema),
    users: activeCon.model("Users", UserSchema),
    uploads: activeCon.model("Upload", UploadSchema),
    groups: activeCon.model("Groups", GroupSchema),
    properties: activeCon.model("Properties", PropertiesSchema),
});
