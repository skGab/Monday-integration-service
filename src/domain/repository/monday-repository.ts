import { BoardEntity } from '../entities/board/board-entity';
import { WorkspaceEntity } from '../entities/board/workspace-entity';

export abstract class MondayRepository {
  abstract getBoards(): Promise<BoardEntity[] | null>;
  abstract getWorkSpaces(): Promise<WorkspaceEntity[] | null>;
}
