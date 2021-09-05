import { Context } from "aws-lambda";
import querystring from "querystring";
import { loginUserWithPassword } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const login = async (event: any, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
  
    const { body } = event;
    const { username, password } = querystring.parse(body);
  
    try {
      await startMongoConn();
      const data = await loginUserWithPassword(username as string, password as string);
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  };