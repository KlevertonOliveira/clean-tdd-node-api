export const bcrypt = {
  value: '',
  hash: '',
  isPasswordValid: true,
  async compare(value, hash) {
    this.value = value;
    this.hash = hash;
    return this.isPasswordValid;
  },
};
