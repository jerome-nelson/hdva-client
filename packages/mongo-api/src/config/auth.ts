import { Request } from "express";
import jwt from "jsonwebtoken";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { hasPermission } from "../models/roles.model";
import { User } from "../models/user.model";
import { BadRequest, NotFound } from "../services/error";
import { config } from "./config";
import { ERROR_MSGS } from "./errors";


export const tokenConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtToken || '',
    passReqToCallback: true,
    algorithms: ['HS256'],
    jsonWebTokenOptions: {
        maxAge: '2d',
    }
}

const jwtVerify = async (req: Request, jwt_payload: Express.User, done: VerifiedCallback) => {
    try {
        if (!await User.userExists(jwt_payload.email.toLowerCase())) {
            throw new NotFound(ERROR_MSGS.USER_NOT_FOUND);
        }
        
        if (!await hasPermission({roleId: jwt_payload.role })) {
            throw new NotFound(ERROR_MSGS.USER_ROLE_NOT_ALLOWED);
        }

        done(false, jwt_payload, req);
    } catch (e) {
        done(e, false);
    }
}

const { jwtToken } = config;

export const jwtSign = (params: string | Buffer | object) => {
    if (!jwtToken) {
        throw new BadRequest(ERROR_MSGS.JWT_NOT_SET);
    }

    return jwt.sign(params, jwtToken, {
        algorithm: "HS256",
        expiresIn: "1d"

    });
}


export const jwtStrategy = new Strategy(tokenConfig, jwtVerify);