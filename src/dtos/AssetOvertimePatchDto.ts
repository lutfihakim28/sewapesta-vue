export class AssetOvertimePatchDto {
  public hasOvertime!: boolean;

  constructor(data: AssetOvertimePatchDto) {
    this.hasOvertime = data.hasOvertime;
  }
}