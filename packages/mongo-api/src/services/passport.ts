import passport, { PassportStatic } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "./config";
import { models } from "../mongo/schema";

export const tokenConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtToken || '',
    passReqToCallback: true,
    algorithms: ['HS256'],
    jsonWebTokenOptions: {
        maxAge: '2d',
    }
}

// TODO: Add Request Typing to Payload
// Is there a more efficient way to add this to each request? i.e middleware 
const passportStrategy = (сonn: any, passportInstance: PassportStatic = passport) => {
    const User = models(сonn).users;
    passportInstance.use(new Strategy(tokenConfig, async function(req: any, jwt_payload: any, done: any) {
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
    passport,
    passportStrategy
}