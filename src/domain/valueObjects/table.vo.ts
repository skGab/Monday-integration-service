import { BodyShape } from '../entities/payload';

export class TableVo {
  private names: string[];
  private count: number;
  private message?: string;

  constructor({ names, count, message }: BodyShape) {
    this.names = names;
    this.count = count;
    this.message = message;
  }
}
