import { APIGatewayProxyResult, APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";
import querystring from "querystring";
import { ERROR_MSGS } from "../../config/messages";
import { addProperties, deleteProperties, updateProperty } from "../../models/properties.model";
import { UserModel } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { BadRequest } from "../../utils/error";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const propertyCRUD = async (event: APIGatewayRequestAuthorizerEvent & { body: any }, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const action = event.pathParameters && event.pathParameters["action"];
    const { body } = event;
    const authContext = event.requestContext
      && event.requestContext.authorizer;
    const user: UserModel | undefined = authContext
      && JSON.parse((authContext as any).user);
    const isAdmin = user
      && [1, 2, 4].includes((user as UserModel).role);
  
    if (!user || !isAdmin) {
      throw new BadRequest(ERROR_MSGS.CREDENTIALS_FAIL);
    }
  
    if (!action) {
      throw new BadRequest(ERROR_MSGS.NO_ACTION_GIVEN);
    }
  
    try {
      await startMongoConn();
      let result = {};
      if (action === "add") {
        if (!body || !body.length) {
          throw new BadRequest(ERROR_MSGS.NO_PROPERTIES_PAYLOAD);
        }
        const entry = querystring.parse(body) as any;
        result = await addProperties(entry);
      }
  
      else if (action === "update") {
        if (!body || !body.length) {
          throw new BadRequest(ERROR_MSGS.NO_PROPERTIES_PAYLOAD);
        }
        const entry = querystring.parse(body) as any;
        result = await updateProperty(entry);
      }
  
      else if (action === "delete") {
        const { pids } = querystring.parse(body) as any;
        if (!pids || !pids.length) {
          throw new BadRequest(ERROR_MSGS.NO_ID);
        }
        result = await deleteProperties({
          pids: Array.isArray(pids) ? pids.map((pid: string) => Number(pid)) : [Number(pids)]
        });
      }
      return createResponse(result);
    } catch (e) {
      console.error(e.message);
      return createErrorResponse(e);
    }
  }