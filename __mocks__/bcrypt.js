export const bcrypt = {
  isPasswordValid: true,
  async compare(value, hash) {
    return this.isPasswordValid;
  },
};
