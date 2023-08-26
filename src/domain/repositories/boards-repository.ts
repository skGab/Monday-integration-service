import { Board } from 'src/domain/entities/board';
export abstract class BoardsRepository {
  // abstract transferAll(): Promise<TransferBoardsDto[] | null>;
  abstract getAll(): Promise<Board[] | null>;
}
