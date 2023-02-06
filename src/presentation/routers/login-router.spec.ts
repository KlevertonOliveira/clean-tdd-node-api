import { describe, expect, it } from 'vitest';
import { StatusCodes } from 'http-status-codes';
import { HttpRequest, LoginRouter } from './login-router';
import { MissingParamError } from '../helpers/missing-param-error';

describe('Login Router', () => {
  it('should return "BAD_REQUEST" (400) status if no email is provided', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {
      body: {
        password: 'anything',
      },
    };

    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual(new MissingParamError('email'));
  });

  it('should return "BAD_REQUEST" (400) status if no password is provided', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {
      body: {
        email: 'anything@test.com',
      },
    };

    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual(new MissingParamError('password'));
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if no httpRequest is provided', () => {
    const sut = new LoginRouter();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if httpRequest has no body', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
