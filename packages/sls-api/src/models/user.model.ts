import bcrypt from "bcryptjs";
import mongoose, { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { jwtSign } from "../auth";
import { AlreadyExists, BadRequest } from "../error";
import { ERROR_MSGS } from "../messages";


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
    const user = this.findOne({ email });
    return !!user;
}

UserSchema.statics.comparePass = async function (email: string, password: string) {

    const user = await this.findOne({ email: email.toLowerCase() });

    if (!user) {
        return false;
    }

    const userMap = JSON.parse(JSON.stringify(user));
    const isPasswordTheSame = await bcrypt.compare(password, userMap.password);
    return !!isPasswordTheSame;
}

UserSchema.pre<MongoUser>('save', async function (next) {

    const user: any = this;
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



// TODO: Fix Typing of statics
export const User: any = mongoose.model('User', UserSchema);

// Services
export const loginUserWithPassword = async (username: string, password: string) => {
    if (!username || !password) {
        throw new BadRequest(ERROR_MSGS.NO_POST_BODY);
    }

    const email = username.toLowerCase();
    if (await !User.comparePass(email, password)) {
        throw new BadRequest(ERROR_MSGS.CREDENTIALS_FAIL);
    }

    const user = JSON.parse(JSON.stringify(await User.findOne({ email: email })));
    const token = jwtSign(user);
    return  {
        statusCode: 200,
        body: JSON.stringify({
            ...user,
            success: true,
            token: `Bearer ${token}`
        }, null, 2),
      }
}

export const createNewUser = async (user: Record<string, any>) => {
    try {
        if (await User.userExists(user.email)) {
           throw new AlreadyExists(ERROR_MSGS.ACCOUNT_EXISTS);
        }
       await new User({
            createdOn: new Date(),
            modifiedOn: new Date(),
            ...user

        }).save();
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true
            }, null, 2),
        }
    } catch (e) {
        throw e;
    }
}