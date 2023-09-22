import { Board } from '../board/board';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class TransferResponse {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: any[];
  errors?: any[]; // Assuming that errors are an array. You can refine this further.
  error?: string;
}

export abstract class BigQueryRepository {
  // CREATE WORKSPACES
  abstract createDatasets(workspaces: WorkspaceVo[]): Promise<string[] | null>;

  // CREATE BOARDS
  abstract createTables(boards: Board[]): Promise<any | null>;

  // TRANSFER ITEMS TO BOARD
  abstract insertRows(
    payload: any[],
    table: any,
  ): Promise<TransferResponse | null>;

  // UPDATE BOARD ITEMS
  abstract updateRows(payload: any[], table: any): Promise<any[] | null>;

  // GET ITEMS FROM BOARD
  abstract getRows(board: Board): Promise<string[] | null>;
}
