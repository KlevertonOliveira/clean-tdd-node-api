export const jwt = {
  id: '',
  secret: '',
  token: 'any_token',
  sign(id, secret) {
    this.id = id;
    this.secret = secret;
    return this.token;
  },
};
