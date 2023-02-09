import { describe, expect, it } from 'vitest';
import { MissingParamError } from '../../utils/errors';
import { AuthUseCase } from './auth-usecase';

const makeSut = () => {
  class GetUserByEmailRepositorySpy {
    async get(email) {
      this.email = email;
    }
  }
  const getUserByEmailRepositorySpy = new GetUserByEmailRepositorySpy();
  const sut = new AuthUseCase(getUserByEmailRepositorySpy);

  return {
    sut,
    getUserByEmailRepositorySpy,
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

  it('Should return null if getUserByEmailRepository returns null', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(
      'invalid_email@test.com',
      'any_password'
    );
    expect(accessToken).toBeNull();
  });
});
