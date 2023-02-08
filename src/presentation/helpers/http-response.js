import { StatusCodes } from 'http-status-codes';
import { ServerError } from '../errors/server-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

export class HttpResponse {
  static badRequest(error) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: error,
    };
  }
  static serverError() {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: new ServerError(),
    };
  }
  static unauthorizedError() {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: new UnauthorizedError(),
    };
  }

  static ok(data) {
    return {
      statusCode: StatusCodes.OK,
      body: data,
    };
  }
}
