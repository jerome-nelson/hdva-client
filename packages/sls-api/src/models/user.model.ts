import bcrypt from "bcryptjs";
import mongoose, { HookNextFunction, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { ERROR_MSGS } from "../config/messages";
import { jwtSign } from "../utils/auth";
import { AlreadyExists, BadRequest } from "../utils/error";

export interface UserModel {
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

type MongoUserDocument = UserModel & mongoose.Document;

export interface MongoUserModel extends Model<MongoUserDocument> {
    userExists(email: string): Promise<boolean>;
    comparePass(email: string, password: string): Promise<boolean>;
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
    const user = this.findOne({ email });
    return !!user;
}

UserSchema.statics.comparePass = async function (email: string, password: string) {

    const user = await this.findOne({ email: email.toLowerCase() });
    if (!user) {
        return false;
    }

    const userMap = JSON.parse(JSON.stringify(user));
    return !!await bcrypt.compare(password, userMap.password);
}

UserSchema.pre<MongoUserDocument>('save', async function (next: HookNextFunction) {

    const user: MongoUserDocument = this;
    // TODO: Generate uuid here as well
    if (!user.isModified("userId")) {
        user.userId = uuidv4();
    }

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    }
});

export const User: MongoUserModel = mongoose.model<MongoUserDocument, MongoUserModel>('User', UserSchema);

export const loginUserWithPassword = async (username: string, password: string) => {
    if (!username || !password) {
        throw new BadRequest(ERROR_MSGS.NO_POST_BODY);
    }

    const email = username.toLowerCase();
    if (await !User.comparePass(email, password)) {
        throw new BadRequest(ERROR_MSGS.USER_CREDENTIALS_FAIL);
    }

    const item = await User.findOne({ email: email });
    const userToken = JSON.parse(JSON.stringify(item));
    const token = jwtSign(userToken);

    if (!item) {
        throw new Error(ERROR_MSGS.USER_NOT_FOUND);
    }

    // TODO: Fix _doc (think it's a mis-typing of mongoose schema)
    return [{
        ...(item as any)._doc,
        token: `Bearer ${token}`
    }]
}

export const createNewUser = async (user: Record<string, any>) => {
    try {
        if (await User.userExists(user.email)) {
            throw new AlreadyExists(ERROR_MSGS.ACCOUNT_EXISTS);
        }
        const result = await new User({
            createdOn: new Date(),
            modifiedOn: new Date(),
            ...user

        }).save();
        return result;
    } catch (e) {
        throw e;
    }
}

export const findUsers = async (groupId?: number) => {
    const params = groupId ? {
        group: {
            $in: groupId
        }
    } : {};
    try {
        return await User.find(params)
    } catch (e) {
        throw e;
    }
}