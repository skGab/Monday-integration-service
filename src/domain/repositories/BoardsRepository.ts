import { Board } from '../entities/board';

export interface BoardsRepository {
  findAll(): Promise<Board[] | null>;
}
