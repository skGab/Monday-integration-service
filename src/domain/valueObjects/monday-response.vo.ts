import { Board } from 'src/domain/entities/board/board';
import { Workspace } from 'src/domain/entities/board/workspace';

export abstract class MondayResponseVo {
  data: {
    boards: Board[];
    workspaces: Workspace[];
  };
}
