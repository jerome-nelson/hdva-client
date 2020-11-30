import jwt from "jsonwebtoken";
import { BadRequest } from "./error";
import { ERROR_MSGS } from "./messages";


// export const tokenConfig = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: config.jwtToken || '',
//     passReqToCallback: true,
//     algorithms: ['HS256'],
//     jsonWebTokenOptions: {
//         maxAge: '2d',
//     }
// }

// const jwtVerify = async (req: Request, jwt_payload: Express.User, done: VerifiedCallback) => {
//     try {
//         if (!await User.userExists(jwt_payload.email.toLowerCase())) {
//             throw new NotFound(ERROR_MSGS.USER_NOT_FOUND);
//         }
        
//         if (!await hasPermission({roleId: jwt_payload.role })) {
//             throw new NotFound(ERROR_MSGS.USER_ROLE_NOT_ALLOWED);
//         }

//         done(false, jwt_payload, req);
//     } catch (e) {
//         done(e, false);
//     }
// }

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