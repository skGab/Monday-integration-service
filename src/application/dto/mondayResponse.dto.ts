import { Board } from 'src/domain/entities/board/board';
import { Workspace } from 'src/domain/entities/board/workspace';

export abstract class MondayResponseDto {
  data: {
    boards: Board[];
    workspaces: Workspace[];
  };
}
