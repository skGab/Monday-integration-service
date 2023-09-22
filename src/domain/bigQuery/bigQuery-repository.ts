import { BoardVo } from '../board/board-vo';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class TransferResponse {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: any[];
  errors?: any[]; // Assuming that errors are an array. You can refine this further.
  error?: string;
}

export abstract class BigQueryRepository {
  // GET ITEMS FROM BOARD
  abstract getItemsFromBoard(board: BoardVo): Promise<string[] | null>;

  // TRANSFER ITEMS TO BOARD
  abstract transferItemsToBoard(
    payload: any[],
    table: any,
  ): Promise<TransferResponse | null>;

  // UPDATE BOARD ITEMS
  abstract updateBoardItems(payload: any[], table: any): Promise<any | null>;

  // CREATE WORKSPACES
  abstract createWorkspaces(
    workspaces: WorkspaceVo[],
  ): Promise<string[] | null>;

  // CREATE BOARDS
  abstract createBoards(boards: BoardVo[]): Promise<any | null>;
}
