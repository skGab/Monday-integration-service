import { Board } from '../board/board';
import { WorkspaceVo } from '../board/workspace-vo';

export abstract class MondayRepository {
  abstract getBoards(): Promise<Board[] | null>;
  abstract getWorkSpaces(): Promise<WorkspaceVo[] | null>;
}
