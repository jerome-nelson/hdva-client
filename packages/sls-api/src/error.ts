
class GeneralError extends Error {
    constructor(message: string) {
      super();
      this.message = message;
    }
  
    getCode() {
      if (this instanceof BadRequest) {
        return 400;
      } if (this instanceof NotFound) {
        return 404;
      } if (this instanceof AlreadyExists) {
        return 302;
      }
      return 500;
    }
  }
  
class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class AlreadyExists extends GeneralError { }

export { AlreadyExists, BadRequest, GeneralError, NotFound };


export const createErrorResponse = ((error: Error) => {
  if (error instanceof GeneralError) {
    return {
      headers: { 'Content-Type': 'text/plain' },
      statusCode: error.getCode() || 501,
      body: {
        message: `Error Occurred: ${error.message}`,
        success: false
      },
    };
  }

  return {
    headers: { 'Content-Type': 'text/plain' },
    body: {
      message: `Error Occurred: ${error.message}`,
      success: false
    }
  };
})