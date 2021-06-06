import { APIGatewayProxyResult, APIGatewayRequestAuthorizerEvent, Context } from "aws-lambda";
import { default as qs, default as querystring } from "querystring";
import { ERROR_MSGS } from "./config/messages";
import { addGroup, deleteGroups, getGroupCount, getGroups, updateGroup } from "./models/groups.model";
import { addMedia, getMedia } from "./models/media.model";
import { addProperties, deleteProperties, getProperties, getPropertyCount } from "./models/properties.model";
import { Roles } from "./models/roles.model";
import { createOrEditUser, findUsers, getCurrentUser, getUserCount, loginUserWithPassword, UserModel } from "./models/user.model";
import { startMongoConn } from "./utils/db";
import { BadRequest, GeneralError, NotFound } from "./utils/error";
import { createErrorResponse, createResponse } from "./utils/responses";

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
  const params = qs.parse(event.body);
  try {
    await startMongoConn();
    const data = await createOrEditUser({
      group: params.group,
      name: params.name,
      role: params.role,
      email: params.email,
      password: params.password
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
    const data = await Roles.find({}, {
      "rolename": 1,
      "id": 1
    });
    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export const propertiesCount = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const params = qs.parse(event.body);
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

export const properties = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const params = qs.parse(event.body);

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

export const users = async (event: any, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { requestContext } = event;
  const params = qs.parse(event.body);
  const { userId, role, group }: UserModel = JSON.parse((requestContext as any).authorizer.user);
  try {
    await startMongoConn();
    const data = await findUsers({
      currentUserId: userId, 
      userSearch: params.filter ? Array.isArray(params.filter) ? params.filter[0] : params.filter : undefined,
      limit: params.limit ? Number(params.limit) || 100 : undefined,
      offset: params.offset ? Number(params.offset) || 0 : undefined,
      groupId: role === 1 ? undefined : group
    });
    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
}

export const getUser = async (event: APIGatewayRequestAuthorizerEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { requestContext } = event;
  const { email }: UserModel = JSON.parse((requestContext as any).authorizer.user);

  try {
    await startMongoConn();
    const data = await getCurrentUser(email);
    return createResponse(data);
  } catch (e) {
    return createErrorResponse(e);
  }
}

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
    const params = qs.parse(event.body);
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

export const CRUDMedia = async (event: APIGatewayRequestAuthorizerEvent & { body: any }): Promise<APIGatewayProxyResult> => {
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

  const entries: any = querystring.parse(body);
  console.log(entries);
  try {
    await startMongoConn();
    const result = await addMedia(entries);
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