import { Request } from "express";
import jwt from "jsonwebtoken";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { config } from "./config";
import { ERROR_MSGS } from "./errors";
import { models } from "../services/mongo";
import { NotFound, BadRequest } from "../services/error";

export const tokenConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtToken || '',
    passReqToCallback: true,
    algorithms: ['HS256'],
    jsonWebTokenOptions: {
        maxAge: '2d',
    }
}

const jwtVerify = async (req: Request, jwt_payload: any, done: VerifiedCallback) => {
    try {
        const user = await models.users.findOne({ email: jwt_payload.email.toLowerCase() });
        if (!user) {
            throw new NotFound(ERROR_MSGS.USER_NOT_FOUND);
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