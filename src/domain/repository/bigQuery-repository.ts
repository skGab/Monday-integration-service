import { Board } from '../entities/board/board';
import { Workspace } from '../entities/board/workspace';
import { TransferResponse } from '../entities/transfer';

export abstract class BigQueryRepository {
  // CREATE WORKSPACES
  abstract createDatasets(workspaces: Workspace[]): Promise<string[] | null>;

  // CREATE BOARDS
  abstract createTables(boards: Board[]): Promise<any | null>;

  // TRANSFER ITEMS TO BOARD
  abstract insertRows(
    payload: { [key: string]: string }[],
    table: any,
  ): Promise<TransferResponse | null>;

  // UPDATE BOARD ITEMS
  abstract updateRows(
    payload: { [key: string]: string }[],
    table: any,
  ): Promise<TransferResponse | null>;

  // GET ITEMS FROM BOARD
  abstract getRows(board: Board): Promise<string[] | null>;
}
