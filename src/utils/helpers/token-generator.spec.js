import { describe, it, expect } from 'vitest';
import { jwt } from '../../../__mocks__/jwt';
import { MissingParamError } from '../errors';
class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(id) {
    if (!this.secret) throw new MissingParamError('secret');
    if (!id) throw new MissingParamError('id');

    return jwt.sign(id, this.secret);
  }
}

const makeSut = () => {
  return new TokenGenerator('secret');
};

describe('Token Generator', () => {
  it('Should return null if JWT returns null', async () => {
    const sut = makeSut();
    jwt.token = null;
    const token = await sut.generate('any_id');
    expect(token).toBeNull();
  });

  it('Should return a token if JWT returns token', async () => {
    const sut = makeSut();
    const token = await sut.generate('any_id');
    expect(token).toBe(jwt.token);
  });

  it('Should call JWT with correct values', async () => {
    const sut = makeSut();
    await sut.generate('any_id');
    expect(jwt.id).toBe('any_id');
    expect(jwt.secret).toBe(sut.secret);
  });

  it('Should throw if no secret is provided', async () => {
    const sut = new TokenGenerator();
    const promise = sut.generate('any_id');
    await expect(promise).rejects.toThrow(new MissingParamError('secret'));
  });

  it('Should throw if no id is provided', async () => {
    const sut = makeSut();
    const promise = sut.generate();
    await expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
