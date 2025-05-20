export class LoginResponse {
  public token!: string;

  constructor(data: unknown) {
    const _data = data as LoginResponse;

    this.token = _data.token
  }
}