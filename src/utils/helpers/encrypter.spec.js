import { describe, expect, it } from 'vitest';
import { bcrypt } from '../../../__mocks__/bcrypt';
import { MissingParamError } from '../errors';
class EncrypterSpy {
  async compare(value, hash) {
    if (!value) throw new MissingParamError('value');
    if (!hash) throw new MissingParamError('hash');

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

  it('Should throw if no params are provided', async () => {
    const sut = makeSut();
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value'));
    expect(sut.compare('any_value')).rejects.toThrow(
      new MissingParamError('hash')
    );
  });
});
