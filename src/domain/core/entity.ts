export abstract class Entity<T> {
  constructor(private props: T, private _id?: string) {
    this._id = _id ?? crypto.randomUUID();
  }
}
