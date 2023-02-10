import { describe, expect, it } from 'vitest';
import { bcrypt } from '../../../__mocks__/bcrypt';

class EncrypterSpy {
  async compare(value, hash) {
    const isPasswordValid = await bcrypt.compare(value, hash);
    return isPasswordValid;
  }
}

const makeSut = () => {
  return new EncrypterSpy();
};

describe('Encrypter', () => {
  it('Should return true if bcrypt returns true', async () => {
    const sut = makeSut();
    const isPasswordValid = await sut.compare('any_value', 'hashed_value');
    expect(isPasswordValid).toBe(true);
  });

  it('Should return false if bcrypt returns false', async () => {
    const sut = makeSut();
    bcrypt.isPasswordValid = false;
    const isPasswordValid = await sut.compare('any_value', 'hashed_value');
    expect(isPasswordValid).toBe(false);
  });

  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    await sut.compare('any_value', 'hashed_value');
    expect(bcrypt.value).toBe('any_value');
    expect(bcrypt.hash).toBe('hashed_value');
  });
});
