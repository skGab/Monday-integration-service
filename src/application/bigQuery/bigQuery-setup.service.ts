import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/board/board';
import { SanitizeColumn } from '../board/utils/sanitize-column';

@Injectable()
export class BigQuerySetupService {
  private sanitizeColumn: SanitizeColumn;

  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(payload: any, mondayBoards: Board[]) {
    try {
      const { boardTablePairs } = await this.setupBoards(mondayBoards);

      if (boardTablePairs === null) {
        payload.status.push({
          step: 'setupBoards',
          success: false,
          error: 'Something went wrong during board and table preparation',
        });
        return { success: false };
      }

      payload.bqTables = boardTablePairs.map((pair) => pair.table.id);
      payload.status.push({
        step: 'setupBoards',
        success: true,
      });

      return {
        success: true,
        data: boardTablePairs.map((pair) => pair.table.id),
      };
    } catch (error) {
      payload.status.push({
        step: 'setupBoards',
        success: false,
        error: error.message,
      });
      return { success: false };
    }
  }

  private async setupBoards(mondayBoards: Board[]) {
    // SANITIZING BOARDS COLUMNS
    const validBoards = this.sanitize(mondayBoards);

    // CREATE BOARDS ON BIGQUERY AND CREATE WORKSPACES IF NOT EXIST
    const bigQueryTables = await this.bigQueryRepositoryService.createTables(
      validBoards,
    );

    if (bigQueryTables === null) {
      throw new Error(`Falha durante a busca/criação de tabelas/boards`);
    }

    // PREPARE BOARDS/TABLE TO INSERTION
    const boardTablePairs = validBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    return { boardTablePairs };
  }

  private sanitize(mondayBoards: Board[]) {
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
