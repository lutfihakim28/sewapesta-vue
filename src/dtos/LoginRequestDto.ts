export class LoginRequestDto {
  public username?: string;
  public password?: string;

  constructor(data?: LoginRequestDto) {
    this.username = data?.username;
    this.password = data?.password;
  }
}