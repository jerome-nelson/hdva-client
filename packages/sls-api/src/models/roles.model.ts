import mongoose from "mongoose";

export interface Roles extends mongoose.Document {
    createdOn: Date;
    modifiedOn: Date;
    rolename: number;
    id: number;
    _id: string;
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

export const Roles: any = mongoose.model('Roles', RoleSchema);

// Services
export const hasPermission = async ({ roleId }: { roleId: number}) => {
    if(!await Roles.rolesExists(roleId)) {
        return false;
    }
    return true;
};

// TODO: Extend roles into data
// TODO: Update, Delete, Add Roles (needs permissions)