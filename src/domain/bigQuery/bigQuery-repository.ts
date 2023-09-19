import { BoardVo } from '../board/board-vo';
import { WorkspaceVo } from '../board/workspace-vo';

type TransferResponse = {
  tableId: string;
  status: 'success' | 'partial_failure' | 'error';
  insertedPayload?: any[];
  errors?: any[]; // Assuming that errors are an array. You can refine this further.
  error?: string;
};

export abstract class BigQueryRepository {
  abstract createWorkspaces(workspaces: WorkspaceVo[]): Promise<string[]>;
  abstract createBoards(boards: BoardVo[]): Promise<any>;
  abstract transferDataToBoard(payload, table: any): Promise<TransferResponse>;
  abstract getItemsFromBoard(board: BoardVo): Promise<string[]>;
}
