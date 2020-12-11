
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
