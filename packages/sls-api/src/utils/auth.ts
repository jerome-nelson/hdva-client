import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import jwt from "jsonwebtoken";
import { ERROR_MSGS } from "../config/messages";
import { Roles } from "../models/roles.model";
import { User, UserModel } from "../models/user.model";
import { startMongoConn } from "./db";
import { BadRequest } from "./error";

export const jwtSign = (params: string | Buffer | object) => {

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

// TODO: Fix types
export const jwtVerify = async (event: APIGatewayTokenAuthorizerEvent, context: any, callback: any): Promise<APIGatewayAuthorizerResult> => {
    try {
        if (!process?.env?.jwt) {
            throw Error(ERROR_MSGS.JWT_NOT_SET);
        }

        const token = event.authorizationToken.replace("Bearer ", "");
        const user = await jwt.verify(token, process.env.jwt as string, {
            algorithms: ["HS256"],
        }) as UserModel;
     
        if (!user) {
            context.failure("EXPIRED_TOKEN");
            throw new Error(ERROR_MSGS.USER_CREDENTIALS_FAIL);
        }

        await startMongoConn();
        const isAuth = await User.userExists(user.email);
        const hasRole = await Roles.rolesExists(String(user.role));

        if (!isAuth || !hasRole) {
            context.failure("Unauthorized");
            throw new Error(ERROR_MSGS.USER_ROLE_NOT_ALLOWED);
        }
        return {
            "principalId": event.authorizationToken,
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "execute-api:Invoke",
                        "Effect": "Allow",
                        "Resource": `${event.methodArn}`
                    }
                ],
            },
            "context": {
                "user": JSON.stringify(user)
            }
        }
    } catch (e) {
        return {
            "principalId": event.authorizationToken,
            "policyDocument": {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Action": "execute-api:Invoke",
                        "Effect": "Deny",
                        "Resource": `${event.methodArn}`
                    }
                ],
            }
        };
    }
}