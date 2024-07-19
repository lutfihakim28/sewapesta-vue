import { BaseDto } from './BaseDto';

export class UnitDto extends BaseDto {
  public name!: string;

  constructor(data: UnitDto) {
    super(data);
    this.name = data.name;
  }
}