import { Board } from 'src/domain/entities/board';
import { BoardFactory } from 'src/domain/factory/board-factory';
import { MondayService } from '../api/monday.service';
import { IBoardsRepository } from 'src/domain/repositories/iboards-repository';

export class BoardsRepository implements IBoardsRepository {
  constructor(
    private boardFactory: BoardFactory,
    private mondayService: MondayService,
  ) {}

  async getAll(): Promise<Board[] | null> {
    const response = await this.mondayService.run();

    if (!response) {
      return null;
    }

    return response.map((boardData) =>
      this.boardFactory.createBoard(boardData),
    );
  }

  async transferAll(): Promise<Board[] | null> {
    const response = this.getAll();

    if (!response) {
      return null;
    }

    return;
  }
}
