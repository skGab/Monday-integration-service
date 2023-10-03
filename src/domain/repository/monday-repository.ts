import { Board } from '../entities/board/board';
import { Workspace } from '../entities/board/workspace';

export abstract class MondayRepository {
  abstract getBoards(): Promise<Board[]>;
  abstract getWorkSpaces(): Promise<Workspace[]>;
}
