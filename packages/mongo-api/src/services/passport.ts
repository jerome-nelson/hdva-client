import passport, { PassportStatic } from "passport";
import { VerifyFunction, IVerifyOptions } from "passport-local";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "./config";
import { models } from "../mongo/schema";

export const tokenConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtToken || '',
    algorithms: ['HS256'],
    jsonWebTokenOptions: {
        maxAge: '2d',
    }
}

const passportStrategy = (сonn: any, passportInstance: PassportStatic = passport) => {
    const User = models(сonn).users;
    passportInstance.use(new Strategy(tokenConfig, async function(jwt_payload, done) {
        try {
            const user = await User.findOne({ email: jwt_payload.email.toLowerCase() });
            if (!user) {
                throw new Error("User not found");
            }
            done(false, jwt_payload, "Successful Authentication");
        } catch(e) {
            done(e, false);
        }
    }));
}

export {
    passport,
    passportStrategy
}