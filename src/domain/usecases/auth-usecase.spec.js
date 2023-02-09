import { describe, expect, it } from 'vitest';

class AuthUseCase {
  async auth(email) {
    if (!email) throw new Error();
  }
}

describe('Auth UseCase', () => {
  it('Should return null if no email is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow();
  });
});
