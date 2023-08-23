import { Board } from '../entities/board';

export const BOARDS_REPOSITORY = 'BOARDS_REPOSITORY';

export interface BoardsRepository {
  getAll(): Promise<Board[] | null>;
}
