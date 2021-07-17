import { APIGatewayProxyResult, APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";
import { getCurrentUser, UserModel } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const getUser = async (event: APIGatewayRequestAuthorizerEvent, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const { requestContext } = event;
    const { email }: UserModel = JSON.parse((requestContext as any).authorizer.user);
  
    try {
      await startMongoConn();
      const data = await getCurrentUser(email);
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }