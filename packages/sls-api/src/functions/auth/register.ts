import { APIGatewayProxyResult, Context } from "aws-lambda";
import querystring from "querystring";
import { createOrEditUser } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const register = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const params = querystring.parse(event.body);
    try {
      await startMongoConn();
      const data = await createOrEditUser({
        group: params.group,
        name: params.name,
        username: params.username,
        role: params.role,
        email: params.email,
        password: params.password
      });
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  };