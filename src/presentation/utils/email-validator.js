import { validator } from '../../../__mocks__/validator';

export class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}
