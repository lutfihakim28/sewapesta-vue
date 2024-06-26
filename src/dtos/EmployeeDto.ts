import { BaseDto } from './BaseDto';

export class EmployeeDto extends BaseDto {
  public name!: string;
  public phone!: string;

  constructor(data: EmployeeDto) {
    super(data);
    this.name = data.name;
    this.phone = data.phone;
  }
}