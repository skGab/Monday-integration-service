import { Board } from '../board/entities/board';
import { Workspace } from '../board/entities/workspace';

export abstract class MondayRepository {
  abstract getBoards(): Promise<Board[] | null>;
  abstract getWorkSpaces(): Promise<Workspace[] | null>;
}
