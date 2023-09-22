import { BoardVo } from '../board/board';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class MondayResponseVo {
  data: {
    boards: BoardVo[];
    workspaces: WorkspaceVo[];
  };
}
