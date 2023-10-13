import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { SharedShape } from '../core/payload.dto';
import { Exclude } from 'class-transformer';

export class TableJobStatusDto {
  @Exclude()
  private mondayBoards: BoardEntity[];

  constructor(
    mondayBoards: BoardEntity[],
    private bigQueryTables?: string[] | string,
    private newTables?: SharedShape,
    private updatedTables?: SharedShape,
  ) {
    this.mondayBoards = mondayBoards;
  }
}
