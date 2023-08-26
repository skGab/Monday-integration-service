import { Entity } from '../core/entity';

type GroupProps = {
  title: string;
  id: string;
  boardId: number;
};

export class Group extends Entity<GroupProps> {
  private constructor(props: GroupProps, id?: string) {
    super(props, id);
  }

  static create(props: GroupProps, id?: string) {
    const board = new Group(props, id);
    return board;
  }
}
