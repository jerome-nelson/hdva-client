import { APIGatewayProxyResult, Context } from "aws-lambda";
import querystring from "querystring";
import { getProperties } from "../../models/properties.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";


export const properties = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const params = querystring.parse(event.body);
  
    try {
      await startMongoConn();
      const data = await getProperties({
        filter: params.filter ? Array.isArray(params.filter) ? params.filter[0] : params.filter : undefined,
        gid: params.group ? Number(params.group) : undefined,
        limit: params.limit ? Number(params.limit) || 100 : undefined,
        offset: params.offset ? Number(params.offset) || 0 : undefined,
        pids: params.pids ? Array.isArray(params.pids) ? params.pids.map((pid: string) => Number(pid)) : [Number(params.pids)] : undefined
      });
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }