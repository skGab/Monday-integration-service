import { BoardVo } from '../board/board-vo';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class MondayResponseVo {
  data: {
    boards: BoardVo[];
    workspaces: WorkspaceVo[];
  };
}
