import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/board/entities/board';
import { SanitizeColumn } from '../board/utils/sanitize-column';
import { Payload } from 'src/domain/response/payload';

@Injectable()
export class BigQuerySetupService {
  private sanitizeColumn: SanitizeColumn;

  constructor(private bigQueryRepositoryService: BigQueryRepository) {
    this.sanitizeColumn = new SanitizeColumn();
  }

  async run(payload: Payload, mondayBoards: Board[]) {
    try {
      const { boardTablePairs } = await this.setupBoards(mondayBoards);

      if (boardTablePairs === null) {
        payload.updateStatus({
          step: 'setupBoards',
          success: false,
          error: 'Algo deu errado durante a configuração de quadros e tabelas',
        });
        return { success: false };
      }

      boardTablePairs.map((pair) => payload.addTable(pair.table.id));

      payload.updateStatus({
        step: 'setupBoards',
        success: true,
      });

      return {
        success: true,
        data: boardTablePairs,
      };
    } catch (error) {
      payload.updateStatus({
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

    if (bigQueryTables === null) return null;

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
