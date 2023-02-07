export class AuthUseCaseSpy {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  auth(email: string, password: string) {
    if (email === this.email) console.log('Same email!');
    if (password === this.password) console.log('Same password!');
  }
}
