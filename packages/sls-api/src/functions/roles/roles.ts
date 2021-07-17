import { APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";
import { Roles } from "../../models/roles.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const roles = async (_: APIGatewayRequestAuthorizerEvent, context: Context): Promise<any> => {
    context.callbackWaitsForEmptyEventLoop = false;
  
    try {
      await startMongoConn();
      const data = await Roles.find({}, {
        "rolename": 1,
        "id": 1
      });
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }