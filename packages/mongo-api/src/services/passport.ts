import passport, { PassportStatic } from "passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { config } from "./config";
import { models } from "../mongo/schema";
import { Request } from "express";

export const tokenConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtToken || '',
    passReqToCallback: true,
    algorithms: ['HS256'],
    jsonWebTokenOptions: {
        maxAge: '2d',
    }
}

// Is there a more efficient way to add this to each request? i.e middleware 
const passportStrategy = (сonn: any, passportInstance: PassportStatic = passport) => {
    const User = models(сonn).users;
    passportInstance.use(new Strategy(tokenConfig, async function(req: Request, jwt_payload: any, done: VerifiedCallback) {
        try {
            const user = await User.findOne({ email: jwt_payload.email.toLowerCase() });
            if (!user) {
                throw new Error("User not found");
            }
            done(false, jwt_payload, req);
        } catch(e) {
            done(e, false);
        }
    }));
}

export {
    passportStrategy
}