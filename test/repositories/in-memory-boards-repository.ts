import { Board } from "src/domain/entities/board";
import { BoardsRepository } from "src/domain/repositories/BoardsRepository";

export class InMemoryBoardsRepository implements BoardsRepository {
  public items: Board[] = []

  findAll(): Promise<Board[] | null> {
    const response = this.items

    if (!response || response.length === 0) {
      return Promise.resolve(null);
    }

    return Promise.resolve(response);
  }
}
