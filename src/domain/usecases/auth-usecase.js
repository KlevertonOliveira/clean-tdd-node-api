import { MissingParamError } from '../../utils/errors';

export class AuthUseCase {
  constructor(args = {}) {
    this.getUserByEmailRepository = args.getUserByEmailRepository;
    this.encrypter = args.encrypter;
    this.tokenGenerator = args.tokenGenerator;
    this.updateAccessTokenRepository = args.updateAccessTokenRepository;
  }
  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');

    const user = await this.getUserByEmailRepository.get(email);
    const isPasswordValid =
      user && (await this.encrypter.compare(password, user.password));

    if (user && isPasswordValid) {
      const accessToken = await this.tokenGenerator.generate(user.id);
      await this.updateAccessTokenRepository.update(user.id, accessToken);
      return accessToken;
    }

    return null;
  }
}
