import { APIGatewayProxyResult } from "aws-lambda";
import querystring from "querystring";
import { ERROR_MSGS } from "../../config/messages";
import { getGroups } from "../../models/groups.model";
import { UserModel } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { GeneralError } from "../../utils/error";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const groups = async (event: any): Promise<APIGatewayProxyResult> => {
    const authContext = event.requestContext
      && event.requestContext.authorizer;
  
    const user: UserModel | undefined = authContext
      && JSON.parse((authContext as any).user);
  
    const isAdmin = user
      && [1, 2, 4].includes((user as UserModel).role);
  
    if (!user || (user && !(user as UserModel).group && !isAdmin)) {
      throw new GeneralError(ERROR_MSGS.CREDENTIALS_FAIL);
    }
  
    try {
      const params = querystring.parse(event.body);
      await startMongoConn();
      const result =
        await getGroups({
          gid: isAdmin ? undefined : Number((user as UserModel).group),
          limit: params.limit ? Number(params.limit) || 100 : undefined,
          offset: params.offset ? Number(params.offset) || 0 : undefined
        });
      return createResponse(result);
    } catch (e) {
      return createErrorResponse(e);
    }
  }