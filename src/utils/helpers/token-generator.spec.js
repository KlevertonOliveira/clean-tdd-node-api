import { describe, it, expect } from 'vitest';
import { jwt } from '../../../__mocks__/jwt';
class TokenGenerator {
  async generate(id) {
    return jwt.sign(id, 'secret');
  }
}

describe('Token Generator', () => {
  it('Should return null if JWT returns null', async () => {
    const sut = new TokenGenerator();
    jwt.token = null;
    const token = await sut.generate('any_id');
    expect(token).toBeNull();
  });

  it('Should return a token if JWT returns token', async () => {
    const sut = new TokenGenerator();
    const token = await sut.generate('any_id');
    expect(token).toBe(jwt.token);
  });
});
