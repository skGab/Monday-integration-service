import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { SharedShape } from '../core/payload.dto';

export class TableJobStatusDto {
  constructor(
    private mondayBoards: BoardEntity[],
    private bigQueryTables: string[],
    private newTables?: SharedShape,
    private updatedTables?: SharedShape,
  ) {}
}
