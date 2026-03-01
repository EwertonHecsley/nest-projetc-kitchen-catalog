export abstract class DomainErrorException extends Error {
  public readonly name: string;
  public readonly code: string;

  protected constructor(message: string, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}
