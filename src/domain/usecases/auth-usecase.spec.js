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

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate() {
      throw new Error();
    }
  }

  return new TokenGeneratorSpy();
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

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error();
    }
  }

  return new EncrypterSpy();
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

const makeGetUserByEmailRepositoryWithError = () => {
  class GetUserByEmailRepositorySpy {
    async get() {
      throw new Error();
    }
  }

  return new GetUserByEmailRepositorySpy();
};

const makeSut = () => {
  const tokenGeneratorSpy = makeTokenGenerator();
  const encrypterSpy = makeEncrypter();
  const getUserByEmailRepositorySpy = makeGetUserByEmailRepository();
  const sut = new AuthUseCase({
    getUserByEmailRepository: getUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  });

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

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, getUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth('valid_email@test.com', 'valid_password');
    expect(tokenGeneratorSpy.userId).toBe(getUserByEmailRepositorySpy.user.id);
  });

  it('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth(
      'valid_email@test.com',
      'valid_password'
    );
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  it('Should throw if invalid dependency is provided', async () => {
    const invalid = {};
    const getUserByEmailRepository = makeGetUserByEmailRepository();
    const encrypter = makeEncrypter();
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({
        getUserByEmailRepository: null,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        getUserByEmailRepository: invalid,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        getUserByEmailRepository,
        encrypter: null,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        getUserByEmailRepository,
        encrypter: invalid,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        getUserByEmailRepository,
        encrypter,
        tokenGenerator: null,
      }),
      new AuthUseCase({
        getUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid,
      })
    );

    suts.forEach((sut) => {
      const promise = sut.auth('any_email@test.com', 'any_password');
      expect(promise).rejects.toThrow();
    });
  });

  it('Should throw if any dependency throws', async () => {
    const getUserByEmailRepository = makeGetUserByEmailRepository();
    const encrypter = makeEncrypter();
    const suts = [].concat(
      new AuthUseCase({
        getUserByEmailRepository: makeGetUserByEmailRepositoryWithError(),
      }),
      new AuthUseCase({
        getUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
      }),
      new AuthUseCase({
        getUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
      })
    );

    suts.forEach((sut) => {
      const promise = sut.auth('any_email@test.com', 'any_password');
      expect(promise).rejects.toThrow();
    });
  });
});
