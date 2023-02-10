import { describe, expect, it } from 'vitest';
import { bcrypt } from '../../../__mocks__/bcrypt';

class Encrypter {
  async compare(value, hash) {
    const isPasswordValid = await bcrypt.compare(value, hash);
    return isPasswordValid;
  }
}

describe('Encrypter', () => {
  it('Should return true if bcrypt returns true', async () => {
    const sut = new Encrypter();
    const isPasswordValid = await sut.compare('any_value', 'hashed_value');
    expect(isPasswordValid).toBe(true);
  });

  it('Should return false if bcrypt returns false', async () => {
    const sut = new Encrypter();
    bcrypt.isPasswordValid = false;
    const isPasswordValid = await sut.compare('any_value', 'hashed_value');
    expect(isPasswordValid).toBe(false);
  });
});
