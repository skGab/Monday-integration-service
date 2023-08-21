import { v4 as uuidv4 } from 'uuid';
export abstract class Entity<T> {
  constructor(public props: T, protected _id?: string) {
    this._id = _id ?? uuidv4();
  }

  get id() {
    return this._id
  }
}
