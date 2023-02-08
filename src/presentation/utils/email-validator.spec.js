import { describe, expect, it } from 'vitest';
import { validator } from '../../../__mocks__/validator';
import { EmailValidator } from './email-validator';

const makeSut = () => {
  return new EmailValidator();
};

describe('Email Validator', () => {
  it('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid('valid_email@test.com');
    expect(isEmailValid).toBe(true);
  });

  it('Should return false if validator returns false', () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid('invalid_email@test.com');
    expect(isEmailValid).toBe(false);
  });

  it('Should call validator with correct email', () => {
    const sut = makeSut();
    const testEmail = 'any_email@test.com';
    sut.isValid(testEmail);
    expect(validator.email).toBe(testEmail);
  });
});
