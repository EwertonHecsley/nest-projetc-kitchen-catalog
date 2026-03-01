import Identity from './Identity';

export default class Entity<T> {
  private readonly _identity: Identity;
  protected attributes: T;

  protected constructor(attributes: T, id?: Identity) {
    this._identity = id ?? new Identity();
    this.attributes = attributes;
  }

  get identity(): Identity {
    return this._identity;
  }
}
