import { StatusCodes } from 'http-status-codes';
import { MissingParamError } from './missing-param-error';

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
    };
  }
  static unauthorizedError() {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
    };
  }

  static ok(data) {
    return {
      statusCode: StatusCodes.OK,
      body: data,
    };
  }
}
