import { TableVo } from './../../domain/valueObjects/table.vo';
import { ServiceResponse } from '../../domain/factory/response-factory';
import { Injectable } from '@nestjs/common';
import { BigQueryRepository } from 'src/domain/repository/bigQuery-repository';
import { Board } from 'src/domain/entities/board/board';
import { ResponseFactory } from 'src/domain/factory/response-factory';
import { Table } from '@google-cloud/bigquery';

export abstract class BigQueryResponse {
  boardTablePairs: BoardTablePairs[];
  bigQueryItemsId: string[];
  tables: TableVo;
}

export abstract class BoardTablePairs {
  public board: Board;
  public table: Table;
}

@Injectable()
export class BigQueryHandleService {
  constructor(private bigQueryRepositoryService: BigQueryRepository) {}

  async run(mondayBoards: Board[]): Promise<ServiceResponse<BigQueryResponse>> {
    return ResponseFactory.run(this.internalRun(mondayBoards));
  }

  private async internalRun(mondayBoards: Board[]): Promise<BigQueryResponse> {
    const bigQueryItemsId: string[] = [];

    // GETTING ROWS ON BIGQUERY FROM BOARDS
    for (const board of mondayBoards) {
      const ids = await this.bigQueryRepositoryService.getRows(board);
      bigQueryItemsId.push(...ids);
    }

    // SET UP BOARDS AND TABLES
    const boardTablePairs = await this.setupBoards(mondayBoards);

    // MAP THOUGH BOARDTABLEPAIRS AND UPDATE THE PAYLOAD TABLES
    const tablesNames = boardTablePairs.map((pair) => pair.table.id);
    const tables = new TableVo(tablesNames);

    return {
      boardTablePairs,
      bigQueryItemsId,
      tables,
    };
  }

  private async setupBoards(mondayBoards: Board[]): Promise<BoardTablePairs[]> {
    // SANITIZING BOARDS COLUMNS
    const { validBoards } = this.sanitize(mondayBoards);

    // CREATE BOARDS ON BIGQUERY AND CREATE WORKSPACES IF NOT EXIST
    const bigQueryTables = await this.bigQueryRepositoryService.createTables(
      validBoards,
    );

    if (bigQueryTables === null) return null;

    // PREPARE BOARDS/TABLE TO INSERTION
    const { boardTablePairs } = this.boardsAndTablesAssociation(
      validBoards,
      bigQueryTables,
    );

    return boardTablePairs;
  }

  boardsAndTablesAssociation(validBoards: Board[], bigQueryTables: any) {
    const boardTablePairs = validBoards.map((board, index) => ({
      board,
      table: bigQueryTables[index],
    }));

    return { boardTablePairs };
  }

  sanitize(mondayBoards: Board[]) {
    const validBoards = mondayBoards.map((board) => {
      board.items = board.items.map((item) => {
        return item.sanitize();
      });
      return board;
    });

    return { validBoards };
  }
}
