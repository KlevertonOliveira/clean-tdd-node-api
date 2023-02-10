import bcrypt from 'bcrypt';
import { MissingParamError } from '../errors';

export class Encrypter {
  async compare(value, hash) {
    if (!value) throw new MissingParamError('value');
    if (!hash) throw new MissingParamError('hash');

    const isPasswordValid = await bcrypt.compare(value, hash);
    return isPasswordValid;
  }
}
