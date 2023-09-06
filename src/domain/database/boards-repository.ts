import { Board } from 'src/domain/entities/board';

export abstract class BoardsRepository {
  abstract transferAll(
    workspaceId: string,
    tableId: string,
    boards: Board[],
  ): Promise<any[] | null>;
  abstract getAll(): Promise<Board[] | null>;
}
