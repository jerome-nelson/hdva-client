import { APIGatewayProxyResult, Context } from "aws-lambda";
import querystring from "querystring";
import { findUsers, UserModel } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const users = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const { requestContext } = event;
    const params = querystring.parse(event.body);
    const { userId, role, group }: UserModel = JSON.parse((requestContext as any).authorizer.user);
    try {
      await startMongoConn();
      const data = await findUsers({
        currentUserId: userId, 
        userSearch: params.filter ? Array.isArray(params.filter) ? params.filter[0] : params.filter : undefined,
        limit: params.limit ? Number(params.limit) || 100 : undefined,
        offset: params.offset ? Number(params.offset) || 0 : undefined,
        groupId: role === 1 ? undefined : group
      });
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }