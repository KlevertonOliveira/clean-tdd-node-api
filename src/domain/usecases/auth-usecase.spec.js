import { describe, expect, it } from 'vitest';
import { MissingParamError } from '../../utils/errors';
import { AuthUseCase } from './auth-usecase';

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = 'any_token';
  return tokenGeneratorSpy;
};

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }

  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return encrypterSpy;
};

const makeGetUserByEmailRepository = () => {
  class GetUserByEmailRepositorySpy {
    async get(email) {
      this.email = email;
      return this.user;
    }
  }

  const getUserByEmailRepositorySpy = new GetUserByEmailRepositorySpy();
  getUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password',
  };
  return getUserByEmailRepositorySpy;
};

const makeSut = () => {
  const tokenGeneratorSpy = makeTokenGenerator();
  const encrypterSpy = makeEncrypter();
  const getUserByEmailRepositorySpy = makeGetUserByEmailRepository();
  const sut = new AuthUseCase(
    getUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
  );

  return {
    sut,
    getUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
  };
};

describe('Auth UseCase', () => {
  it('Should throw MissingParamError if no email is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  it('Should throw MissingParamError if no password is provided', async () => {
    const { sut } = makeSut();
    const promise = sut.auth('any_email@test.com');
    await expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  it('Should call getUserByEmailRepository with correct email', async () => {
    const { sut, getUserByEmailRepositorySpy } = makeSut();
    await sut.auth('any_email@test.com', 'any_password');
    expect(getUserByEmailRepositorySpy.email).toBe('any_email@test.com');
  });

  it('Should throw if no getUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@test.com', 'any_password');
    expect(promise).rejects.toThrow();
  });

  it('Should throw if getUserByEmailRepository has no get method', async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth('any_email@test.com', 'any_password');
    expect(promise).rejects.toThrow();
  });

  it('Should return null if an invalid email is provided', async () => {
    const { sut, getUserByEmailRepositorySpy } = makeSut();
    getUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth(
      'invalid_email@test.com',
      'any_password'
    );
    expect(accessToken).toBeNull();
  });

  it('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth(
      'valid_email@test.com',
      'invalid_password'
    );
    expect(accessToken).toBeNull();
  });

  it('Should call Encrypter with correct values', async () => {
    const { sut, getUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth('valid_email@test.com', 'any_password');
    expect(encrypterSpy.password).toBe('any_password');
    expect(encrypterSpy.hashedPassword).toBe(
      getUserByEmailRepositorySpy.user.password
    );
  });

  it('Should call TokenGenerator with userId', async () => {
    const { sut, getUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth('valid_email@test.com', 'valid_password');
    expect(tokenGeneratorSpy.userId).toBe(getUserByEmailRepositorySpy.user.id);
  });
});
