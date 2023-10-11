import { Table } from '@google-cloud/bigquery';
import { BoardEntity } from 'src/domain/entities/board/board-entity';

export interface BoardTablePairs {
  board: BoardEntity;
  table: Table;
}

export class BoardTablePairing {
  run(mondayBoards: BoardEntity[], bigQueryTables: Table[]): BoardTablePairs[] {
    const boardTablePairs = mondayBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    return boardTablePairs;
  }
}
