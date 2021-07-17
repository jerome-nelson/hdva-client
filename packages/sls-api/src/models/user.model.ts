import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { HookNextFunction, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { ERROR_MSGS } from "../config/messages";
import { BadRequest } from "../utils/error";

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
    const user = this.findOne({ email: email.toLowerCase() });
    return user;
}

UserSchema.statics.comparePass = async function (email: string, password: string) {

    const user = await this.findOne({ email: email.toLowerCase() });
    if (!user) {
        return false;
    }

    const userMap = JSON.parse(JSON.stringify(user));
    return Boolean(await bcrypt.compare(password, userMap.password));
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

const jwtSign = (params: string | Buffer | object) => {
    if (!process.env.jwt) {
        throw new BadRequest(ERROR_MSGS.JWT_NOT_SET)
    }

    return jwt.sign(
        params,
        process.env.jwt,
        {
            algorithm: "HS256",
            expiresIn: "1d"

        }
    );
}

export const loginUserWithPassword = async (username: string, password: string) => {
    if (!username || !password) {
        throw new BadRequest(ERROR_MSGS.NO_POST_BODY);
    }

    const email = username.toLowerCase();
    if (!await User.comparePass(email, password)) {
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

export const createOrEditUser = async (user: Record<string, any>) => {
    try {
        if (await User.userExists(user.email)) {
            const data = User.findOneAndUpdate({
                email: user.email.toLowerCase()
            });
            return data;
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

export const getCurrentUser = async (email: string) => {
    try {
        const result = await User.findOne({ email: String(email) }, {
            "_id": 0,
            "userId": 1,
            "role": 1,
            "group": 1,
            "email": 1,
            "name": 1
        });
        return [result];
    } catch (e) {
        throw e;
    }
}

export const findUsers = async ({ currentUserId, userSearch, groupId, offset, limit } : { currentUserId: string, userSearch?: string, groupId?: number, offset?: number, limit?: number }) => {
    // TODO: Type correctly
    const sort = {
        _id: -1,
        lean: true,
        skip: offset,
        limit
    }
    const textSearch: any = !!userSearch && String(userSearch) ? {
        userId: {
            $ne: currentUserId
        },
        name: {
            $regex: userSearch,
            $options: "i"
        },
        email: {
            $regex: userSearch,
            $options: "i"
        }
    } : {};
    const params = groupId ? {
        group: {
            $in: groupId
        },
        ...textSearch
    } : { ...textSearch };
    try {
        return await User.find(params, {
            "_id": 0,
            "userId": 1,
            "role": 1,
            "group": 1,
            "email": 1,
            "name": 1
        }, sort);
    } catch (e) {
        throw e;
    }
}

export const getUserCount = async ({ filter, groupId }: { filter?: string, groupId?: number }) => {
    const textSearch: any = !!filter && String(filter) ? {
        name: {
            $regex: filter,
            $options: "i"
        },
        email: {
            $regex: filter,
            $options: "i"
        }
    } : {};
    const params = groupId ? {
        group: {
            $in: groupId
        },
        ...textSearch
    } : { ...textSearch };
    return await User.countDocuments(params);
}
