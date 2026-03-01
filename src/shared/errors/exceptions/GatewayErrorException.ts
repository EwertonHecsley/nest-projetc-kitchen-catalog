export abstract class GatewayError extends Error {
  public readonly code: string;

  constructor(message: string, code = 'GATEWAY_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}
