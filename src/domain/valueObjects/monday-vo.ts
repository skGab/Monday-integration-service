import { BoardVo, WorkspaceVo } from './board-vo';

export abstract class MondayResponseVo {
  data: {
    boards: BoardVo[];
    workspaces: WorkspaceVo[];
  };
}
