import { APIGatewayProxyResult, Context } from "aws-lambda";
import { getGroupCount } from "../../models/groups.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const groupCount = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      await startMongoConn();
      const data = await getGroupCount();
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }
  