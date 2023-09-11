import { Board } from 'src/domain/entities/board';
import { Workspaces } from '../factory/types';

export abstract class BoardsRepository {
  // abstract transferAll(boards: Board[]): Promise<Board[] | null>;
  abstract getAll(): Promise<Board[] | null>;
  abstract getAllWorkSpaces(): Promise<Workspaces[] | null>;
}
