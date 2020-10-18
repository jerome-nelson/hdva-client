import mongoose, { Connection } from "mongoose";

//  TODO: Look into merging Schema declaration and Typescript models
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
    userId: String,
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


export const models = {
    roles: mongoose.model("Roles", RoleSchema),
    users: mongoose.model("Users", UserSchema),
    groups: mongoose.model("Groups", GroupSchema),
    properties: mongoose.model("Properties", PropertiesSchema),
};
