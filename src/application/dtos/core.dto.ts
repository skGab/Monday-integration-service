import { Exclude } from 'class-transformer';

export class CoreDto<T> {
  @Exclude()
  public data: T[] | null;

  constructor(
    data: T[] | null,
    private names: string[] | [],
    private count: number,
    private status: string,
  ) {
    this.data = data;
  }
}
