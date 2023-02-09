import { StatusCodes } from 'http-status-codes';
import { describe, expect, it } from 'vitest';
import { ServerError } from '../errors';
import { InvalidParamError, MissingParamError } from '../../utils/errors';
import { LoginRouter } from './login-router';

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  return new AuthUseCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error('');
    }
  }
  return new AuthUseCaseSpy();
};

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email;
      return this.isEmailValid;
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid() {
      throw new Error('');
    }
  }

  return new EmailValidatorSpy();
};

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidator();
  const authUseCaseSpy = makeAuthUseCase();
  authUseCaseSpy.accessToken = 'valid_token';
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

describe('Login Router', () => {
  it('should return "BAD_REQUEST" (400) status if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'anything',
      },
    };

    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual(new MissingParamError('email'));
  });

  it('should return "BAD_REQUEST" (400) status if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'anything@test.com',
      },
    };

    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual(new MissingParamError('password'));
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if no httpRequest is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if httpRequest has no body', async () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'anything@test.com',
        password: 'any_password',
      },
    };

    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  it('should return "UNAUTHORIZED" (401) status when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: 'invalid_email@test.com',
        password: 'invalid_password',
      },
    };

    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it('should return "OK" (200) status when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'valid_email@test.com',
        password: 'valid_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.OK);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if AuthUseCase has no auth method', async () => {
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if AuthUseCase throws', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();
    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should return "BAD_REQUEST" (400) status if invalid email is provided', async () => {
    const { emailValidatorSpy, sut } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: 'invalid_email@test.com',
        password: 'anything',
      },
    };

    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toEqual(new InvalidParamError('email'));
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if no EmailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual(new ServerError());
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy, {});
    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual(new ServerError());
  });

  it('should return "INTERNAL_SERVER_ERROR" (500) status if EmailValidator throws', async () => {
    const emailValidatorSpy = makeEmailValidatorWithError();
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'anything@test.com',
        password: 'any_password',
      },
    };

    await sut.route(httpRequest);
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
  });
});
