import { BoardVo } from '../board/board-vo';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class BigQueryRepository {
  abstract createWorkspaces(workspaces: WorkspaceVo[]): Promise<any[]>;
  abstract createBoards(boards: BoardVo[]);
  abstract transferBoards(items: any[], tables: any[]);
}
