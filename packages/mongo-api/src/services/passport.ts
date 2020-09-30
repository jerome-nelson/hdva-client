import passport, { PassportStatic } from "passport";
import { Strategy, VerifyFunction, IVerifyOptions } from "passport-local";

const passportStrategy = (callback: (email: string, password: string, done:
    (
        error: any,
        user?: any,
        options?: IVerifyOptions
    ) => void)
    => void) => {
    passport.use(
        new Strategy(async function (username: string, password: string, done) {
            callback(username.toLowerCase(), password, done);
        }
        )
    )
};

export {
    passport,
    passportStrategy
}