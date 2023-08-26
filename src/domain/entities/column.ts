import { Entity } from '../core/entity';

type ColumnProps = {
  title: string;
  id: string;
  type: string;
  boardId: number;
};

export class Column extends Entity<ColumnProps> {
  private constructor(props: ColumnProps, id?: string) {
    super(props, id);
  }

  static create(props: ColumnProps, id?: string) {
    const board = new Column(props, id);
    return board;
  }
}
