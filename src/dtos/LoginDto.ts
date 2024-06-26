import { BaseDto } from './BaseDto';

// export class LoginResponseDto extends ResponseDto {
//   public data!: ResponseData;

//   constructor(data: LoginResponseDto) {
//     super(data)
//     this.data = new ResponseData(data.data)
//   }
// }

export class LoginDto {
  public token!: string;
  public user!: User;

  constructor(data: LoginDto) {
    this.token = data.token;
    this.user = new User(data.user);
  }
}

class User extends BaseDto {
  public username!: string;

  constructor(data: User) {
    super(data)
    this.username = data.username;
  }
}