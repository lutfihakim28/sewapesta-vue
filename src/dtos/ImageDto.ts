import { BaseDto } from './BaseDto';

export class ImageDto extends BaseDto {
  public url!: string;

  constructor(data: ImageDto) {
    super(data);
    this.url = data.url;
  }
}