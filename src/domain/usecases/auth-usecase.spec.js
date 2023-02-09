import { describe, expect, it } from 'vitest';
import { MissingParamError } from '../../utils/errors';

class AuthUseCase {
  constructor(getUserByEmailRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository;
  }
  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');
    await this.getUserByEmailRepository.get(email);
  }
}

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
    expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  it('Should call getUserByEmailRepository with correct email', async () => {
    const { sut, getUserByEmailRepositorySpy } = makeSut();
    await sut.auth('any_email@test.com', 'any_password');
    expect(getUserByEmailRepositorySpy.email).toBe('any_email@test.com');
  });
});
