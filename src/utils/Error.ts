export class ApplicationExpection extends Error {
  statusCode: number;

  constructor(msg: string, statusCode: number, options?: ErrorOptions) {
    super(msg, options);
    this.statusCode = statusCode;
  }
}
