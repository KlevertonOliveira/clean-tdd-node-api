type ParamName = 'email' | 'password';

export class MissingParamError extends Error {
  constructor(paramName: ParamName) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamError';
  }
}
