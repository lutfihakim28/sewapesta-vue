import { BaseDto } from './BaseDto';

export class VehicleDto extends BaseDto {
  public name!: string;
  public licenseNumber!: string;

  constructor(data: VehicleDto) {
    super(data);
    this.name = data.name;
    this.licenseNumber = data.licenseNumber;
  }
}