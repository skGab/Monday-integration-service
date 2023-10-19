import { Exclude } from 'class-transformer';

export class CoreDto<T> {
  @Exclude()
  public data: T[];

  constructor(
    data: T[],
    private names: string[] | string,
    private count: number,
    private status: string,
  ) {
    this.data = data;
  }
}
