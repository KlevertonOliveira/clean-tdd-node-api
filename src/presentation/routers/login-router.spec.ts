import { describe, expect, it } from 'vitest';

interface HttpRequest {
  body: {
    email: string;
    password: string;
  };
}

interface HttpResponse {
  statusCode: number;
}

class LoginRouter {
  route(httpRequest: HttpRequest) {
    const { email, password } = httpRequest.body;
    let httpResponse: HttpResponse = { statusCode: 200 };

    if (!email || !password) {
      httpResponse.statusCode = 400;
    }

    return httpResponse;
  }
}

describe('Login Router', () => {
  it('should return 400 if no email is provided', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {
      body: {
        password: 'anything',
      },
    };

    const httpResponse: HttpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });

  it('should return 400 if no password is provided', () => {
    const sut = new LoginRouter();
    const httpRequest: HttpRequest = {
      body: {
        email: 'anything@test.com',
      },
    };

    const httpResponse: HttpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
