import { BoardVo, WorkspaceVo } from '../valueObjects/board-vo';

export abstract class MondayRepository {
  abstract getBoards(): Promise<BoardVo[] | null>;
  abstract getWorkSpaces(): Promise<WorkspaceVo[] | null>;
}
