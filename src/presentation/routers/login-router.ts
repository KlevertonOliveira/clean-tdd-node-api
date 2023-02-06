import { StatusCodes } from 'http-status-codes';
import { MissingParamError } from '../helpers/missing-param-error';

export interface HttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

interface HttpResponse {
  statusCode: number;
  body?: string | MissingParamError;
}

export class LoginRouter {
  route(httpRequest?: HttpRequest): HttpResponse {
    if (!httpRequest || !httpRequest.body) {
      return { statusCode: StatusCodes.INTERNAL_SERVER_ERROR } as HttpResponse;
    }

    const { email, password } = httpRequest.body;
    if (!email) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: new MissingParamError('email'),
      } as HttpResponse;
    }
    if (!password) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: new MissingParamError('password'),
      } as HttpResponse;
    }

    return { statusCode: StatusCodes.OK } as HttpResponse;
  }
}
