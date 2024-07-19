import { OwnerType, OwnerTypeEnum } from '@/enums/OwnerTypeEnum';
import { BaseDto } from './BaseDto';

export class OwnerDto extends BaseDto {
  public name!: string;
  public phone!: string;
  public type!: OwnerTypeEnum;

  constructor(data: OwnerDto) {
    super(data);
    this.name = data.name;
    this.phone = data.phone;
    this.type = data.type;
  }

  public get _type() {
    return OwnerType[this.type]
  }
}