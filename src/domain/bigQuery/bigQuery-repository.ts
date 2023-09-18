import { BoardVo } from '../board/board-vo';
import { ItemVo } from '../board/item.vo';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class BigQueryRepository {
  abstract createWorkspaces(workspaces: WorkspaceVo[]): Promise<string[]>;
  abstract createBoards(boards: BoardVo[]);
  abstract transferBoards(items, boards: any[]);
}
