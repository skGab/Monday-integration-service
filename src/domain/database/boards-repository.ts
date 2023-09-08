import { Board } from 'src/domain/entities/board';

export abstract class BoardsRepository {
  abstract transferAll(boards: Board[]): Promise<Board[] | null>;
  abstract getAll(): Promise<Board[] | null>;
}
