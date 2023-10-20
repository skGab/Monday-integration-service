import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { SharedShape } from '../core/payload.dto';
import { Exclude } from 'class-transformer';
import { BoardDto } from '../monday/monday.dto';

// export interface Changes {
//   tableName: string;
//   old_values: string[];
//   current_values: string[];
//   recordsNumber: number;
// }

// export interface UpdatedShape {
//   names: string[];
//   count: number;
//   changes: Changes[];
//   status: string;
// }

export class TableJobStatusDto {
  @Exclude()
  public boardDto: BoardDto;

  constructor(
    private avaliableTables: string | string[],
    private newTables: SharedShape | string,
    boardDto: BoardDto,
  ) {
    this.boardDto = boardDto;
  }
}
