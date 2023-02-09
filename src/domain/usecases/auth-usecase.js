import { MissingParamError } from '../../utils/errors';

export class AuthUseCase {
  constructor(getUserByEmailRepository, encrypter, tokenGenerator) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
  }
  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const user = await this.getUserByEmailRepository.get(email);
    const isPasswordValid =
      user && (await this.encrypter.compare(password, user.password));

    if (user && isPasswordValid) {
      const accessToken = await this.tokenGenerator.generate(user.id);
      return accessToken;
    }

    return null;
  }
}
