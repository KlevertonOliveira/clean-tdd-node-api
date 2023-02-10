import { describe, expect, it } from 'vitest';

class Encrypter {
  async compare(password, hashedPassword) {
    return true;
  }
}

describe('Encrypter', () => {
  it('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter();
    const isPasswordValid = await sut.compare(
      'any_password',
      'hashed_password'
    );
    expect(isPasswordValid).toBe(true);
  });
});
