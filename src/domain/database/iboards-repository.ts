import { Board } from 'src/domain/entities/board';

export abstract class IBoardsRepository {
  // abstract transferAll(): Promise<Board[] | null>;
  abstract getAll(): Promise<Board[] | null>;
}
