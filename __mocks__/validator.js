export const validator = {
  email: '',
  isEmailValid: true,
  isEmail(email) {
    this.email = email;
    return this.isEmailValid;
  },
};
