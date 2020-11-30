import { APIGatewayProxyResult, Context } from "aws-lambda";
import { createErrorResponse } from "./error";
import { ERROR_MSGS } from "./messages";
import { getProperties } from "./models/properties.model";
import { Roles } from "./models/roles.model";
import { createNewUser, loginUserWithPassword } from "./models/user.model";


// Creates token from user input and returns JWT
export const login = async (event: any, _context: Context, callback: any): Promise<APIGatewayProxyResult> => {
  const { username, password } = event.body;

  try {
    return await loginUserWithPassword(username, password);
  } catch (e) {
    return callback(null, createErrorResponse(e));
  }
};

export const register = async (event: any, _context: Context, callback: any): Promise<APIGatewayProxyResult> => {
  try {
      return await createNewUser({
          group: event.body.group,
          name: event.body.name,
          role: event.body.role,
          email: event.body.email,
          password: event.body.password
      });
  } catch (e) {
    return callback(null, createErrorResponse(e));
  }
};


export const roles = async (_event: any, _context: Context, callback: any): Promise<APIGatewayProxyResult> => {
  try {
    console.log(_event, _context);
    debugger;
    const roles = await Roles.find();
    return {
      statusCode: 200,
      body: JSON.stringify({
          roles,
          success: true
      }, null, 2),
    }
  } catch (e) {
    return callback(null, createErrorResponse(e));
  }
}

export const properties = async (event: any, _context: Context, callback: any): Promise<APIGatewayProxyResult> => {
  const { gid, pid } = event.params;
    try {
        if (!gid && !pid) {
            throw new Error(ERROR_MSGS.NO_ID);
        }
       return await getProperties({
            gid: Number(gid),
            pids: [Number(pid)]
        });
    } catch (e) {
      return callback(null, createErrorResponse(e));
    }
}