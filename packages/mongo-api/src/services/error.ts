import express from "express";
import { ERROR_MSGS } from "../config/errors";

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

const errorsHandler = () => ((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (error instanceof GeneralError) {
          return res.status(error.getCode()).json({
            message: `Error Occurred: ${error.message}`,
            success: false
          });
        }
      
        return res.status(500).json({
            message: `Error Occurred: ${error.message}`,
            success: false
        });
})

const noPostBody = () => ((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (
    req.method.toLowerCase() === "post" && Object.keys(req.body).length
  ) {
      throw new BadRequest(ERROR_MSGS.NO_POST_BODY);
  }
  next();
});

export {
    errorsHandler,
    noPostBody,
    AlreadyExists,
    BadRequest,
    GeneralError,
    NotFound
}