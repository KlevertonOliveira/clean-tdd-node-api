import bcrypt from 'bcrypt';

export class Encrypter {
  async compare(value, hash) {
    const isPasswordValid = await bcrypt.compare(value, hash);
    return isPasswordValid;
  }
}
