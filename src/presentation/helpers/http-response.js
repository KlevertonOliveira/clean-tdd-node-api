import { StatusCodes } from 'http-status-codes';
import { MissingParamError } from './missing-param-error';
import { ServerError } from './server-error';
import { UnauthorizedError } from './unauthorized-error';

export class HttpResponse {
  static badRequest(paramName) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: new MissingParamError(paramName),
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
