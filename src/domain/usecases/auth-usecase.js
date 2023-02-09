import { InvalidParamError, MissingParamError } from '../../utils/errors';

export class AuthUseCase {
  constructor(getUserByEmailRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository;
  }
  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');
    if (!this.getUserByEmailRepository)
      throw new MissingParamError('getUserByEmailRepository');
    if (!this.getUserByEmailRepository.get)
      throw new InvalidParamError('getUserByEmailRepository');

    const user = await this.getUserByEmailRepository.get(email);
    if (!user) {
      return null;
    }
  }
}
