import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { Injectable } from '@nestjs/common';
import { SanitizeColumn } from './sanitize-column';
import { BoardVo } from 'src/domain/board/board-vo';

@Injectable()
export class BigQuerySetupService {
  private sanitizeColumn: SanitizeColumn;

  constructor(private bigQueryRepository: BigQueryRepository) {
    this.sanitizeColumn = new SanitizeColumn();
  }

  async run(mondayBoards: BoardVo[]) {
    // SANITIZING BOARDS COLUMNS
    const validBoards = this.sanitize(mondayBoards);

    // CREATE BOARDS ON BIGQUERY
    const bigQueryTables = await this.bigQueryRepository.createBoards(
      validBoards,
    );

    // PREPARE BOARDS/TABLE TO INSERTION
    const boardTablePairs = validBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    return { boardTablePairs };
  }

  private sanitize(mondayBoards: BoardVo[]) {
    // FIXING MONDAY COLUMNS NAMES TO BIGQUERY ACCEPTANCE BOARDS
    const validBoards = mondayBoards.map((board) => {
      board.items = board.items.map((item) => {
        item.column_values = item.column_values.map((column) => {
          column.title = this.sanitizeColumn.run(column.title);
          return column;
        });
        return item;
      });
      return board;
    });
    return validBoards;
  }
}
