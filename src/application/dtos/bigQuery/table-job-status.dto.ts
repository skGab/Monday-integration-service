import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { SharedShape } from '../core/payload.dto';
import { Exclude } from 'class-transformer';

export interface OperationStatus {
  newTables: SharedShape | string;
  updatedTables?: SharedShape | string;
}

export class TableJobStatusDto {
  @Exclude()
  private mondayBoards: BoardEntity[] | string;

  constructor(
    mondayBoards?: BoardEntity[] | string,
    private existingTables?: string[] | string,
    private operationStatus?: OperationStatus,
  ) {
    this.mondayBoards = mondayBoards;
  }
}
