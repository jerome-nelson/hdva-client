import { APIGatewayProxyResult, APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import querystring from "querystring";
import { ERROR_MSGS } from "../../config/messages";
import { addMedia, removeOneMedia } from "../../models/media.model";
import { UserModel } from "../../models/user.model";
import { startMongoConn } from "../../utils/db";
import { BadRequest } from "../../utils/error";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const CRUDMedia = async (event: APIGatewayRequestAuthorizerEvent & { body: any }): Promise<APIGatewayProxyResult> => {
    const { body } = event;
    const authContext = event.requestContext
      && event.requestContext.authorizer;
    const user: UserModel | undefined = authContext
      && JSON.parse((authContext as any).user);
    const isAdmin = user
      && [1, 2, 4].includes((user as UserModel).role);
      const action = event.pathParameters && event.pathParameters["action"];
  
    if (!user || !isAdmin) {
      throw new BadRequest(ERROR_MSGS.CREDENTIALS_FAIL);
    }
  
    const entries: any = querystring.parse(body);
    try {
      await startMongoConn();
      let result = {};
      if (action === "add") {
        result = await addMedia(entries);
      } else if ( action === "delete" ) {
        await removeOneMedia(entries);
  
        // TODO: (Maybe) Integrate Bucket Deletion
        // const properties = await getProperties({
        //   pids: [entries.propertyId]
        // });
  
        // const folder = properties[0].folder;
        // console.log(folder);
        // await deleteFromBucket(`${folder}/${entries.resource}`);
      }
  
      return createResponse(result);
  
    } catch (e) {
      console.log(e);
      return createErrorResponse(e);
    }
  }