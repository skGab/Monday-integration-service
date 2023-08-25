import { Board } from '../entities/board';
export abstract class BoardsRepository {
  abstract getAll(): Promise<Board[] | null>;
}
