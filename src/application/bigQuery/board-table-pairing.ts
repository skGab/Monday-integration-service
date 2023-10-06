import { Table } from '@google-cloud/bigquery';
import { Board } from 'src/domain/entities/board/board';

export interface BoardTablePairs {
  board: Board;
  table: Table;
}

export class BoardTablePairing {
  run(mondayBoards: Board[], bigQueryTables: Table[]): BoardTablePairs[] {
    const boardTablePairs = mondayBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    return boardTablePairs;
  }
}
