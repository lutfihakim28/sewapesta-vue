import { Meta } from './Meta';

export class ApiResponse {
  public code!: number
  public messages!: string[]

  constructor(response: unknown) {
    const _response = response as ApiResponse;
    this.code = _response.code
    this.messages = _response.messages
  }
}

export class ApiResponseData<T> extends ApiResponse {
  public data!: T
  constructor(data: unknown, dataClass: new (prop: T) => T) {
    super(data)
    const _data = data as ApiResponseData<T>
    this.data = new dataClass(_data.data);
  }
}

export class ApiResponseList<T> extends ApiResponse {
  public data: T[]
  public meta: Meta

  constructor(response: unknown, dataClass: new (prop: T) => T) {
    super(response)
    const _response = response as ApiResponseList<T>;
    this.data = _response.data.map((_data) => new dataClass(_data))
    this.meta = new Meta(_response.meta)
  }
}
