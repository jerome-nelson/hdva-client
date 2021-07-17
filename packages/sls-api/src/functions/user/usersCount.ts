import { APIGatewayProxyResult, Context } from "aws-lambda";
import qs from "querystring";
import { getUserCount } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const usersCount = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      const params = qs.parse(event.body);
      await startMongoConn();
      const data = await getUserCount({
        groupId: Number(params.group),
        filter: String(params.filter) || ""
      });
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }
  