import { Board } from '../entities/board/board';
import { Workspace } from '../entities/board/workspace';

export abstract class TransferResponse {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: { [key: string]: string }[];
  errors?: any[]; // Assuming that errors are an array. You can refine this further.
  error?: string;
}

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
  ): Promise<any[] | null>;

  // GET ITEMS FROM BOARD
  abstract getRows(board: Board): Promise<string[] | null>;
}
