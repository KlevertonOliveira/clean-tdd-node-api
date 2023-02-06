import { describe, expect, it } from 'vitest';
import { StatusCodes } from 'http-status-codes';

interface HttpRequest {
  body?: {
    email?: string;
    password?: string;
  };
}

interface HttpResponse {
  statusCode: number;
}

class LoginRouter {
  route(httpRequest?: HttpRequest): HttpResponse {
    let httpResponse: HttpResponse = { statusCode: StatusCodes.OK };

    if (!httpRequest || !httpRequest.body) {
      httpResponse.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return httpResponse;
    }

    const { email, password } = httpRequest.body;

    if (!email || !password) {
      httpResponse.statusCode = StatusCodes.BAD_REQUEST;
    }

    return httpResponse;
  }
}

describe('Login Router', () => {
  it('should return "BAD_REQUEST" (400) status if no email is provided', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {
      body: {
        password: 'anything',
      },
    };

    const httpResponse: HttpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should return "BAD_REQUEST" (400) status if no password is provided', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {
      body: {
        email: 'anything@test.com',
      },
    };

    const httpResponse: HttpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if no httpRequest is provided', () => {
    const sut = new LoginRouter();
    const httpResponse: HttpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if httpRequest has no body', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {};
    const httpResponse: HttpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
