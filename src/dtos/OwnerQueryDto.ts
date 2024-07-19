import { OwnerTypeEnum } from '@/enums/OwnerTypeEnum';
import { QueryDto } from './QueryDto';

export class OwnerQueryDto extends QueryDto {
  public type?: OwnerTypeEnum;

  constructor(data: OwnerQueryDto) {
    super(data);
    this.type = data.type;
  }
}