import { describe, expect, it } from 'vitest';
import { validator } from '../../../__mocks__/validator';
class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

describe('Email Validator', () => {
  it('Should return true if validator returns true', () => {
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('valid_email@test.com');
    expect(isEmailValid).toBe(true);
  });

  it('Should return false if validator returns false', () => {
    validator.isEmailValid = false;
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('invalid_email@test.com');
    expect(isEmailValid).toBe(false);
  });
});
