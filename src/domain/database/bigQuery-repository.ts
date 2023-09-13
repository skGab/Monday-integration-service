import { BoardVo, ItemVo, WorkspaceVo } from '../valueObjects/board-vo';

export abstract class BigQueryRepository {
  abstract createWorkspaces(workspaces: WorkspaceVo[]): Promise<any[]>;
  abstract createBoards(boards: BoardVo[]);
  abstract transferBoards(items: any[], tables: any[]);
}
