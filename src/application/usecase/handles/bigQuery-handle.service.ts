import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import { SanitizeColumn } from '../../utils/sanitize-column';
import { PayloadDto } from 'src/application/dto/payload.dto';

export abstract class BoardTablePairs {
  public board: Board;
  public table: unknown;
}

@Injectable()
export class BigQueryHandleService {
  private sanitizeColumn: SanitizeColumn;

  constructor(private bigQueryRepositoryService: BigQueryRepository) {
    this.sanitizeColumn = new SanitizeColumn();
  }

  async run(payload: PayloadDto, mondayBoards: Board[]) {
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
