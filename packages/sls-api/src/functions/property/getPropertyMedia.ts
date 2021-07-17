import { Context } from "aws-lambda";
import querystring from "querystring";
import { getMedia } from "../../models/media.model";
import { startMongoConn } from "../../utils/db";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const getPropertyMedia = async (event: any, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;
  
    const { body } = event;
    const { pids } = querystring.parse(body);
  
    const ids = Array.isArray(pids) ? pids.map(pid => Number(pid)) : [Number(pids)];
  
    try {
      await startMongoConn();
      const data = await getMedia(ids);
      return createResponse(data);
    } catch (e) {
      return createErrorResponse(e);
    }
  }