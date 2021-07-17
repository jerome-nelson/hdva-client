import { APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";
import querystring from "querystring";
import { ERROR_MSGS } from "../../config/messages";
import { addGroup, deleteGroups, updateGroup } from "../../models/groups.model";
import { UserModel } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { BadRequest } from "../../utils/error";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const groupCRUD = async (event: APIGatewayRequestAuthorizerEvent & { body: any }, context: Context) => {
    const action = event.pathParameters && event.pathParameters["action"];
    const params = querystring.parse(event.body);
    const authContext = event.requestContext
      && event.requestContext.authorizer;
    const user: UserModel | undefined = authContext
      && JSON.parse((authContext as any).user);
  
    const isAdmin = user
      && [1, 2, 4].includes((user as UserModel).role);
  
    if (!action) {
      throw new BadRequest(ERROR_MSGS.NO_ACTION_GIVEN);
    }
  
    if (!user || !isAdmin) {
      throw new BadRequest(ERROR_MSGS.CREDENTIALS_FAIL);
    }
  
    // ADD
    try {
      let result = {};
      await startMongoConn();
      if (action === "add") {
  
        if (!params) {
          throw new BadRequest(ERROR_MSGS.NO_GROUPS);
        }
        result = await addGroup([params as any]);
        return createResponse(result);
      } else if (action === "update") {
        const { gid, group } = params;
        if (!gid || !group) {
          throw new BadRequest(ERROR_MSGS.NO_GROUPS);
        }
        result = await updateGroup({ from: Number(gid), to: group as any });
        return createResponse(result);
      } else if (action === "delete") {
        if (!params.gids || !params.gids.length) {
          throw new BadRequest(ERROR_MSGS.NO_ID);
        }
        result = await deleteGroups({
          gids: Array.isArray(params.gids) ? params.gids.map((gid: string) => Number(gid)) : [Number(params.gids)]
        });
        return createResponse(result);
      }
    } catch (e) {
      return createErrorResponse(e);
    }
  }
  