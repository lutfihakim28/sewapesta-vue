export class ResponseDto<DataType, MetaType> {
  public code!: number;
  public messages!: string;
  public data: DataType;
  public meta: MetaType;

  constructor(data: ResponseDto<DataType, MetaType>) {
    this.code = data.code;
    this.messages = data.messages;
    this.data = data.data;
    this.meta = data.meta;
  }
}