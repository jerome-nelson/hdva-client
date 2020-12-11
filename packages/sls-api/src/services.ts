import { APIGatewayProxyResult, APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";
import querystring from "querystring";
import { ERROR_MSGS } from "./config/messages";
import { addGroup, deleteGroups, getGroups, updateGroup } from "./models/groups.model";
import { addProperties, deleteProperties, getProperties } from "./models/properties.model";
import { Roles } from "./models/roles.model";
import { createNewUser, findUsers, loginUserWithPassword, UserModel } from "./models/user.model";
import { startMongoConn } from "./utils/db";
import { BadRequest, GeneralError, NotFound } from "./utils/error";
import { createErrorResponse, createResponse } from "./utils/responses";

export const login = async (event: any, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { body } = event;
  const { username, password } = querystring.parse(body);

  try {
    await startMongoConn();
    const data = await loginUserWithPassword(username as string, password as string);
    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
};



export const register = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await startMongoConn();
    const data = await createNewUser({
      group: event.body.group,
      name: event.body.name,
      role: event.body.role,
      email: event.body.email,
      password: event.body.password
    });
    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
};


export const roles = async (_: APIGatewayRequestAuthorizerEvent, context: Context): Promise<any> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await startMongoConn();
    const data = await Roles.find();
    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export const properties = async (_: APIGatewayRequestAuthorizerEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  // const { requestContext } = event;
  try {
    await startMongoConn();
    const data = await getProperties({});
    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export const users = async (event: APIGatewayRequestAuthorizerEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { requestContext } = event;
  const user: UserModel = (requestContext as any).user;
  try {
    const params = user && user.role === 1 ? undefined : user && user.group;
    await startMongoConn();
    const data = await findUsers(params);

    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export const groups = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayProxyResult> => {
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
    await startMongoConn();
    const result =
      await getGroups(isAdmin ? undefined : Number((user as UserModel).group));
    return createResponse(result);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export const groupCRUD = async (event: APIGatewayRequestAuthorizerEvent & { body: any }, context: Context): Promise<APIGatewayProxyResult> => {
  const action = event.pathParameters && event.pathParameters["action"];
  const { body } = event;
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
      if (!body || !body.length) {
        throw new BadRequest(ERROR_MSGS.NO_GROUPS);
      }
      result = await addGroup(body);
    } else if (action === "update") {
      const { gid, group } = body;
      if (!gid || !group) {
        throw new BadRequest(ERROR_MSGS.NO_GROUPS);
      }
      result = await updateGroup({ from: Number(gid), to: JSON.parse(group) });
    } else if (action === "delete") {
      const { gids } = event.body;
      if (!gids || !gids.length) {
        throw new BadRequest(ERROR_MSGS.NO_ID);
      }
      result = await deleteGroups({
        gids: Array.isArray(gids) ? gids.map((gid: string) => Number(gid)) : [Number(gids)]
      });
    }
    return createResponse(result);
  } catch (e) {
    return createErrorResponse(e);
  }
}

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
    let result = {};

    if (action === "add") {
      if (!body || !body.length) {
        throw new BadRequest(ERROR_MSGS.NO_PROPERTIES_PAYLOAD);
      }

      result = await addProperties(body);
    }

    else if (action === "update") {
      throw new NotFound("UPDATE not set");
    }

    else if (action === "delete") {
      const { pids } = body;
      if (!pids || !pids.length) {
        throw new BadRequest(ERROR_MSGS.NO_ID);
      }
      result = await deleteProperties({
        pids: Array.isArray(pids) ? pids.map((pid: string) => Number(pid)) : [Number(pids)]
      });
    }
    return createResponse(result);
  } catch (e) {
    return createErrorResponse(e);
  }
}