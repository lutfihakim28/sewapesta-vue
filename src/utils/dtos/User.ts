import { RoleEnum } from '../enums/role';

export class User {
  public id!: number;
  public username!: string;
  public roles!: RoleEnum[]

  constructor(data: User) {
    this.id = data.id;
    this.username = data.username;
    this.roles = data.roles.map((role) => RoleEnum[role]);
  }
}