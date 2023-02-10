import validator from 'validator';
export class EmailValidator {
  isValid(email) {
    if (!email) throw new MissingParamError('email');
    return validator.isEmail(email);
  }
}
