import { BoardVo } from '../board/board-vo';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class MondayRepository {
  abstract getBoards(): Promise<BoardVo[] | null>;
  abstract getWorkSpaces(): Promise<WorkspaceVo[] | null>;
}
