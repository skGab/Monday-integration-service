import { Board } from '../entities/board/board';
import { Workspace } from '../entities/board/workspace';

export abstract class MondayRepository {
  abstract getBoards(): Promise<Board[] | null>;
  abstract getWorkSpaces(): Promise<Workspace[] | null>;
}
