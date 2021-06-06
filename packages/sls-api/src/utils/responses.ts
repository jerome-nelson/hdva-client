import { APIGatewayProxyResult } from "aws-lambda";
import { GeneralError } from "./error";

type ResponseOptions = Omit<APIGatewayProxyResult, 'body'>;

export const createResponse = (data: any, options?: ResponseOptions & { body?: any }, successful = true): APIGatewayProxyResult => {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: JSON.stringify({ success: successful, data }, null, 2),
      ...options
    }
  }
  
export const createErrorResponse = ((error: Error) => createResponse(
  `Error Occurred: ${error.message}`,
    {
      statusCode: error instanceof GeneralError ? error.getCode() : 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/html"
      },
    },
    false
  ));
  