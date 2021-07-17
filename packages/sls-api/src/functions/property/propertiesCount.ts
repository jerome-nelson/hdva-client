import { APIGatewayProxyResult, Context } from "aws-lambda";
import querystring from "querystring";
import { getPropertyCount } from "../../models/properties.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const propertiesCount = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const params = querystring.parse(event.body);
    try {
      await startMongoConn();
      const data = await getPropertyCount({
        gid: Number(params.group),
        filter: String(params.filter) || ""
      });
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }