import { StatusCodes } from 'http-status-codes';
import { describe, expect, it } from 'vitest';
import { MissingParamError } from '../helpers/missing-param-error';
import { LoginRouter } from './login-router';

const makeSut = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  authUseCaseSpy.accessToken = 'valid_token';
  const sut = new LoginRouter(authUseCaseSpy);
  return {
    sut,
    authUseCaseSpy,
  };
};

describe('Login Router', () => {
  it('should return "BAD_REQUEST" (400) status if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'anything',
      },
    };

    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual(new MissingParamError('email'));
  });

  it('should return "BAD_REQUEST" (400) status if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anything@test.com',
      },
    };

    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual(new MissingParamError('password'));
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if no httpRequest is provided', () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if httpRequest has no body', () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should call AuthUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'anything@test.com',
        password: 'any_password',
      },
    };

    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  it('should return "UNAUTHORIZED" (401) status when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: 'invalid_email@test.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it('should return "OK" (200) status when valid credentials are provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'valid_email@test.com',
        password: 'valid_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.OK);
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if no AuthUseCase is provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if AuthUseCase has no auth method', () => {
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
