export class CustomException extends Error {
  constructor(public code: number, public messages: Array<string> | string) {
    super()
  }
}