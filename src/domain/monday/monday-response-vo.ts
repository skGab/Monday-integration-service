import { Board } from '../board/entities/board';
import { Workspace } from '../board/entities/workspace';

export abstract class MondayResponseVo {
  data: {
    boards: Board[];
    workspaces: Workspace[];
  };
}
