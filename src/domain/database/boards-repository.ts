import { Board } from 'src/domain/entities/board';
import { Workspaces } from '../factory/types';

export abstract class BoardsRepository {
  abstract transferAll(boards: Board[]): Promise<Board[] | null>;
  abstract getBoards(): Promise<Board[] | null>;
  abstract getWorkSpaces(): Promise<Workspaces[] | null>;
}
