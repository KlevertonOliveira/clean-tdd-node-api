import { describe, expect, it } from 'vitest';
import { MissingParamError } from '../../utils/errors';
class AuthUseCase {
  async auth(email) {
    if (!email) throw new MissingParamError('email');
  }
}

describe('Auth UseCase', () => {
  it('Should return null if no email is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });
});
