export class ApplicationExpection extends Error {
  statusCode: number;

  constructor(msg: string, statusCode: number, options?: ErrorOptions) {
    super(msg, options);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends ApplicationExpection {
  constructor(msg: string) {
    super(msg, 422);
  }
}
