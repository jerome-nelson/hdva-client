import bcrypt from "bcryptjs";
import mongoose, { Model } from "mongoose";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

import { ERROR_MSGS } from "../config/errors";

export interface MongoUser extends mongoose.Document {
    createdOn: Date;
    email: string;
    group: number;
    modifiedOn: Date;
    name: string;
    password: string;
    role: number;
    userId: string;
    _id: string;
}

interface MongoUserModel extends Model<MongoUser> {
    userExists(email: string): Promise<boolean>;
}
// TODO: Look into User Validation Rules TRY CATCH/Global try catch for express routes as well
// TODO: Add Password Validation Rules
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    createdOn: {
        type: Date,
        required: true,
        trim: true
    },
    modifiedOn: {
        type: Date,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            message: ERROR_MSGS.INVALID_EMAIL,
            validator: (value: string) => validator.isEmail(value)
        },
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        default: 0,
        type: Number,
    },
    group: {
        default: 0,
        type: Number,
    },
    userId: String,
});

UserSchema.statics.userExists = async function (email: string) {
    const user = this.findOne({ email: email.toLowerCase() });
    return !!user;
}

UserSchema.statics.comparePass = async function (password: string) {
    const isPasswordTheSame = await bcrypt.compare(password, this.password);
    return !!isPasswordTheSame;
}

UserSchema.pre<MongoUser>('save', async function (next) {

    const user: any = this;
    // TODO: Generate uuid here as well
    if(!user.isModified("userId")) {
        user.userId = uuidv4();
    }

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);     
        next();
    }
});

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
UserSchema.post('save', function(error: any, doc: any, next: any) {
    console.log("CALLLLEEDDD IT", error);
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('There was a duplicate key error'));
    } else {
      next();
    }
  });

// TODO: Fix Typing of statics
export const User: any = mongoose.model('User', UserSchema);
