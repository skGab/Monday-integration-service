import { Board } from '../entities/board';

export interface BoardsRepository {
  getAll(): Promise<Board[] | null>;
}
